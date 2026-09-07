export type Part = {
  id: string;
  name: string;
  what: string;
  detail: string;
  spec: string;
};

export type Topic = {
  slug: string;
  category: CategoryId;
  title: string;
  tagline: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  readMinutes: number;
  tags: string[];
  intro: string;
  keyIdeas: string[];
  parts: Part[];
  specs: { label: string; value: string }[];
  faq: { q: string; a: string }[];
};

export type CategoryId =
  | "cpu"
  | "gpu"
  | "motherboard"
  | "ram"
  | "storage"
  | "networking"
  | "gaming"
  | "ai";

export const categories: {
  id: CategoryId;
  name: string;
  blurb: string;
  icon: string;
  accent: string;
}[] = [
  {
    id: "cpu",
    name: "CPUs & Chips",
    blurb: "Cores, cache, clocks and how silicon actually thinks.",
    icon: "Cpu",
    accent: "cyan",
  },
  {
    id: "gpu",
    name: "GPUs & Graphics",
    blurb: "Parallel monsters that draw worlds and train models.",
    icon: "MonitorPlay",
    accent: "violet",
  },
  {
    id: "motherboard",
    name: "Motherboards",
    blurb: "The nervous system: chipsets, lanes and sockets.",
    icon: "CircuitBoard",
    accent: "emerald",
  },
  {
    id: "ram",
    name: "Memory / RAM",
    blurb: "Latency, bandwidth, channels and why timings matter.",
    icon: "MemoryStick",
    accent: "amber",
  },
  {
    id: "storage",
    name: "Storage",
    blurb: "NAND, NVMe queues and the death of the spinning disk.",
    icon: "HardDrive",
    accent: "cyan",
  },
  {
    id: "networking",
    name: "Networking",
    blurb: "Packets, Wi-Fi 7, latency and the path to the server.",
    icon: "Network",
    accent: "emerald",
  },
  {
    id: "gaming",
    name: "Gaming Tech",
    blurb: "Frame pacing, upscaling, ray tracing and input lag.",
    icon: "Gamepad2",
    accent: "violet",
  },
  {
    id: "ai",
    name: "AI & Emerging",
    blurb: "NPUs, transformers, HBM and what comes after silicon.",
    icon: "Sparkles",
    accent: "amber",
  },
];

export const topics: Topic[] = [
  {
    slug: "how-a-cpu-works",
    category: "cpu",
    title: "How a CPU Actually Works",
    tagline: "Fetch, decode, execute — a billion times a second.",
    level: "Beginner",
    readMinutes: 7,
    tags: ["cores", "cache", "pipeline", "x86", "ARM"],
    intro:
      "A CPU is a very fast, very literal machine. It pulls an instruction from memory, figures out what it means, does the maths, and writes the answer back. Modern chips just do this in dozens of overlapping stages, across many cores, while guessing what you'll ask next.",
    keyIdeas: [
      "Clock speed is how often the chip ticks; IPC is how much it gets done per tick. Performance is both multiplied together.",
      "Cache exists because RAM is painfully slow compared to a core. L1 is tiny and instant, L3 is big and shared.",
      "Branch prediction lets the chip run ahead speculatively — when it guesses wrong, work is thrown away.",
      "Hybrid designs mix performance cores with efficiency cores and let the scheduler pick.",
    ],
    parts: [
      {
        id: "core",
        name: "Core",
        what: "The actual execution engine",
        detail:
          "Each core has its own front-end (fetch/decode), execution ports for integer, floating point and vector maths, and private L1/L2 cache. More cores help parallel work; single-core speed still rules games and everyday apps.",
        spec: "6–24 cores typical on desktop",
      },
      {
        id: "cache",
        name: "Cache hierarchy",
        what: "Ultra-fast local memory",
        detail:
          "L1 answers in ~4 cycles, L2 in ~14, L3 in ~40, and system RAM in 200+. Stacked cache designs bolt extra L3 on top of the die, which is why some gaming chips win despite lower clocks.",
        spec: "32KB L1 → 96MB L3",
      },
      {
        id: "imc",
        name: "Memory controller",
        what: "The door to RAM",
        detail:
          "Integrated on-die since the mid-2000s. It sets which memory speeds and channels you can run, and it's often the real bottleneck in memory-heavy workloads.",
        spec: "Dual-channel DDR5-6000+",
      },
      {
        id: "npu",
        name: "NPU / accelerator",
        what: "Matrix maths block",
        detail:
          "New chips add a neural engine for low-power AI: background blur, live captions, local assistants. Measured in TOPS rather than GHz.",
        spec: "10–50 TOPS",
      },
    ],
    specs: [
      { label: "Typical process node", value: "3–5 nm" },
      { label: "Transistor count", value: "10–100 billion" },
      { label: "Base / boost clock", value: "3.0 GHz / 5.7 GHz" },
      { label: "Instruction sets", value: "x86-64, ARM64, RISC-V" },
    ],
    faq: [
      {
        q: "Do more cores make my PC faster?",
        a: "Only if your software can use them. Video export and compiling scale beautifully; most games lean on 6–8 fast cores.",
      },
      {
        q: "Is a smaller nanometre number always better?",
        a: "Broadly yes for efficiency, but node names are marketing now. Density and architecture matter more than the label.",
      },
    ],
  },
  {
    slug: "gpu-rendering-pipeline",
    category: "gpu",
    title: "Inside a GPU: The Rendering Pipeline",
    tagline: "Thousands of tiny cores, one frame every few milliseconds.",
    level: "Intermediate",
    readMinutes: 9,
    tags: ["shaders", "ray tracing", "VRAM", "upscaling"],
    intro:
      "Where a CPU is a few brilliant generalists, a GPU is an army of specialists doing the same maths on different pixels. That shape makes it perfect for graphics — and, as it turned out, for training neural networks.",
    keyIdeas: [
      "Geometry is transformed, rasterised into pixels, shaded, then composited — all massively in parallel.",
      "Ray tracing traces light paths for accurate reflections and shadows, at a heavy cost, so it's denoised and combined with rasterisation.",
      "Upscalers render fewer pixels and reconstruct the rest, trading a little clarity for a lot of frames.",
      "VRAM capacity decides texture quality; VRAM bandwidth decides how fast you can feed the cores.",
    ],
    parts: [
      {
        id: "sm",
        name: "Shader cores",
        what: "The parallel workforce",
        detail:
          "Grouped into clusters that share schedulers and cache. Every core runs the same small program across different data — a pixel, a vertex, a matrix tile.",
        spec: "4,000–20,000 cores",
      },
      {
        id: "rt",
        name: "Ray tracing units",
        what: "Fixed-function light maths",
        detail:
          "Dedicated hardware for ray-versus-triangle intersection tests against a bounding volume hierarchy. Without them, real-time ray tracing is hopeless.",
        spec: "1 RT unit per cluster",
      },
      {
        id: "tensor",
        name: "Matrix / tensor cores",
        what: "AI acceleration",
        detail:
          "Multiply and accumulate small matrices at low precision. Used for upscaling, frame generation, denoising — and for the entire modern AI boom.",
        spec: "FP8 / FP16 throughput",
      },
      {
        id: "vram",
        name: "VRAM",
        what: "Graphics memory",
        detail:
          "GDDR7 on consumer cards, HBM stacks on datacentre parts. Textures, frame buffers and model weights all live here; run out and performance collapses.",
        spec: "8–32 GB, ~1 TB/s",
      },
    ],
    specs: [
      { label: "Memory type", value: "GDDR7 / HBM3E" },
      { label: "Bus interface", value: "PCIe 5.0 x16" },
      { label: "Board power", value: "150–575 W" },
      { label: "Display out", value: "DisplayPort 2.1, HDMI 2.1" },
    ],
    faq: [
      {
        q: "Is upscaling 'fake' performance?",
        a: "It's reconstruction. Modern temporal upscalers reuse real data from previous frames, so at quality presets most people can't tell.",
      },
      {
        q: "How much VRAM do I need in 2026?",
        a: "12GB is a comfortable floor at 1440p; 16GB+ if you play at 4K with heavy texture packs or run local AI models.",
      },
    ],
  },
  {
    slug: "motherboard-chipsets-and-lanes",
    category: "motherboard",
    title: "Motherboards, Chipsets & PCIe Lanes",
    tagline: "The map of everything your CPU can talk to.",
    level: "Intermediate",
    readMinutes: 6,
    tags: ["chipset", "PCIe", "VRM", "BIOS"],
    intro:
      "A motherboard doesn't make your PC faster — it decides what your PC is allowed to do. Lanes, sockets, power delivery and firmware set the ceiling for everything you plug in.",
    keyIdeas: [
      "The CPU provides a limited pool of PCIe lanes; the chipset multiplexes the rest over a shared uplink.",
      "VRM quality determines sustained boost behaviour under load far more than any marketing sticker.",
      "Sockets outlive generations sometimes — check the upgrade path before you buy.",
      "Firmware updates change memory compatibility, so BIOS version matters when building.",
    ],
    parts: [
      {
        id: "socket",
        name: "CPU socket",
        what: "Where the chip lands",
        detail:
          "LGA puts the pins in the board, PGA puts them on the chip. The socket defines the platform's power limits and lane budget.",
        spec: "LGA1851 / AM5",
      },
      {
        id: "vrm",
        name: "VRM",
        what: "Power delivery",
        detail:
          "Converts 12V into the ~1.2V a CPU wants, thousands of times per second. More phases plus real heatsinks means cooler, steadier boosting.",
        spec: "12+2 phase typical",
      },
      {
        id: "chipset",
        name: "Chipset",
        what: "The I/O hub",
        detail:
          "Adds extra USB, SATA and PCIe beyond what the CPU offers, all sharing one uplink to the processor. Higher tiers unlock overclocking and more lanes.",
        spec: "PCIe 4.0 x8 uplink",
      },
      {
        id: "m2",
        name: "M.2 slots",
        what: "SSD real estate",
        detail:
          "Usually one slot wired straight to the CPU (fastest) and others hanging off the chipset. Populating some slots disables SATA ports.",
        spec: "2–5 slots, PCIe 5.0 x4",
      },
    ],
    specs: [
      { label: "Form factors", value: "ATX, mATX, Mini-ITX" },
      { label: "Memory slots", value: "2–4 DIMM" },
      { label: "Rear I/O", value: "USB4 40Gbps, 2.5GbE" },
      { label: "Firmware", value: "UEFI with flashback" },
    ],
    faq: [
      {
        q: "Do expensive boards boost FPS?",
        a: "Almost never directly. They buy you connectivity, better power delivery and quieter VRMs under long loads.",
      },
      {
        q: "Why did my SATA port stop working?",
        a: "Lane sharing. Filling a secondary M.2 slot commonly disables two SATA ports — the manual has the table.",
      },
    ],
  },
  {
    slug: "ram-latency-vs-bandwidth",
    category: "ram",
    title: "RAM: Latency vs Bandwidth",
    tagline: "Why DDR5-6000 CL30 beats DDR5-7200 CL40 in games.",
    level: "Intermediate",
    readMinutes: 5,
    tags: ["DDR5", "timings", "XMP", "channels"],
    intro:
      "Memory has two personalities. Bandwidth is how much data per second you can move; latency is how long you wait for the first byte. Different workloads care about different halves.",
    keyIdeas: [
      "True latency in nanoseconds = (CL ÷ transfer rate) × 2000. Compare that, not CL alone.",
      "Kits are sold as XMP/EXPO profiles — out of the box, DIMMs boot at slow JEDEC defaults until you enable one.",
      "Two sticks in the right slots usually clock higher than four.",
      "Integrated graphics and AI workloads are bandwidth-starved and love faster kits.",
    ],
    parts: [
      {
        id: "dimm",
        name: "DIMM module",
        what: "The stick itself",
        detail:
          "A PCB carrying DRAM dies, an SPD chip with the timing tables, and on DDR5 its own power management IC.",
        spec: "16–48 GB per stick",
      },
      {
        id: "rank",
        name: "Ranks & channels",
        what: "Parallel access groups",
        detail:
          "DDR5 splits each stick into two 32-bit sub-channels, which is why it scales so well despite higher latency than DDR4.",
        spec: "2× 32-bit sub-channels",
      },
      {
        id: "timings",
        name: "Timings",
        what: "The waiting game",
        detail:
          "CL-tRCD-tRP-tRAS describe the delays in clock cycles between commands. Tightening them is free performance if the silicon allows.",
        spec: "CL30-36-36-76",
      },
      {
        id: "pmic",
        name: "PMIC",
        what: "On-module power",
        detail:
          "DDR5 moved voltage regulation onto the stick for cleaner power, which is also why DDR5 overclocking behaves differently.",
        spec: "1.1–1.4 V",
      },
    ],
    specs: [
      { label: "Standard", value: "DDR5 / LPDDR5X" },
      { label: "Sweet spot", value: "32 GB (2×16) DDR5-6000" },
      { label: "Bandwidth", value: "~96 GB/s dual channel" },
      { label: "True latency", value: "~10 ns at CL30/6000" },
    ],
    faq: [
      {
        q: "Is 16GB still enough?",
        a: "For light use, yes. For modern games with a browser open, 32GB is the comfortable default now.",
      },
      {
        q: "Can I mix kits?",
        a: "You can try, but two kits bought separately are not guaranteed to train together. Buy one matched kit.",
      },
    ],
  },
  {
    slug: "nvme-ssd-explained",
    category: "storage",
    title: "NVMe SSDs: NAND, Queues & Real Speed",
    tagline: "Why the 14 GB/s number on the box rarely matters.",
    level: "Beginner",
    readMinutes: 6,
    tags: ["NVMe", "NAND", "DRAM cache", "endurance"],
    intro:
      "SSD marketing shouts about sequential speed. Everyday computing is mostly small random reads, where queue depth, controller quality and cache behaviour decide how snappy your machine feels.",
    keyIdeas: [
      "NVMe replaced the ancient AHCI protocol with thousands of parallel queues suited to flash.",
      "Drives write to a fast SLC cache first; sustained writes past that fall off a cliff.",
      "DRAM-less drives borrow system RAM (HMB) and are fine for most people, slower for heavy work.",
      "Endurance is rated in TBW — almost nobody reaches it in a consumer lifetime.",
    ],
    parts: [
      {
        id: "nand",
        name: "NAND flash",
        what: "The storage medium",
        detail:
          "3D stacked cells, 200+ layers tall. TLC stores 3 bits per cell, QLC stores 4 — more capacity, less endurance and slower writes.",
        spec: "TLC / QLC, 232+ layers",
      },
      {
        id: "controller",
        name: "Controller",
        what: "The traffic manager",
        detail:
          "Handles wear levelling, error correction, garbage collection and encryption. The single biggest differentiator between drives.",
        spec: "8-channel, PCIe 5.0",
      },
      {
        id: "dram",
        name: "DRAM cache",
        what: "Mapping table memory",
        detail:
          "Stores the logical-to-physical address map so the drive doesn't hunt through flash on every access. Keeps random performance high when full.",
        spec: "1 GB per 1 TB",
      },
      {
        id: "dsx",
        name: "Direct storage path",
        what: "GPU-bound loading",
        detail:
          "Compressed assets stream from SSD to GPU and decompress there, bypassing CPU bottlenecks and cutting level load times.",
        spec: "GDeflate compression",
      },
    ],
    specs: [
      { label: "Interface", value: "PCIe 5.0 x4 NVMe" },
      { label: "Sequential read", value: "up to 14,000 MB/s" },
      { label: "Random read", value: "1.5M IOPS" },
      { label: "Endurance", value: "600 TBW per TB" },
    ],
    faq: [
      {
        q: "Will a Gen5 SSD make games load faster?",
        a: "Marginally. Most titles are limited by decompression and engine work, not raw drive speed.",
      },
      {
        q: "How full can I fill an SSD?",
        a: "Keep 10–15% free so the controller has room for garbage collection and cache.",
      },
    ],
  },
  {
    slug: "home-networking-and-wifi7",
    category: "networking",
    title: "Home Networking & Wi-Fi 7",
    tagline: "Bandwidth is cheap. Latency and stability are the real prize.",
    level: "Beginner",
    readMinutes: 6,
    tags: ["Wi-Fi 7", "latency", "mesh", "2.5GbE"],
    intro:
      "Most 'slow internet' is actually a local problem: congestion, poor placement, or a router juggling too many devices. Understanding the hops between your machine and a server makes troubleshooting obvious.",
    keyIdeas: [
      "Multi-Link Operation lets Wi-Fi 7 devices use 2.4, 5 and 6 GHz bands at once for stability, not just speed.",
      "Every packet takes hops; ping measures the round trip, jitter measures how inconsistent it is.",
      "Wired 2.5GbE remains the cheapest upgrade for a desktop that matters.",
      "QoS and airtime fairness beat raw throughput for a busy household.",
    ],
    parts: [
      {
        id: "router",
        name: "Router",
        what: "Traffic director",
        detail:
          "Runs NAT, DHCP, firewall and QoS. Its CPU is what dies first when you enable heavy inspection features on a gigabit line.",
        spec: "Quad-core, 2.5GbE WAN",
      },
      {
        id: "ap",
        name: "Access point / radios",
        what: "The wireless part",
        detail:
          "Channel width trades range for speed: 320 MHz channels are blistering up close and useless through two walls.",
        spec: "320 MHz, 4×4 MU-MIMO",
      },
      {
        id: "switch",
        name: "Switch",
        what: "Wired fan-out",
        detail:
          "Forwards frames by MAC address at line rate. Managed switches add VLANs to separate work, IoT and guest traffic.",
        spec: "8-port 2.5GbE",
      },
      {
        id: "nic",
        name: "NIC",
        what: "Your machine's port",
        detail:
          "Offloads checksums and segmentation from the CPU. Gaming NICs mostly add software prioritisation, not magic.",
        spec: "2.5GbE / Wi-Fi 7 M.2",
      },
    ],
    specs: [
      { label: "Standard", value: "802.11be (Wi-Fi 7)" },
      { label: "Peak PHY rate", value: "~23 Gbps theoretical" },
      { label: "Bands", value: "2.4 / 5 / 6 GHz" },
      { label: "Good ping", value: "<20 ms to region" },
    ],
    faq: [
      {
        q: "Does Wi-Fi 7 lower ping?",
        a: "It reduces worst-case spikes thanks to multi-link, which feels better in games even when average ping is similar.",
      },
      {
        q: "Mesh or one strong router?",
        a: "Coverage problems need mesh; capacity problems need a better single unit and wired backhaul.",
      },
    ],
  },
  {
    slug: "frame-pacing-and-input-lag",
    category: "gaming",
    title: "Frame Pacing, Input Lag & Upscaling",
    tagline: "Smoothness is a consistency problem, not an average.",
    level: "Intermediate",
    readMinutes: 7,
    tags: ["FPS", "VRR", "frame gen", "1% lows"],
    intro:
      "A game at a steady 90 FPS feels better than one bouncing between 60 and 160. Your eyes read consistency, and your hands read the delay between click and photon.",
    keyIdeas: [
      "1% lows describe the worst frames — the ones you actually notice as stutter.",
      "Variable refresh rate syncs the display to the GPU instead of the other way around.",
      "Frame generation raises smoothness but does not reduce input latency; latency-reduction modes do.",
      "Render resolution, not output resolution, drives GPU load — that's the whole upscaling trick.",
    ],
    parts: [
      {
        id: "engine",
        name: "Game engine loop",
        what: "Simulate then submit",
        detail:
          "Input is sampled, the world simulates, draw calls are built, then the GPU renders. Long CPU frames stall everything downstream.",
        spec: "~5 ms CPU frame target",
      },
      {
        id: "queue",
        name: "Render queue",
        what: "Buffered frames",
        detail:
          "Deep queues smooth throughput but add latency. Low-latency modes cap the queue so the GPU starts work closer to your input.",
        spec: "1–3 frames deep",
      },
      {
        id: "upscale",
        name: "Upscaler",
        what: "Temporal reconstruction",
        detail:
          "Renders at, say, 1440p and reconstructs 4K using motion vectors and previous frames, then sharpens.",
        spec: "Quality = 67% scale",
      },
      {
        id: "display",
        name: "Display path",
        what: "Panel and scanout",
        detail:
          "Refresh rate, panel response and post-processing on the monitor all add milliseconds. Game mode disables most of it.",
        spec: "240 Hz OLED, 0.03 ms",
      },
    ],
    specs: [
      { label: "Competitive target", value: "240+ FPS, <25 ms click-to-photon" },
      { label: "Cinematic target", value: "60–90 FPS locked" },
      { label: "VRR range", value: "48–240 Hz" },
      { label: "Best value upgrade", value: "High-refresh panel + VRR" },
    ],
    faq: [
      {
        q: "Should I cap my frame rate?",
        a: "Yes — a cap slightly below your refresh rate keeps VRR active and frame times even.",
      },
      {
        q: "Is frame generation worth it?",
        a: "Great above ~60 real FPS for smoothness. Poor below that, where the added latency is obvious.",
      },
    ],
  },
  {
    slug: "ai-accelerators-and-npus",
    category: "ai",
    title: "AI Accelerators, NPUs & HBM",
    tagline: "Why matrix multiplication rebuilt the entire chip industry.",
    level: "Advanced",
    readMinutes: 8,
    tags: ["NPU", "transformers", "HBM", "quantisation"],
    intro:
      "Modern AI is mostly enormous matrix multiplications plus memory movement. Every recent hardware trend — tensor cores, HBM stacks, chiplets, on-device NPUs — is an answer to one of those two costs.",
    keyIdeas: [
      "Inference is usually memory-bandwidth bound, not compute bound; that's why HBM sells.",
      "Quantisation to 8- or 4-bit shrinks models enough to run locally with modest quality loss.",
      "NPUs win on performance-per-watt for sustained background tasks; GPUs win on raw throughput.",
      "Chiplets and advanced packaging let designers mix process nodes on one package.",
    ],
    parts: [
      {
        id: "mac",
        name: "Systolic array",
        what: "Matrix engine",
        detail:
          "A grid of multiply-accumulate units where data flows through rhythmically, keeping arithmetic units busy without re-reading memory constantly.",
        spec: "128×128 MAC grid",
      },
      {
        id: "hbm",
        name: "HBM stack",
        what: "Stacked memory",
        detail:
          "DRAM dies stacked vertically and wired to the processor through an interposer, delivering terabytes per second at short distance.",
        spec: "HBM3E, 8 TB/s",
      },
      {
        id: "inter",
        name: "Interconnect",
        what: "Chip-to-chip fabric",
        detail:
          "Training clusters live or die on interconnect. Fast links let thousands of accelerators behave like one enormous device.",
        spec: "900 GB/s per link",
      },
      {
        id: "npu2",
        name: "Client NPU",
        what: "Laptop AI block",
        detail:
          "Handles always-on, low-power inference so the CPU and GPU stay idle and the battery survives the meeting.",
        spec: "40–80 TOPS INT8",
      },
    ],
    specs: [
      { label: "Precision formats", value: "FP16, BF16, FP8, INT4" },
      { label: "Datacentre power", value: "700–1200 W per accelerator" },
      { label: "Local model size", value: "7B–14B params at 4-bit" },
      { label: "Packaging", value: "CoWoS / chiplet" },
    ],
    faq: [
      {
        q: "Can I run useful AI locally?",
        a: "Yes. A 7B–14B model quantised to 4-bit fits in 8–12GB of VRAM and handles summarising, coding help and chat well.",
      },
      {
        q: "Will NPUs replace GPUs?",
        a: "No. They complement them — efficient for small persistent tasks, far too small for training.",
      },
    ],
  },
  {
    slug: "cooling-and-thermals",
    category: "cpu",
    title: "Cooling, Thermals & Boost Behaviour",
    tagline: "Your chip is as fast as its heat budget allows.",
    level: "Beginner",
    readMinutes: 5,
    tags: ["TDP", "boost", "airflow", "undervolting"],
    intro:
      "Modern processors don't have a fixed speed. They boost until they hit a power, current or temperature limit — so cooling and case airflow are performance features, not accessories.",
    keyIdeas: [
      "TDP is a design guideline, not a real power draw at boost.",
      "Case airflow matters more than exotic coolers in most builds.",
      "Undervolting often gains performance by letting the chip boost longer.",
      "Thermal throttling is safe, but it caps sustained results.",
    ],
    parts: [
      {
        id: "ihs",
        name: "IHS & paste",
        what: "First heat hop",
        detail:
          "Heat crosses from die to heat spreader through a thermal interface. Poor contact here caps everything downstream.",
        spec: "<5 °C delta ideal",
      },
      {
        id: "cooler",
        name: "Cooler",
        what: "Heat transport",
        detail:
          "Air towers move heat via heat pipes into fins; AIO liquid loops move it to a radiator. Both end up dumping into case air.",
        spec: "150–280 W capacity",
      },
      {
        id: "airflow",
        name: "Case airflow",
        what: "Getting heat out",
        detail:
          "Slight positive pressure with clear intake and exhaust paths beats a wall of fans fighting a mesh-less front panel.",
        spec: "2 in / 1 out minimum",
      },
      {
        id: "curve",
        name: "Fan curve",
        what: "Noise vs temp",
        detail:
          "Tie fans to a slower-reacting sensor to avoid revving on every spike. Hysteresis is the difference between quiet and irritating.",
        spec: "30–70% ramp",
      },
    ],
    specs: [
      { label: "Safe CPU load temp", value: "<90 °C" },
      { label: "Safe GPU hotspot", value: "<105 °C" },
      { label: "Typical desktop draw", value: "250–650 W" },
      { label: "Quiet target", value: "<35 dBA" },
    ],
    faq: [
      {
        q: "Is 85 °C too hot?",
        a: "No. Modern chips are designed to sit near their limit and will protect themselves long before damage.",
      },
      {
        q: "Air or liquid?",
        a: "A good air tower matches most 240mm AIOs. Liquid wins on clearance and looks more than raw capability.",
      },
    ],
  },
  {
    slug: "gaming-rig-tiers",
    category: "gaming",
    title: "Building a Gaming Rig: Tiers That Make Sense",
    tagline: "Where each pound actually turns into frames.",
    level: "Beginner",
    readMinutes: 6,
    tags: ["builds", "budget", "1440p", "balance"],
    intro:
      "Balanced builds beat lopsided ones. Match your GPU to your monitor first, then give it enough CPU and memory to stay fed, then spend what's left on quality of life.",
    keyIdeas: [
      "Buy for the resolution and refresh rate you actually play at.",
      "A mid-tier CPU pairs fine with a high-tier GPU at 1440p and above.",
      "Power supply and case are the parts you keep across three builds.",
      "Storage is the cheapest satisfaction upgrade left.",
    ],
    parts: [
      {
        id: "entry",
        name: "1080p / 144 Hz",
        what: "Entry esports",
        detail:
          "6-core CPU, mid GPU, 16–32GB DDR5, 1TB NVMe. Runs competitive titles at very high frame rates and modern games at high settings.",
        spec: "~£800 class",
      },
      {
        id: "mid",
        name: "1440p / 165 Hz",
        what: "The sweet spot",
        detail:
          "8-core CPU, upper-mid GPU with 12–16GB VRAM, 32GB DDR5-6000, 2TB NVMe. The best frames-per-pound in 2026.",
        spec: "~£1,400 class",
      },
      {
        id: "high",
        name: "4K / 240 Hz",
        what: "Flagship",
        detail:
          "Top CPU, flagship GPU with 16GB+, fast memory, 4TB storage and a serious cooling plan. Diminishing returns start here.",
        spec: "~£2,800 class",
      },
      {
        id: "handheld",
        name: "Handheld / SFF",
        what: "Small form factor",
        detail:
          "APUs with shared memory bandwidth. Efficiency and thermals dominate; TDP sliders matter more than clock speed.",
        spec: "15–30 W APU",
      },
    ],
    specs: [
      { label: "Best value resolution", value: "1440p" },
      { label: "PSU headroom", value: "GPU peak + 40%" },
      { label: "Recommended memory", value: "32 GB DDR5-6000 CL30" },
      { label: "Upgrade cadence", value: "GPU every 3–4 years" },
    ],
    faq: [
      {
        q: "What should I upgrade first?",
        a: "Whatever your monitor exposes. A 4K panel wants GPU; a 240Hz 1080p panel wants CPU.",
      },
      {
        q: "How big a PSU?",
        a: "Cover peak GPU transients with roughly 40% headroom and buy a decent platform rating.",
      },
    ],
  },
];

export const comparisons: {
  id: string;
  title: string;
  blurb: string;
  rows: { label: string; a: string; b: string; winner: "a" | "b" | "tie" }[];
  a: string;
  b: string;
}[] = [
  {
    id: "cpu-vs-gpu",
    title: "CPU vs GPU",
    a: "CPU",
    b: "GPU",
    blurb: "A few fast generalists versus thousands of parallel specialists.",
    rows: [
      { label: "Core count", a: "6–24 complex cores", b: "4,000–20,000 simple cores", winner: "tie" },
      { label: "Best at", a: "Branchy, sequential logic", b: "Same maths on huge data sets", winner: "tie" },
      { label: "Latency per task", a: "Very low", b: "Higher, hidden by parallelism", winner: "a" },
      { label: "Throughput", a: "~1 TFLOP", b: "50–1,000 TFLOPS", winner: "b" },
      { label: "Memory", a: "System DDR5, big capacity", b: "GDDR7/HBM, huge bandwidth", winner: "b" },
      { label: "AI inference", a: "Fine for small models", b: "The default choice", winner: "b" },
    ],
  },
  {
    id: "ddr4-vs-ddr5",
    title: "DDR4 vs DDR5",
    a: "DDR4",
    b: "DDR5",
    blurb: "Higher latency, far more bandwidth — and it now wins outright.",
    rows: [
      { label: "Typical speed", a: "3200–3600 MT/s", b: "6000–8000 MT/s", winner: "b" },
      { label: "True latency", a: "~9 ns", b: "~10 ns", winner: "a" },
      { label: "Channels per DIMM", a: "1 × 64-bit", b: "2 × 32-bit", winner: "b" },
      { label: "Capacity per stick", a: "up to 32 GB", b: "up to 64 GB", winner: "b" },
      { label: "Power management", a: "On motherboard", b: "On-module PMIC", winner: "b" },
      { label: "Platform cost", a: "Cheap, end of life", b: "Standard in 2026", winner: "b" },
    ],
  },
  {
    id: "sata-vs-nvme",
    title: "SATA SSD vs NVMe SSD",
    a: "SATA",
    b: "NVMe",
    blurb: "One protocol was designed for spinning rust. The other wasn't.",
    rows: [
      { label: "Peak sequential", a: "550 MB/s", b: "14,000 MB/s", winner: "b" },
      { label: "Queues", a: "1 queue, 32 commands", b: "64K queues", winner: "b" },
      { label: "Everyday feel", a: "Already very good", b: "Slightly snappier", winner: "tie" },
      { label: "Cost per TB", a: "Lower", b: "Close, and falling", winner: "a" },
      { label: "Install", a: "Cable + power", b: "Single M.2 screw", winner: "b" },
      { label: "Heat", a: "Cool", b: "Needs a heatsink at Gen5", winner: "a" },
    ],
  },
  {
    id: "raster-vs-rt",
    title: "Rasterisation vs Ray Tracing",
    a: "Raster",
    b: "Ray tracing",
    blurb: "Clever approximations versus simulating light itself.",
    rows: [
      { label: "Performance cost", a: "Low", b: "High", winner: "a" },
      { label: "Reflection accuracy", a: "Screen-space hacks", b: "Physically correct", winner: "b" },
      { label: "Global illumination", a: "Baked or probes", b: "Dynamic, real time", winner: "b" },
      { label: "Hardware needed", a: "Any modern GPU", b: "RT-capable GPU", winner: "a" },
      { label: "Art pipeline", a: "Manual light placement", b: "Lights just work", winner: "b" },
      { label: "Best use", a: "Competitive, high FPS", b: "Cinematic single-player", winner: "tie" },
    ],
  },
];

export const trending: {
  id: string;
  title: string;
  summary: string;
  category: CategoryId;
  tag: "New" | "Rumour" | "Deep dive" | "Benchmark";
  date: string;
}[] = [
  {
    id: "t1",
    title: "Client NPUs cross 80 TOPS",
    summary:
      "Laptop chips now ship neural blocks fast enough to run 8B-parameter assistants locally without touching the GPU or the battery.",
    category: "ai",
    tag: "New",
    date: "2026-09-02",
  },
  {
    id: "t2",
    title: "GDDR7 hits mainstream cards",
    summary:
      "Mid-range GPUs move to GDDR7, pushing memory bandwidth past 1 TB/s and finally easing the 1440p texture squeeze.",
    category: "gpu",
    tag: "Benchmark",
    date: "2026-08-27",
  },
  {
    id: "t3",
    title: "PCIe 6.0 boards enter validation",
    summary:
      "Early platforms double per-lane bandwidth again. Expect it in workstations long before it changes anything for gamers.",
    category: "motherboard",
    tag: "Rumour",
    date: "2026-08-19",
  },
  {
    id: "t4",
    title: "Stacked cache goes multi-die",
    summary:
      "Vertical L3 on both compute dies removes the scheduling headaches that dogged the first generation of gaming-focused chips.",
    category: "cpu",
    tag: "Deep dive",
    date: "2026-08-11",
  },
  {
    id: "t5",
    title: "Wi-Fi 7 multi-link becomes default",
    summary:
      "Routers now enable MLO out of the box, cutting worst-case latency spikes on congested apartment networks.",
    category: "networking",
    tag: "New",
    date: "2026-08-05",
  },
  {
    id: "t6",
    title: "Handhelds adopt LPDDR5X-9600",
    summary:
      "Shared-memory APUs were bandwidth-starved; the new memory tier lifts handheld frame rates by double digits at the same wattage.",
    category: "gaming",
    tag: "Benchmark",
    date: "2026-07-30",
  },
];

export const learningPaths = [
  {
    id: "beginner",
    name: "PC Fundamentals",
    steps: ["how-a-cpu-works", "ram-latency-vs-bandwidth", "nvme-ssd-explained", "cooling-and-thermals"],
    blurb: "Start from zero and understand every part inside the case.",
  },
  {
    id: "gamer",
    name: "Gaming Performance",
    steps: ["gpu-rendering-pipeline", "frame-pacing-and-input-lag", "gaming-rig-tiers", "home-networking-and-wifi7"],
    blurb: "Learn what actually turns hardware into smooth frames.",
  },
  {
    id: "ai",
    name: "AI Hardware",
    steps: ["ai-accelerators-and-npus", "gpu-rendering-pipeline", "motherboard-chipsets-and-lanes"],
    blurb: "Follow the silicon behind the model boom.",
  },
];

export const getTopic = (slug: string) => topics.find((t) => t.slug === slug);
export const categoryById = (id: CategoryId) => categories.find((c) => c.id === id)!;
