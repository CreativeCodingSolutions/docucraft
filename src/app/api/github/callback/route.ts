import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const installationId = request.nextUrl.searchParams.get("installation_id");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const clientId = process.env.GITHUB_APP_CLIENT_ID!;
  const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET!;

  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    }
  );

  const tokenData = await tokenResponse.json();

  if (installationId) {
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "User-Agent": "docucraft",
      },
    });
    const userData = await userResponse.json();

    const supabase = createAdminClient();
    await supabase.from("installations").upsert({
      id: parseInt(installationId),
      account_id: userData.id,
      account_login: userData.login,
      account_type: userData.type,
    });
  }

  const redirectUrl = new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL);
  redirectUrl.searchParams.set("token", tokenData.access_token);

  return NextResponse.redirect(redirectUrl);
}
