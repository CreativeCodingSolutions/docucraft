import Link from "next/link";
import { getArticles } from "@/lib/blog";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export default function BlogPage() {
  const articles = getArticles();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Blog</h1>
          <p className="mb-10 text-lg text-muted-foreground">
            Thoughts on PR descriptions, open source, and developer productivity.
          </p>
          <div className="space-y-8">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group block rounded-lg border p-6 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <time dateTime={article.date}>{article.date}</time>
                  <span>·</span>
                  <span>{article.author}</span>
                </div>
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors mb-2">
                  {article.title}
                </h2>
                <p className="text-muted-foreground line-clamp-2">
                  {article.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
