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
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="https://github.com/CreativeCodingSolutions/docucraft"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Install GitHub App
          </Link>
          <Link
            href="/#how-it-works"
            className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-background px-8 text-sm font-medium hover:bg-accent transition-colors"
          >
            How It Works
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          One-click install. Free for open source. Works on every PR.
        </p>
      </div>
    </section>
  );
}
