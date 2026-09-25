import { createServerFn } from "@tanstack/react-start";

export type LiveStory = {
  id: string;
  title: string;
  url: string;
  source: string;
  topic: string;
  points: number;
  comments: number;
  publishedAt: string;
  via: "Hacker News" | "DEV Community";
};

const HN_TOPICS: { topic: string; query: string }[] = [
  { topic: "CPUs & chips", query: "CPU OR processor OR chip OR silicon" },
  { topic: "GPUs", query: "GPU OR graphics card OR nvidia OR radeon" },
  { topic: "AI hardware", query: "AI chip OR accelerator OR TPU OR NPU" },
  { topic: "Memory & storage", query: "DDR5 OR SSD OR NAND OR HBM" },
  { topic: "Networking", query: "wifi 7 OR ethernet OR networking hardware" },
];

const DEVTO_TOPICS: { topic: string; tag: string }[] = [
  { topic: "AI & emerging tech", tag: "ai" },
  { topic: "Hardware & gadgets", tag: "hardware" },
  { topic: "Web & dev tools", tag: "webdev" },
];

type AlgoliaHit = {
  objectID: string;
  title?: string;
  story_title?: string;
  url?: string;
  story_url?: string;
  points?: number;
  num_comments?: number;
  created_at?: string;
};

type DevToArticle = {
  id: number;
  title?: string;
  url?: string;
  positive_reactions_count?: number;
  comments_count?: number;
  published_at?: string;
};

function hostnameOf(link: string): string | null {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

async function fetchHnTopic(topic: string, query: string): Promise<LiveStory[]> {
  try {
    const url =
      "https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=8&query=" +
      encodeURIComponent(query);
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) return [];
    const json = (await res.json()) as { hits?: AlgoliaHit[] };
    return (json.hits ?? [])
      .map((h): LiveStory | null => {
        const title = h.title ?? h.story_title;
        const link = h.url ?? h.story_url;
        if (!title || !link) return null;
        const source = hostnameOf(link);
        if (!source) return null;
        return {
          id: `hn-${h.objectID}`,
          title,
          url: link,
          source,
          topic,
          points: h.points ?? 0,
          comments: h.num_comments ?? 0,
          publishedAt: h.created_at ?? new Date().toISOString(),
          via: "Hacker News",
        };
      })
      .filter((s): s is LiveStory => s !== null);
  } catch {
    return [];
  }
}

async function fetchDevToTopic(topic: string, tag: string): Promise<LiveStory[]> {
  try {
    const url = `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=8&top=1`;
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) return [];
    const json = (await res.json()) as DevToArticle[];
    return (json ?? [])
      .map((a): LiveStory | null => {
        if (!a.title || !a.url) return null;
        const source = hostnameOf(a.url) ?? "dev.to";
        return {
          id: `devto-${a.id}`,
          title: a.title,
          url: a.url,
          source,
          topic,
          points: a.positive_reactions_count ?? 0,
          comments: a.comments_count ?? 0,
          publishedAt: a.published_at ?? new Date().toISOString(),
          via: "DEV Community",
        };
      })
      .filter((s): s is LiveStory => s !== null);
  } catch {
    return [];
  }
}

export const getLiveTechFeed = createServerFn({ method: "GET" }).handler(async () => {
  const batches = await Promise.all([
    ...HN_TOPICS.map((t) => fetchHnTopic(t.topic, t.query)),
    ...DEVTO_TOPICS.map((t) => fetchDevToTopic(t.topic, t.tag)),
  ]);
  const seen = new Set<string>();
  const stories = batches
    .flat()
    .filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true)))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, 30);

  return { stories, fetchedAt: new Date().toISOString() };
});
