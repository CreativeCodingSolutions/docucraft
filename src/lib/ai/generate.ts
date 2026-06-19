import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePRDescription(params: {
  title: string;
  diff: string;
  files: { filename: string; status: string; additions: number; deletions: number }[];
}): Promise<string> {
  const filesSummary = params.files
    .map((f) => `- ${f.filename} (${f.status}, +${f.additions}/-${f.deletions})`)
    .join("\n");

  const prompt = `You are an expert code reviewer. Given a pull request, write a clear and concise PR description.

PR Title: ${params.title}

Files Changed:
${filesSummary}

Diff:
\`\`\`diff
${params.diff.slice(0, 8000)}
\`\`\`

Generate a PR description with:
1. **Summary**: What this PR does in 1-2 sentences
2. **Changes**: Key changes organized by area
3. **Why**: The motivation behind these changes

Keep it professional and concise. Use markdown.`;

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 1000,
  });

  return response.choices[0]?.message?.content || "";
}

export async function generateChangelog(params: {
  prs: { title: string; description: string; number: number; author: string }[];
  version: string;
}): Promise<{ title: string; content: string }> {
  const prsList = params.prs
    .map(
      (pr) =>
        `- PR #${pr.number}: ${pr.title} (by ${pr.author})`
    )
    .join("\n");

  const prompt = `You are a technical writer. Generate a changelog entry for version ${params.version}.

Merged PRs:
${prsList}

Generate a changelog with:
1. **Title**: A short release name
2. **Content**: Categorized changelog (New Features, Improvements, Bug Fixes)

Keep it professional and user-focused. Use markdown.`;

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 800,
  });

  const content = response.choices[0]?.message?.content || "";

  return {
    title: params.version,
    content,
  };
}
