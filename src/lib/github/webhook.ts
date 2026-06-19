import crypto from "node:crypto";

export function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature || !secret) return false;

  const algo = signature.startsWith("sha256=") ? "sha256" : "sha1";
  const expectedSig = signature.replace(`${algo}=`, "");
  const hmac = crypto.createHmac(algo, secret);
  hmac.update(payload);
  const digest = hmac.digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(expectedSig));
  } catch {
    return false;
  }
}
