import { redirect } from "next/navigation";
import { getLatestRelease, RELEASES_URL } from "@/lib/github-release";

// Statically served and revalidated hourly, so GitHub's API quota stays
// near zero. Failures fall back to the releases page instead of erroring.
export const revalidate = 3600;

export async function GET() {
  const latest = await getLatestRelease();
  redirect(latest?.assetUrl ?? RELEASES_URL);
}
