import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPRDiff, getPRFiles, postPRComment } from "@/lib/github/api";
import { getInstallationToken } from "@/lib/github/token";
import { generatePRDescription } from "@/lib/ai/generate";

export async function POST(request: NextRequest) {
  const payload = await request.json();

  const event = request.headers.get("x-github-event");
  const deliveryId = request.headers.get("x-github-delivery");

  if (!event || !deliveryId) {
    return NextResponse.json({ error: "Missing headers" }, { status: 400 });
  }

  if (event !== "pull_request") {
    return NextResponse.json({ ok: true, message: "Ignored event type" });
  }

  const pr = payload.pull_request;
  const repo = payload.repository;
  const installationId = payload.installation?.id;

  if (!pr || !repo || !installationId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  if (pr.state !== "open") {
    return NextResponse.json({ ok: true, message: "PR not open" });
  }

  const supabase = createAdminClient();

  try {
    const { data: existingRepo } = await supabase
      .from("repos")
      .select("id")
      .eq("id", repo.id)
      .single();

    if (!existingRepo) {
      await supabase.from("repos").insert({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        owner: repo.owner.login,
        installation_id: installationId,
        default_branch: repo.default_branch,
      });
    }

    const { data: existingPR } = await supabase
      .from("prs")
      .select("id")
      .eq("repo_id", repo.id)
      .eq("number", pr.number)
      .single();

    if (!existingPR) {
      await supabase.from("prs").insert({
        id: pr.id,
        repo_id: repo.id,
        number: pr.number,
        title: pr.title,
        description: pr.body,
        branch: pr.head.ref,
        base_branch: pr.base.ref,
        author: pr.user.login,
        state: "open",
      });
    }

    const token = await getInstallationToken(installationId);
    const owner = repo.owner.login;
    const repoName = repo.name;

    const [diff, files] = await Promise.all([
      getPRDiff(owner, repoName, pr.number, token),
      getPRFiles(owner, repoName, pr.number, token),
    ]);

    const aiDescription = await generatePRDescription({
      title: pr.title,
      diff,
      files: files.map((f) => ({
        filename: f.filename,
        status: f.status,
        additions: f.additions,
        deletions: f.deletions,
      })),
    });

    await postPRComment(owner, repoName, pr.number, aiDescription, token);

    await supabase
      .from("prs")
      .update({
        ai_description: aiDescription,
        ai_description_generated: true,
        updated_at: new Date().toISOString(),
      })
      .eq("repo_id", repo.id)
      .eq("number", pr.number);

    return NextResponse.json({
      ok: true,
      pr: pr.number,
      description_generated: true,
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
