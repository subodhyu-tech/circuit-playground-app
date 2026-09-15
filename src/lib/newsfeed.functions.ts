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
};

const TOPICS: { topic: string; query: string }[] = [
  { topic: "CPUs & chips", query: "CPU OR processor OR chip" },
  { topic: "GPUs", query: "GPU OR graphics card OR nvidia OR radeon" },
  { topic: "AI hardware", query: "AI chip OR accelerator OR TPU" },
  { topic: "Memory & storage", query: "DDR5 OR SSD OR NAND OR HBM" },
  { topic: "Networking", query: "wifi 7 OR ethernet OR networking hardware" },
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

async function fetchTopic(topic: string, query: string): Promise<LiveStory[]> {
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
      let source = "news";
      try {
        source = new URL(link).hostname.replace(/^www\./, "");
      } catch {
        return null;
      }
      return {
        id: h.objectID,
        title,
        url: link,
        source,
        topic,
        points: h.points ?? 0,
        comments: h.num_comments ?? 0,
        publishedAt: h.created_at ?? new Date().toISOString(),
      };
    })
    .filter((s): s is LiveStory => s !== null);
}

export const getLiveTechFeed = createServerFn({ method: "GET" }).handler(async () => {
  const batches = await Promise.all(TOPICS.map((t) => fetchTopic(t.topic, t.query)));
  const seen = new Set<string>();
  const stories = batches
    .flat()
    .filter((s) => (seen.has(s.url) ? false : (seen.add(s.url), true)))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, 30);

  return { stories, fetchedAt: new Date().toISOString() };
});
