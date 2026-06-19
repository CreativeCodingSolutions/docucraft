const features = [
  {
    title: "Auto PR Descriptions",
    description:
      "Every pull request gets a clear, well-structured description generated from your code changes. No more 'fixed stuff' PRs.",
  },
  {
    title: "Template Mode (Free)",
    description:
      "Works out of the box with zero API keys, zero cost, zero config. Generates structured descriptions from your git diff.",
  },
  {
    title: "GitHub Native",
    description:
      "Works as a GitHub Action. Add one YAML workflow file and it just works. No servers, no database, no signup.",
  },
  {
    title: "Smart Analysis",
    description:
      "Understands your codebase context. Generates descriptions that actually explain what changed and why.",
  },
  {
    title: "Team Friendly",
    description:
      "Works with your entire team. Every PR gets consistent, high-quality documentation automatically.",
  },
  {
    title: "Open Source",
    description:
      "MIT licensed. Free for public and private repositories. No usage limits, no hidden costs.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t bg-muted/50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-4">
          Stop writing docs. Start shipping.
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          DocuCraft handles the documentation so your team can focus on code.
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border bg-background p-6"
            >
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
