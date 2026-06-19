export interface Installation {
  id: number;
  account_id: number;
  account_login: string;
  account_type: string;
  created_at: string;
}

export interface Repo {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  installation_id: number;
  default_branch: string;
  is_active: boolean;
  created_at: string;
}

export interface PR {
  id: number;
  repo_id: number;
  number: number;
  title: string;
  description: string | null;
  ai_description: string | null;
  branch: string;
  base_branch: string;
  author: string;
  state: "open" | "closed" | "merged";
  ai_description_generated: boolean;
  changelog_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface Changelog {
  id: string;
  repo_id: number;
  version: string;
  title: string;
  content: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
}

export interface GitHubWebhookPayload {
  action: string;
  pull_request?: {
    id: number;
    number: number;
    title: string;
    body: string | null;
    state: string;
    html_url: string;
    head: { ref: string; sha: string };
    base: { ref: string; sha: string };
    user: { login: string };
  };
  repository?: {
    id: number;
    name: string;
    full_name: string;
    owner: { login: string };
    default_branch: string;
  };
  installation?: {
    id: number;
  };
}
