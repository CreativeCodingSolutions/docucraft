import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateChangelog } from "@/lib/ai/generate";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const repoId = searchParams.get("repo_id");

  const supabase = createAdminClient();

  let query = supabase
    .from("changelogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (repoId) {
    query = query.eq("repo_id", parseInt(repoId));
  }

  const { data: changelogs, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ changelogs });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { repo_id, version } = body;

  if (!repo_id || !version) {
    return NextResponse.json(
      { error: "repo_id and version required" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { data: repo } = await supabase
    .from("repos")
    .select("*")
    .eq("id", repo_id)
    .single();

  if (!repo) {
    return NextResponse.json({ error: "Repo not found" }, { status: 404 });
  }

  const { data: prs } = await supabase
    .from("prs")
    .select("*")
    .eq("repo_id", repo_id)
    .eq("changelog_generated", false);

  if (!prs || prs.length === 0) {
    return NextResponse.json(
      { error: "No unreleased PRs found" },
      { status: 400 }
    );
  }

  const { title, content } = await generateChangelog({
    prs: prs.map((pr) => ({
      title: pr.title,
      description: pr.ai_description || "",
      number: pr.number,
      author: pr.author,
    })),
    version,
  });

  const { data: changelog, error } = await supabase
    .from("changelogs")
    .insert({
      repo_id,
      version,
      title,
      content,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase
    .from("prs")
    .update({ changelog_generated: true })
    .eq("repo_id", repo_id)
    .eq("changelog_generated", false);

  return NextResponse.json({ changelog });
}
