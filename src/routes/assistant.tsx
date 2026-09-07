import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Sparkles, Bot, User, Info } from "lucide-react";
import { getTopic, topics } from "@/data/tech";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type AssistantSearch = { topic?: string | undefined };
type Message = { role: "user" | "assistant"; text: string };

export const Route = createFileRoute("/assistant")({
  validateSearch: (search: Record<string, unknown>): AssistantSearch => ({
    topic: typeof search["topic"] === "string" ? (search["topic"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "AI Learning Assistant — SiliconLab" },
      {
        name: "description",
        content:
          "Ask a hardware tutor to explain chips, GPUs, memory and gaming performance at your own level.",
      },
      { property: "og:title", content: "AI Learning Assistant — SiliconLab" },
      {
        property: "og:description",
        content: "A guided tutor for chips, PC hardware and emerging technology.",
      },
    ],
  }),
  component: AssistantPage,
});

const starters = [
  "Explain CPU cache like I'm 12",
  "Why does my game stutter at 120 FPS?",
  "DDR5-6000 CL30 or DDR5-7200 CL40?",
  "What is an NPU actually good for?",
];

function localAnswer(question: string, topicSlug: string): string {
  const t = getTopic(topicSlug);
  const q = question.toLowerCase();
  const match =
    topics.find((x) => [x.title, ...x.tags].some((k) => q.includes(k.toLowerCase()))) ?? t;

  if (match) {
    return [
      `Here's the short version, based on the "${match.title}" lesson:`,
      match.keyIdeas[0],
      match.keyIdeas[1],
      `Want to go deeper? Open the lesson and try the interactive breakdown of the ${match.parts[0]?.name.toLowerCase()}.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }
  return "Good question. This preview tutor answers from the built-in lesson library — try mentioning a component like CPU, GPU, RAM, SSD or Wi-Fi and I'll pull the relevant explanation.";
}

function AssistantPage() {
  const { topic } = Route.useSearch();
  const seeded = getTopic(topic ?? "");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: seeded
        ? `Let's dig into ${seeded.title}. Ask me about any part of it — ${seeded.parts
            .map((p) => p.name.toLowerCase())
            .join(", ")} — or ask for a simpler explanation.`
        : "Hi! I'm your hardware tutor. Ask me anything about chips, PC parts, gaming performance or AI silicon.",
    },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: value },
      { role: "assistant", text: localAnswer(value, topic ?? "") },
    ]);
    setInput("");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <header className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-brand-violet">AI tutor</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Learn at your own level</h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Ask a question in plain language and get an explanation grounded in the lesson library.
        </p>
      </header>

      <div className="mt-6 flex items-start gap-2 rounded-xl border border-border bg-card/50 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-brand-cyan" />
        <p>
          This is an offline preview tutor that answers from the built-in lessons. Connecting a live
          AI model later will let it answer anything, remember your progress and quiz you.
        </p>
      </div>

      <div className="mt-6 glass rounded-2xl p-5">
        <div className="grid gap-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-lg ${
                  m.role === "user"
                    ? "bg-secondary"
                    : "bg-gradient-to-br from-brand-cyan to-brand-violet text-background"
                }`}
              >
                {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
              </span>
              <div
                className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user" ? "bg-secondary" : "border border-border bg-card"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form
          className="mt-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about cache, VRAM, frame pacing, NPUs..."
            className="h-12"
          />
          <Button type="submit" size="lg" className="h-12">
            <Send className="size-4" />
          </Button>
        </form>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {starters.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-brand-cyan/60 hover:text-foreground"
          >
            <Sparkles className="mr-1 inline size-3" />
            {s}
          </button>
        ))}
      </div>

      {seeded && (
        <Badge variant="outline" className="mt-6 font-mono">
          Context: {seeded.title}
        </Badge>
      )}
    </div>
  );
}
