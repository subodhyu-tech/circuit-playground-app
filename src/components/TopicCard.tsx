import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock } from "lucide-react";
import { categoryById, type Topic } from "@/data/tech";
import { Badge } from "@/components/ui/badge";

const accentRing: Record<string, string> = {
  cyan: "group-hover:border-brand-cyan/60",
  violet: "group-hover:border-brand-violet/60",
  emerald: "group-hover:border-brand-emerald/60",
  amber: "group-hover:border-brand-amber/60",
};

export function TopicCard({ topic }: { topic: Topic }) {
  const cat = categoryById(topic.category);
  return (
    <Link
      to="/explore/$slug"
      params={{ slug: topic.slug }}
      className={`group relative flex flex-col rounded-2xl border border-border bg-card/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-card ${accentRing[cat.accent]}`}
    >
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="font-mono text-[11px] uppercase tracking-wider">
          {cat.name}
        </Badge>
        <span className="text-xs text-muted-foreground">{topic.level}</span>
        <ArrowUpRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-snug">{topic.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{topic.tagline}</p>
      <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock className="size-3.5" /> {topic.readMinutes} min
        </span>
        <span className="font-mono">{topic.tags.slice(0, 3).join(" · ")}</span>
      </div>
    </Link>
  );
}
