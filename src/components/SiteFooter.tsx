import { Link } from "@tanstack/react-router";
import { Cpu } from "lucide-react";
import { categories } from "@/data/tech";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-cyan to-brand-violet text-background">
              <Cpu className="size-5" />
            </span>
            <span className="font-display text-lg font-bold">
              Silicon<span className="text-gradient">Lab</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            A learning playground for chips, PC hardware and emerging technology. Sample content is
            written for teaching — always check vendor specs before buying.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Sections</h3>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link
                  to="/explore"
                  search={{ category: c.id, q: "" }}
                  className="transition-colors hover:text-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Learn</h3>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
            <li>
              <Link to="/compare" className="hover:text-foreground">
                Side-by-side comparisons
              </Link>
            </li>
            <li>
              <Link to="/gaming" className="hover:text-foreground">
                Gaming technology
              </Link>
            </li>
            <li>
              <Link to="/trending" className="hover:text-foreground">
                Trending & new tech
              </Link>
            </li>
            <li>
              <Link to="/assistant" className="hover:text-foreground">
                AI learning assistant
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SiliconLab — educational sample content.
      </div>
    </footer>
  );
}
