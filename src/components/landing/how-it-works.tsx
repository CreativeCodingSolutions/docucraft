const steps = [
  {
    number: "1",
    title: "Install the GitHub App",
    description:
      "Click 'Install GitHub App' and select the repos you want. That's the entire setup — no YAML, no config, no signup.",
    code: `# That's it. One click.
# DocuCraft works on every PR automatically.`,
  },
  {
    number: "2",
    title: "Open a PR",
    description:
      "Push your code and open a pull request like you normally do. DocuCraft activates automatically on every new PR.",
    code: `git checkout -b feat/add-user-auth
# make your changes
git add .
git commit -m "add user authentication"
git push origin feat/add-user-auth`,
  },
  {
    number: "3",
    title: "Get a description",
    description:
      "DocuCraft analyzes the diff and posts a structured description with categorized changes, file stats, and more.",
    code: `## Summary
This pull request modifies 5 files.
Includes source code changes and test updates.

### Source Code
- src/auth/login.ts
- src/auth/session.ts

### Tests
- src/__tests__/auth.test.ts

### Why
Automated PR description by DocuCraft.`,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-4">
          How it works
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
          Install once. Works on every PR. Zero configuration.
        </p>
        <div className="space-y-24">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`flex flex-col gap-8 ${
                i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-center`}
            >
              <div className="flex-1 space-y-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {step.number}
                </span>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className="flex-1 w-full">
                <pre className="rounded-lg border bg-muted p-4 text-sm overflow-x-auto">
                  <code>{step.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
