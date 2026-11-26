// Resolves the latest notchbud installer from GitHub releases.
// Hourly-cached, so the API quota stays near zero. Optional GITHUB_TOKEN
// upgrades the quota (matters on shared hosting egress IPs).
const OWNER = "ankitdey01";
const REPO = "notchbud";

export const RELEASES_URL = `https://github.com/${OWNER}/${REPO}/releases`;

export type ReleaseAsset = { name: string; browser_download_url: string };

export type ReleaseInfo = {
  tag: string;
  name: string;
  publishedAt: string;
  htmlUrl: string;
  assetUrl: string | null;
  compareUrl: string | null;
  changes: string[];
};

function pickSetupAsset(assets: ReleaseAsset[]): ReleaseAsset | undefined {
  const exes = assets.filter((a) => /\.exe$/i.test(a.name));
  return (
    exes.find((a) => /setup/i.test(a.name)) ??
    exes.find((a) => /notchbud/i.test(a.name)) ??
    exes[0]
  );
}

function headers() {
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "notchbud-web",
    ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  };
}

export async function getLatestRelease(): Promise<{ tag: string; assetUrl: string } | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases/latest`, {
      headers: headers(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const assets: ReleaseAsset[] = data.assets ?? [];
    // No unvalidated fallback: if no .exe exists, return null so callers
    // fall back to the releases page instead of serving a checksum, archive,
    // or other non-installer asset as the download.
    const asset = pickSetupAsset(assets);
    if (!asset) return null;
    return { tag: data.tag_name ?? "", assetUrl: asset.browser_download_url };
  } catch {
    return null;
  }
}

// Human-readable summaries, written from each release's actual commits and
// diffs (the GitHub bodies are auto-generated compare links, not prose).
// Any future tag not listed here falls back to cleaned-up commit subjects
// fetched from the compare API, so the page stays useful without edits.
const CURATED_CHANGES: Record<string, string[]> = {
  "v0.1.6": [
    "the webview now sleeps after 5 idle seconds and wakes on hover, so idle memory stays low",
    "replies keep running while you browse the island, with a notification when a hidden reply finishes",
    "fixed a missed reply piece when the island closes mid-stream",
  ],
  "v0.1.5": ["version bump and a fresh installer — no app changes"],
  "v0.1.4": [
    "the app now checks github releases and updates itself",
    "refreshed readme, screenshots, and contributing guide",
  ],
  "v0.1.3": [
    "first public release: a floating island on top of your screen — hover to open it",
    "streaming answers from groq, billed to your own api key",
    "saved chats with auto titles, plus notifications when replies land",
    "screenshot questions about anything visible on your screen",
    "sealed key storage, a per-user installer, and release builds from CI",
  ],
};

// Turn raw commit subjects into calm one-liners: merge noise and
// release/version bumps are dropped, conventional prefixes are stripped,
// and only the first few survive.
function summarizeCommits(messages: string[]): string[] {
  const out: string[] = [];
  for (const full of messages) {
    const lines = full.split("\n");
    let subject = lines[0].trim();
    if (/^merge pull request/i.test(subject)) {
      subject = lines.slice(1).map((l) => l.trim()).find((l) => l.length > 0) ?? "";
    }
    subject = subject.replace(/^[a-z]+(\([^)]*\))?(!)?:\s+/i, "").trim();
    if (!subject || /^(release|bump|version)\b/i.test(subject) || /^v?\d+\.\d+/.test(subject)) continue;
    subject = subject.charAt(0).toLowerCase() + subject.slice(1);
    if (!out.includes(subject)) out.push(subject);
    if (out.length >= 6) break;
  }
  return out;
}

async function compareChanges(base: string, head: string): Promise<{ changes: string[]; compareUrl: string }> {
  const compareUrl = `https://github.com/${OWNER}/${REPO}/compare/${base}...${head}`;
  try {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/compare/${base}...${head}`, {
      headers: headers(),
    });
    if (!res.ok) return { changes: [], compareUrl };
    const data = await res.json();
    const messages = Array.isArray(data.commits)
      ? data.commits.map((c: { commit?: { message?: string } }) => c.commit?.message ?? "").filter(Boolean)
      : [];
    // Compare lists oldest first; newest reads better on top.
    return { changes: summarizeCommits(messages.reverse()), compareUrl };
  } catch {
    return { changes: [], compareUrl };
  }
}

// Every published release, newest first, for the /releases page.
// Hourly-cached by the page, so the API quota stays near zero. Compare
// lookups only run for tags without a curated summary.
export async function getAllReleases(): Promise<ReleaseInfo[]> {
  try {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases?per_page=100`, {
      headers: headers(),
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    const releases = data.filter((r) => !r.draft);
    const out: ReleaseInfo[] = [];
    for (let i = 0; i < releases.length; i++) {
      const r = releases[i];
      const tag: string = r.tag_name ?? "";
      const curated = CURATED_CHANGES[tag];
      // The oldest entry has no predecessor to compare against.
      const older: string | undefined = releases[i + 1]?.tag_name;
      const compared = !curated && older ? await compareChanges(older, tag) : null;
      out.push({
        tag,
        name: r.name ?? tag,
        publishedAt: r.published_at ?? "",
        htmlUrl: r.html_url ?? RELEASES_URL,
        assetUrl: pickSetupAsset((r.assets ?? []) as ReleaseAsset[])?.browser_download_url ?? null,
        compareUrl: compared?.compareUrl ?? (older ? `https://github.com/${OWNER}/${REPO}/compare/${older}...${tag}` : null),
        changes: curated ?? compared?.changes ?? [],
      });
    }
    return out;
  } catch {
    return [];
  }
}
