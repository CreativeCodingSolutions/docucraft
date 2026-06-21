function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderInline(text: string): string {
  let html = escapeHtml(text);
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/`(.+?)`/g, "<code>$1</code>");
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-4 hover:text-primary/80">$1</a>',
  );
  return html;
}

function parseMarkdown(markdown: string): string {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";
  let inTable = false;
  let tableBuffer: string[] = [];
  let inBlockquote = false;
  let blockquoteBuffer: string[] = [];

  function flushCodeBlock() {
    if (codeBuffer.length > 0) {
      html.push(
        `<pre class="overflow-x-auto rounded-lg border bg-muted p-4 text-sm"><code>${escapeHtml(codeBuffer.join("\n"))}</code></pre>`,
      );
      codeBuffer = [];
    }
  }

  function flushTable() {
    if (tableBuffer.length > 1) {
      html.push("<div class='overflow-x-auto'><table class='w-full border-collapse text-sm'>");
      tableBuffer.forEach((row, i) => {
        const cells = row
          .split("|")
          .filter((c) => c.trim() !== "")
          .map((c) => c.trim());
        if (i === 1) return;
        const tag = i === 0 ? "th" : "td";
        html.push("<tr>");
        cells.forEach((cell) => {
          const align = tag === "th" ? "" : "";
          html.push(`<${tag} class="border px-3 py-2 text-left${tag === "th" ? " font-medium bg-muted" : ""}">${renderInline(cell)}</${tag}>`);
        });
        html.push("</tr>");
      });
      html.push("</table></div>");
    }
    tableBuffer = [];
  }

  function flushBlockquote() {
    if (blockquoteBuffer.length > 0) {
      html.push(
        `<blockquote class="border-l-4 border-primary/30 pl-4 italic text-muted-foreground">${blockquoteBuffer.join("<br>")}</blockquote>`,
      );
      blockquoteBuffer = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
        continue;
      } else {
        flushCodeBlock();
        inCodeBlock = true;
        codeLang = line.slice(3).trim();
        continue;
      }
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    if (line.startsWith("|") && line.endsWith("|")) {
      if (!inTable) {
        flushTable();
        inTable = true;
      }
      tableBuffer.push(line);
      continue;
    }

    if (inTable) {
      flushTable();
      inTable = false;
    }

    if (line.startsWith("> ")) {
      inBlockquote = true;
      blockquoteBuffer.push(renderInline(line.slice(2)));
      continue;
    }

    if (inBlockquote) {
      flushBlockquote();
      inBlockquote = false;
    }

    if (line.startsWith("---")) {
      html.push('<hr class="my-8 border-t">');
      continue;
    }

    if (line.startsWith("### ")) {
      html.push(`<h3 class="mt-8 mb-3 text-xl font-semibold">${renderInline(line.slice(4))}</h3>`);
      continue;
    }

    if (line.startsWith("## ")) {
      html.push(`<h2 class="mt-10 mb-4 text-2xl font-bold tracking-tight">${renderInline(line.slice(3))}</h2>`);
      continue;
    }

    if (line.startsWith("# ")) {
      html.push(`<h1 class="mt-0 mb-6 text-3xl font-bold tracking-tight">${renderInline(line.slice(2))}</h1>`);
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      html.push(`<li class="ml-6 list-disc text-muted-foreground">${renderInline(line.slice(2))}</li>`);
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      html.push(`<li class="ml-6 list-decimal text-muted-foreground">${renderInline(line.replace(/^\d+\.\s/, ""))}</li>`);
      continue;
    }

    if (line.trim() === "") {
      html.push("<!-- -->");
      continue;
    }

    html.push(`<p class="leading-relaxed text-muted-foreground">${renderInline(line)}</p>`);
  }

  if (inCodeBlock) flushCodeBlock();
  if (inTable) flushTable();
  if (inBlockquote) flushBlockquote();

  return html.join("\n");
}

export function MarkdownRenderer({ content }: { content: string }) {
  const html = parseMarkdown(content);
  return (
    <div
      className="prose-custom space-y-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
