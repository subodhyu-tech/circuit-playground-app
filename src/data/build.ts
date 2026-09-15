import { products, type ModelKind, type Product } from "./hardware";

export type BuildMetric = {
  /** Typical street price in USD (approximate, for planning only). */
  price: number;
  /** 0-100 relative gaming strength. */
  gaming: number;
  /** 0-100 relative creator / productivity strength. */
  creator: number;
  /** Typical load power draw in watts. */
  watts: number;
  /** Platform key used for compatibility checks (socket or memory standard). */
  platform?: string;
};

export const metrics: Record<string, BuildMetric> = {
  // CPUs
  "core-ultra-9-285k": { price: 589, gaming: 86, creator: 96, watts: 250, platform: "LGA1851" },
  "core-i9-14900k": { price: 479, gaming: 90, creator: 93, watts: 300, platform: "LGA1700" },
  "ryzen-9-9950x": { price: 579, gaming: 89, creator: 98, watts: 200, platform: "AM5" },
  "ryzen-7-9800x3d": { price: 479, gaming: 100, creator: 82, watts: 162, platform: "AM5" },
  "apple-m4-pro": { price: 1999, gaming: 55, creator: 90, watts: 60, platform: "Apple" },

  // GPUs
  "rtx-5090": { price: 1999, gaming: 100, creator: 100, watts: 575 },
  "rtx-5070-ti": { price: 749, gaming: 78, creator: 79, watts: 300 },
  "rtx-4070-super": { price: 599, gaming: 64, creator: 68, watts: 220 },
  "rx-9070-xt": { price: 599, gaming: 76, creator: 66, watts: 304 },
  "rx-7900-xtx": { price: 849, gaming: 80, creator: 70, watts: 355 },
  "arc-b580": { price: 249, gaming: 42, creator: 48, watts: 190 },

  // Motherboards
  "z890-aorus": { price: 329, gaming: 82, creator: 88, watts: 35, platform: "LGA1851" },
  "x870e-board": { price: 349, gaming: 88, creator: 92, watts: 35, platform: "AM5" },
  "b650-itx": { price: 219, gaming: 78, creator: 70, watts: 25, platform: "AM5" },

  // Memory
  "ddr5-6000-cl30": { price: 109, gaming: 88, creator: 82, watts: 10 },
  "ddr5-8000-cl38": { price: 189, gaming: 84, creator: 90, watts: 14 },

  // Storage
  "pcie5-nvme-2tb": { price: 239, gaming: 92, creator: 98, watts: 11 },
  "pcie4-nvme-2tb": { price: 139, gaming: 88, creator: 85, watts: 8 },
  "dramless-qlc-4tb": { price: 199, gaming: 70, creator: 58, watts: 6 },
};

export function byKind(kind: ModelKind): Product[] {
  return products.filter((p) => p.kind === kind && metrics[p.id]);
}

export function metricFor(id: string | null): BuildMetric | null {
  return id ? (metrics[id] ?? null) : null;
}

export const presets: { id: string; name: string; blurb: string; picks: Record<ModelKind, string> }[] =
  [
    {
      id: "value",
      name: "1080p value rig",
      blurb: "Great frames per dollar for esports and 1080p high settings.",
      picks: {
        cpu: "ryzen-7-9800x3d",
        gpu: "arc-b580",
        motherboard: "b650-itx",
        ram: "ddr5-6000-cl30",
        ssd: "pcie4-nvme-2tb",
      },
    },
    {
      id: "gaming",
      name: "1440p gaming sweet spot",
      blurb: "The balanced build most people should copy.",
      picks: {
        cpu: "ryzen-7-9800x3d",
        gpu: "rtx-5070-ti",
        motherboard: "x870e-board",
        ram: "ddr5-6000-cl30",
        ssd: "pcie4-nvme-2tb",
      },
    },
    {
      id: "creator",
      name: "4K + creator workstation",
      blurb: "Maximum render and AI throughput, no compromises.",
      picks: {
        cpu: "ryzen-9-9950x",
        gpu: "rtx-5090",
        motherboard: "x870e-board",
        ram: "ddr5-8000-cl38",
        ssd: "pcie5-nvme-2tb",
      },
    },
  ];
