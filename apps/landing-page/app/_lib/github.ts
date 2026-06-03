export interface GithubRepoMeta {
  starsLabel: string;
  versionLabel: string;
}

const REPO_API = 'https://api.github.com/repos/nexu-io/open-design';
const FALLBACK_META: GithubRepoMeta = {
  starsLabel: '40K+',
  versionLabel: 'v0.3.0',
};

let repoMetaPromise: Promise<GithubRepoMeta> | null = null;

function formatStars(count: unknown): string | null {
  if (typeof count !== 'number' || !Number.isFinite(count) || count <= 0) return null;
  if (count < 1000) return String(count);
  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`;
}

async function fetchJson(url: string, headers?: Record<string, string>): Promise<unknown> {
  const response = await fetch(url, {
    headers,
  });
  if (!response.ok) throw new Error(`Request returned ${response.status}: ${url}`);
  return response.json();
}

export function getGithubRepoMeta(): Promise<GithubRepoMeta> {
  repoMetaPromise ??= (async () => {
    let repo: unknown = null;
    try {
      repo = await fetchJson(REPO_API, { Accept: 'application/vnd.github+json' });
    } catch {
      repo = null;
    }

    const starsLabel = formatStars((repo as { stargazers_count?: unknown } | null)?.stargazers_count);

    return {
      starsLabel: starsLabel ?? FALLBACK_META.starsLabel,
      versionLabel: FALLBACK_META.versionLabel,
    };
  })();

  return repoMetaPromise;
}
