import Link from "next/link";

export function Hero() {
  return (
    <section className="flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Documentation that
          <span className="text-primary"> writes itself</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          DocuCraft automatically generates PR descriptions, changelogs, and
          documentation from your GitHub repositories. Stop writing docs.
          Start shipping.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/api/github/auth"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Install GitHub App
          </Link>
          <Link
            href="/#features"
            className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-background px-8 text-sm font-medium hover:bg-accent transition-colors"
          >
            Learn More
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Free for open source. $29/mo for Pro.
        </p>
      </div>
    </section>
  );
}
