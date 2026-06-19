import { NextRequest, NextResponse } from "next/server";
import { getInstallationToken } from "@/lib/github/token";

export async function POST(request: NextRequest) {
  const { installation_id } = await request.json();

  if (!installation_id) {
    return NextResponse.json({ error: "Missing installation_id" }, { status: 400 });
  }

  try {
    const token = await getInstallationToken(installation_id);
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
