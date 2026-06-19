CREATE TABLE installations (
  id BIGINT PRIMARY KEY,
  account_id BIGINT NOT NULL,
  account_login TEXT NOT NULL,
  account_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE repos (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  owner TEXT NOT NULL,
  installation_id BIGINT REFERENCES installations(id),
  default_branch TEXT DEFAULT 'main',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prs (
  id BIGINT PRIMARY KEY,
  repo_id BIGINT REFERENCES repos(id),
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  ai_description TEXT,
  branch TEXT NOT NULL,
  base_branch TEXT NOT NULL,
  author TEXT NOT NULL,
  state TEXT DEFAULT 'open',
  ai_description_generated BOOLEAN DEFAULT false,
  changelog_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(repo_id, number)
);

CREATE TABLE changelogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  repo_id BIGINT REFERENCES repos(id),
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE prs ENABLE ROW LEVEL SECURITY;
ALTER TABLE changelogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their installations"
  ON installations FOR SELECT
  USING (true);

CREATE POLICY "Users can view repos from their installations"
  ON repos FOR SELECT
  USING (true);

CREATE POLICY "Users can view PRs from their repos"
  ON prs FOR SELECT
  USING (true);

CREATE POLICY "Users can view changelogs from their repos"
  ON changelogs FOR SELECT
  USING (true);
