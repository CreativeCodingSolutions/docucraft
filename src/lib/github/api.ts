export async function getPRDiff(
  owner: string,
  repo: string,
  prNumber: number,
  token: string
): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3.diff",
        "User-Agent": "docucraft",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch PR diff: ${response.statusText}`);
  }

  return response.text();
}

export async function getPRFiles(
  owner: string,
  repo: string,
  prNumber: number,
  token: string
): Promise<{ filename: string; status: string; additions: number; deletions: number; patch?: string }[]> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}/files`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "docucraft",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch PR files: ${response.statusText}`);
  }

  return response.json();
}

export async function getInstallationToken(
  installationId: number
): Promise<string> {
  const response = await fetch(
    `/api/github/token?installation_id=${installationId}`
  );

  if (!response.ok) {
    throw new Error("Failed to get installation token");
  }

  const data = await response.json();
  return data.token;
}

export async function postPRComment(
  owner: string,
  repo: string,
  prNumber: number,
  body: string,
  token: string
): Promise<void> {
  await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "docucraft",
      },
      body: JSON.stringify({ body }),
    }
  );
}

export async function getReposForInstallation(
  installationId: number,
  token: string
): Promise<{ id: number; name: string; full_name: string; owner: { login: string }; default_branch: string }[]> {
  const response = await fetch(
    `https://api.github.com/installation/repositories`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "docucraft",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch repos: ${response.statusText}`);
  }

  const data = await response.json();
  return data.repositories;
}
