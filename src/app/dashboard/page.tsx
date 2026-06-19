"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Repo, PR, Changelog } from "@/types";

export default function Dashboard() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [prs, setPrs] = useState<Record<number, PR[]>>({});
  const [changelogs, setChangelogs] = useState<Changelog[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [reposRes, changelogsRes] = await Promise.all([
          fetch("/api/repos"),
          fetch("/api/changelogs"),
        ]);

        const reposData = await reposRes.json();
        const changelogsData = await changelogsRes.json();

        setRepos(reposData.repos || []);
        setChangelogs(changelogsData.changelogs || []);

        if (reposData.repos?.length > 0) {
          setSelectedRepo(reposData.repos[0].id);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    const repoId = selectedRepo;
    if (!repoId) return;

    async function loadPRs() {
      try {
        const res = await fetch(`/api/prs?repo_id=${repoId}`);
        const data = await res.json();
        setPrs((prev) => {
          const next = { ...prev };
          next[repoId as number] = data.prs || [];
          return next;
        });
      } catch (error) {
        console.error("Failed to load PRs:", error);
      }
    }

    loadPRs();
  }, [selectedRepo]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
        <h1 className="text-2xl font-bold">Welcome to DocuCraft</h1>
        <p className="text-muted-foreground">
          Install the GitHub App to get started.
        </p>
        <Link
          href="/api/github/auth"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Install GitHub App
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/api/github/auth"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Add Repository
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <aside className="space-y-1 lg:col-span-1">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            Repositories
          </h2>
          {repos.map((repo) => (
            <button
              key={repo.id}
              onClick={() => setSelectedRepo(repo.id)}
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                selectedRepo === repo.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {repo.full_name}
            </button>
          ))}
        </aside>

        <div className="space-y-8 lg:col-span-3">
          {selectedRepo && (
            <>
              <section>
                <h2 className="mb-4 text-lg font-semibold">
                  Pull Requests
                </h2>
                {prs[selectedRepo]?.length > 0 ? (
                  <div className="space-y-3">
                    {prs[selectedRepo].map((pr) => (
                      <div
                        key={pr.id}
                        className="rounded-lg border p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">
                              #{pr.number} {pr.title}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              by {pr.author} &middot; {pr.branch} &rarr;{" "}
                              {pr.base_branch}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              pr.state === "open"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : pr.state === "merged"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                            }`}
                          >
                            {pr.state}
                          </span>
                        </div>
                        {pr.ai_description_generated && (
                          <div className="mt-3 rounded-md bg-muted p-3">
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              AI Description:
                            </p>
                            <p className="text-sm whitespace-pre-wrap">
                              {pr.ai_description}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No PRs found for this repository.
                  </p>
                )}
              </section>

              <section>
                <h2 className="mb-4 text-lg font-semibold">Changelogs</h2>
                {changelogs.length > 0 ? (
                  <div className="space-y-3">
                    {changelogs.map((changelog) => (
                      <div key={changelog.id} className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{changelog.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(changelog.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              changelog.published
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                            }`}
                          >
                            {changelog.published ? "Published" : "Draft"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No changelogs generated yet.
                  </p>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
