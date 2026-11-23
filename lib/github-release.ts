// Resolves the latest notchbud installer from GitHub releases.
// Hourly-cached, so the API quota stays near zero. Optional GITHUB_TOKEN
// upgrades the quota (matters on shared hosting egress IPs).
const OWNER = "ankitdey01";
const REPO = "notchbud";

export const RELEASES_URL = `https://github.com/${OWNER}/${REPO}/releases`;

type ReleaseAsset = { name: string; browser_download_url: string };

export async function getLatestRelease(): Promise<{ tag: string; assetUrl: string } | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "notchbud-web",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const assets: ReleaseAsset[] = data.assets ?? [];
    const exes = assets.filter((a) => /\.exe$/i.test(a.name));
    const asset =
      exes.find((a) => /setup/i.test(a.name)) ??
      exes.find((a) => /notchbud/i.test(a.name)) ??
      exes[0] ??
      assets[0];
    if (!asset) return null;
    return { tag: data.tag_name ?? "", assetUrl: asset.browser_download_url };
  } catch {
    return null;
  }
}
