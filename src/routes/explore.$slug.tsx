import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Clock, Layers, Sparkles } from "lucide-react";
import { categoryById, getTopic, topics } from "@/data/tech";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/explore/$slug")({
  loader: ({ params }) => {
    const topic = getTopic(params.slug);
    if (!topic) throw notFound();
    return { topic };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Topic not found — SiliconLab" }, { name: "robots", content: "noindex" }],
      };
    }
    const { topic } = loaderData;
    const title = `${topic.title} — SiliconLab`;
    return {
      meta: [
        { title },
        { name: "description", content: topic.tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: topic.tagline },
      ],
    };
  },
  component: TopicPage,
});

function TopicPage() {
  const { topic } = Route.useLoaderData();
  const cat = categoryById(topic.category);
  const [activePart, setActivePart] = useState(topic.parts[0]?.id ?? "");
  const part = topic.parts.find((p) => p.id === activePart) ?? topic.parts[0]!;
  const related = topics.filter((t) => t.category === topic.category && t.slug !== topic.slug);

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Link
        to="/explore"
        search={{ q: "", category: topic.category }}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to {cat.name}
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="font-mono text-[11px] uppercase tracking-wider">{cat.name}</Badge>
          <Badge variant="outline">{topic.level}</Badge>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3.5" /> {topic.readMinutes} min read
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">{topic.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{topic.tagline}</p>
      </header>

      <p className="mt-8 text-base leading-relaxed text-foreground/90">{topic.intro}</p>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {topic.keyIdeas.map((idea, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card/50 p-5">
            <span className="font-mono text-xs text-brand-cyan">0{i + 1}</span>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{idea}</p>
          </div>
        ))}
      </section>

      <section className="mt-14">
        <h2 className="flex items-center gap-2 text-2xl font-bold">
          <Layers className="size-5 text-brand-violet" /> Interactive breakdown
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Select a part to see what it does and why it matters.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-[260px_1fr]">
          <div className="grid gap-2 content-start">
            {topic.parts.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePart(p.id)}
                className={`rounded-xl border px-4 py-3 text-left transition-all ${
                  p.id === part.id
                    ? "border-brand-cyan/60 bg-secondary shadow-[var(--shadow-glow)]"
                    : "border-border hover:bg-secondary/60"
                }`}
              >
                <span className="block text-sm font-semibold">{p.name}</span>
                <span className="block text-xs text-muted-foreground">{p.what}</span>
              </button>
            ))}
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-xl font-semibold">{part.name}</h3>
              <span className="font-mono text-xs text-brand-cyan">{part.spec}</span>
            </div>
            <p className="mt-4 leading-relaxed text-muted-foreground">{part.detail}</p>
            <div className="mt-6 h-24 rounded-xl border border-border bg-gradient-to-br from-brand-cyan/12 via-transparent to-brand-violet/16 grid-bg" />
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">Spec snapshot</h2>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
          {topic.specs.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between rounded-xl border border-border bg-card/50 px-4 py-3"
            >
              <dt className="text-sm text-muted-foreground">{s.label}</dt>
              <dd className="font-mono text-sm">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold">Common questions</h2>
        <Accordion type="single" collapsible className="mt-4">
          {topic.faq.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mt-14 rounded-2xl border border-border bg-gradient-to-br from-brand-violet/12 to-brand-cyan/10 p-6">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="size-5 text-brand-violet" /> Still fuzzy on something?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Take this topic to the AI tutor and ask it to explain any part in your own words.
        </p>
        <Button asChild className="mt-4">
          <Link to="/assistant" search={{ topic: topic.slug }}>
            Open the AI tutor
          </Link>
        </Button>
      </section>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl font-bold">More in {cat.name}</h2>
          <div className="mt-4 grid gap-3">
            {related.map((t) => (
              <Link
                key={t.slug}
                to="/explore/$slug"
                params={{ slug: t.slug }}
                className="rounded-xl border border-border px-4 py-3 transition-colors hover:bg-secondary"
              >
                <span className="text-sm font-medium">{t.title}</span>
                <span className="block text-xs text-muted-foreground">{t.tagline}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
