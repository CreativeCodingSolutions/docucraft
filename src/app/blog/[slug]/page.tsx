import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/lib/blog";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  return getArticles().map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <article className="mx-auto max-w-3xl px-6">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to blog
          </Link>

          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              {article.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <time dateTime={article.date}>{article.date}</time>
              <span>·</span>
              <span>{article.author}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="border-t pt-8">
            <MarkdownRenderer content={article.content} />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
