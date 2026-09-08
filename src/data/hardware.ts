import type { CategoryId } from "./tech";

export type ModelKind = "cpu" | "gpu" | "motherboard" | "ram" | "ssd";

export type HwPart = {
  id: string;
  name: string;
  role: string;
  detail: string;
  spec: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: CategoryId;
  kind: ModelKind;
  generation: string;
  year: number;
  tagline: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  /** Overrides / additions on top of the shared part library for this model kind. */
  partNotes?: Record<string, string>;
};

/**
 * Every clickable piece of each 3D model. The ids here match the mesh ids in
 * src/components/three/HardwareModel.tsx.
 */
export const kindParts: Record<ModelKind, HwPart[]> = {
  cpu: [
    {
      id: "ihs",
      name: "Integrated heat spreader",
      role: "Moves heat from the die to your cooler",
      detail:
        "A nickel-plated copper lid soldered (on modern chips) to the silicon underneath. Its job is to spread a hotspot only a few square millimetres wide across a surface big enough for a cooler to grab. Because the die is so small, the limit is rarely the cooler's size — it is how fast heat crosses this lid. That is why delidding or direct-die cooling can drop temperatures 10–15 °C, and why thin, flat contact plus thermal paste that does not pump out matter more than fan count.",
      spec: "Nickel-plated copper, soldered TIM",
    },
    {
      id: "compute-die",
      name: "Compute die / core tile",
      role: "The cores that actually execute your code",
      detail:
        "Each core is a pipeline: it fetches instructions, guesses which branch you will take, breaks the instruction into micro-ops, runs several of them at once out of order, then retires them in order so the result looks sequential. Modern chips mix wide performance cores with smaller efficiency cores; the scheduler in Windows or macOS decides where your game thread lands. Clock speed only tells you how fast a stage ticks — how many instructions finish per tick (IPC) is what separates generations.",
      spec: "Hybrid P-core / E-core cluster",
    },
    {
      id: "cache",
      name: "Cache slices (L2 / L3)",
      role: "Keeps hot data next to the cores",
      detail:
        "Main memory is roughly 70–100 ns away — hundreds of wasted cycles. Cache is a tiered buffer: L1 answers in ~1 ns, L2 in ~3 ns, the shared L3 ring in ~10–15 ns. Games are unusually cache-hungry because their working set of world state jumps around, which is exactly why stacking extra L3 vertically (3D V-Cache) can add 20–30% frames in simulation-heavy titles while doing almost nothing for video encoding.",
      spec: "Shared L3 ring / stacked SRAM",
    },
    {
      id: "io-die",
      name: "I/O die & memory controller",
      role: "Talks to RAM, PCIe and the chipset",
      detail:
        "On a chiplet CPU the cores live on a cutting-edge node while this piece stays on an older, cheaper one — analogue circuits do not shrink well. It hosts the DDR5 memory controller, the PCIe root complex and the link to the chipset. It also sets your real memory ceiling: pushing DDR5 past roughly 6000–6400 MT/s often forces the controller into a slower divider, so faster RAM can end up slower in practice.",
      spec: "DDR5 controller + PCIe 5.0 root",
    },
    {
      id: "substrate",
      name: "Organic substrate",
      role: "Fan-out from micron pitch to socket pitch",
      detail:
        "The green board under the lid is a multi-layer package that spreads a few thousand micro-bumps out to socket-sized contacts, while also delivering clean power. It hides length-matched traces so that all 64 bits of a memory channel arrive within picoseconds of each other, plus the decoupling capacitors you can see as tiny black blocks that absorb current spikes when every core wakes at once.",
      spec: "Multi-layer organic package",
    },
    {
      id: "pads",
      name: "Land grid / pins",
      role: "Power and signal into the socket",
      detail:
        "Most of these contacts are not data at all — the majority carry power and ground, because a modern CPU can pull 250 W at around 1.2 V, which is over 200 amps. The signal pads are the interesting minority: memory channels, PCIe lanes, the chipset link and a handful of management pins. A single bent socket pin usually kills one memory channel or a PCIe lane rather than the whole board.",
      spec: "1700–1851 contacts (LGA) / 1718 (AM5)",
    },
  ],
  gpu: [
    {
      id: "gpu-die",
      name: "GPU die",
      role: "Thousands of shader cores running in lockstep",
      detail:
        "Where a CPU has a handful of very clever cores, this holds thousands of simple ones grouped into blocks that all execute the same instruction on different pixels. Alongside them sit fixed-function units: RT cores that walk a bounding-volume tree to find ray hits, and tensor/matrix units that do the low-precision maths behind upscaling and frame generation. This is also the single biggest, hottest die in your PC — often 300–600 mm² of silicon.",
      spec: "Shader arrays + RT + tensor blocks",
    },
    {
      id: "vram",
      name: "VRAM modules",
      role: "Feeds the die with textures and buffers",
      detail:
        "The black squares ringing the die are GDDR packages, placed as close as physically possible because signal integrity at 20+ Gbps collapses over distance. Bandwidth equals bus width × speed, so a 256-bit card at 20 Gbps moves about 640 GB/s. Capacity matters differently from bandwidth: run out of it and the driver spills to system RAM over PCIe, which shows up as sudden stutter and 1% low collapse rather than a smooth frame-rate drop.",
      spec: "GDDR6 / GDDR6X / GDDR7, 128–512-bit",
    },
    {
      id: "vrm",
      name: "Power stages (VRM)",
      role: "Turns 12 V into ~1 V at hundreds of amps",
      detail:
        "The row of chunky components along the edge is a multi-phase buck converter. Each phase switches hundreds of thousands of times a second and they take turns, so ripple stays small and heat is spread out. Transient response is the real story: a GPU can swing from idle to full load in microseconds, and boards with weak filtering produce the voltage spikes that trip power supplies on high-end cards.",
      spec: "12–24 phase, 50–70 A stages",
    },
    {
      id: "cooler",
      name: "Heatsink & heatpipes",
      role: "Carries heat out to the fins",
      detail:
        "A vapour chamber or flattened heatpipes sit on the die; inside, fluid boils at the hot end, travels as vapour, condenses at the fins and wicks back. It moves heat far better than solid copper. The fins are then sized for airflow, not looks — fin spacing is tuned to the fan's static pressure, which is why an over-thick cooler with cheap fans can lose to a slimmer, well-matched design.",
      spec: "Vapour chamber + aluminium fin stack",
    },
    {
      id: "fans",
      name: "Fans",
      role: "Pushes air through the fin stack",
      detail:
        "Modern cards idle with the fans fully stopped and only start them past roughly 55–60 °C, which is why a silent card is normal rather than broken. Blade shape trades airflow against static pressure, and the middle fan often spins opposite to its neighbours to cut turbulence between them. Noise usually comes from bearing whine and the fin-passing tone rather than raw RPM.",
      spec: "Zero-RPM idle, 3 × 90–110 mm",
    },
    {
      id: "pcie-fingers",
      name: "PCIe edge connector",
      role: "The link to the CPU",
      detail:
        "Sixteen lanes, each a differential pair in both directions. PCIe 4.0 gives about 2 GB/s per lane and 5.0 doubles it, so a x16 5.0 slot is roughly 63 GB/s each way. Games barely saturate this — until VRAM overflows, when every missing texture crosses this connector and the bus becomes the bottleneck you feel.",
      spec: "PCIe 4.0 / 5.0 x16",
    },
    {
      id: "power-connector",
      name: "Power connector",
      role: "Brings in most of the board's watts",
      detail:
        "The slot itself supplies only 75 W, so everything above that arrives here. The 12V-2x6 connector carries up to 600 W over six pairs plus four small sense pins that tell the card how much the PSU can deliver. Because the pins share current passively, a partially seated plug forces too much through one pin — which is exactly the failure mode behind melted connectors. Push until the latch clicks.",
      spec: "12V-2x6 (600 W) or 8-pin PCIe",
    },
    {
      id: "outputs",
      name: "Display outputs",
      role: "Where pixels leave the card",
      detail:
        "DisplayPort 2.1 at UHBR20 carries about 80 Gbps, enough for 4K/240 Hz without compression; HDMI 2.1 does 48 Gbps. Beyond that the link uses Display Stream Compression, a visually lossless scheme that is what actually makes 4K/240 or 8K panels work. The display engine here also handles variable refresh, so the monitor waits for the frame instead of tearing.",
      spec: "3 × DP 2.1 + HDMI 2.1",
    },
  ],
  motherboard: [
    {
      id: "socket",
      name: "CPU socket",
      role: "Holds the processor and all its lanes",
      detail:
        "Under the retention frame are well over a thousand spring contacts that must all touch flat within microns — that is why the load mechanism feels alarmingly stiff. The socket fixes your upgrade path: it defines the memory generation, how many PCIe lanes reach the slots, and which chips the firmware can even initialise.",
      spec: "LGA1851 / AM5 (LGA1718)",
    },
    {
      id: "vrm",
      name: "VRM & heatsinks",
      role: "Feeds the CPU clean, stable power",
      detail:
        "The phases beside the socket convert 12 V down to the CPU's roughly 1.1–1.3 V. Phase count matters less than the current rating of each stage and how well the heatsink is coupled to them. Weak VRMs do not usually fail outright — they get hot, then throttle the CPU quietly under sustained all-core loads, which looks like a slow CPU rather than a board problem.",
      spec: "16+1+2 phase, 90 A stages",
    },
    {
      id: "dimm",
      name: "DIMM slots",
      role: "Memory channels to the CPU",
      detail:
        "Two channels, two slots each. Populate the second slot of each channel (usually A2/B2) for a single kit — the far slots keep the trace stubs short and let memory clock higher. Filling all four halves the electrical headroom, which is why four-stick DDR5 kits often need a lower speed to boot at all. Daisy-chain layouts favour two sticks; T-topology boards favour four.",
      spec: "4 × DDR5, dual channel",
    },
    {
      id: "pcie",
      name: "PCIe x16 slot",
      role: "Primary graphics link",
      detail:
        "The top slot is wired straight to the CPU for the shortest path. Watch for lane sharing: on many boards, populating a second M.2 drops this slot from x16 to x8. The metal shielding is structural, protecting the solder joints from the weight of a 2 kg graphics card, and the small latch has to be pressed before the card will come out.",
      spec: "PCIe 5.0 x16, CPU-attached",
    },
    {
      id: "chipset",
      name: "Chipset",
      role: "Fans a few CPU lanes out to everything else",
      detail:
        "The CPU has only around 20–28 usable lanes, nowhere near enough for every USB port, SATA connector and extra M.2. The chipset takes a x4 or x8 uplink and multiplexes it into dozens of downstream ports. Everything hanging off it shares that uplink, so a chipset-attached SSD copying at full speed and a 10 GbE card can genuinely contend with each other.",
      spec: "Z890 / X870E, x8 DMI uplink",
    },
    {
      id: "m2",
      name: "M.2 slots",
      role: "NVMe storage, soldered close to the source",
      detail:
        "The top slot is normally CPU-attached and PCIe 5.0 — the fastest place for your boot drive. Lower slots run through the chipset and share its uplink. The heatsink is not decoration: 5.0 controllers throttle within seconds of a sustained write without one, which turns a 14 GB/s drive into a 2 GB/s one mid-transfer.",
      spec: "PCIe 5.0 x4 + 3 × 4.0 x4",
    },
    {
      id: "atx-power",
      name: "24-pin & EPS power",
      role: "Main power entry",
      detail:
        "The 24-pin feeds the board's own rails and standby power; the 8-pin EPS connectors near the socket feed the CPU VRM directly and can carry 300 W or more. High-end boards use two EPS plugs to split the current between more pins and keep them cool. Missing the second one is a classic cause of a fully built PC that will not post.",
      spec: "24-pin ATX + 2 × 8-pin EPS",
    },
    {
      id: "rear-io",
      name: "Rear I/O",
      role: "USB, networking, audio",
      detail:
        "USB4/Thunderbolt at 40 Gbps carries data, DisplayPort and 100 W of charging over one reversible cable. The 2.5 GbE controller matters for latency as much as throughput, and the audio section is deliberately isolated on its own PCB island with separate ground so the switching noise from everything else does not leak into your headphones.",
      spec: "USB4 40 Gbps, 2.5 GbE, Wi-Fi 7",
    },
  ],
  ram: [
    {
      id: "dram",
      name: "DRAM chips",
      role: "Stores your working data",
      detail:
        "Each bit is one transistor and one tiny capacitor holding a charge that leaks away in milliseconds, so the chip rewrites every row thousands of times a second — that is the 'dynamic' in DRAM, and it is why RAM forgets when the power stops. Data lives in rows; opening a row is slow, reading down an already-open row is fast. Almost every timing number on the box describes that dance.",
      spec: "16 Gb dies, 8 or 16 per module",
    },
    {
      id: "pmic",
      name: "PMIC",
      role: "On-module power regulation",
      detail:
        "DDR5 moved voltage regulation from the motherboard onto the stick itself, so each module makes its own clean 1.1 V and the two 32-bit sub-channels get stable supply right where they are used. It is also why DDR5 overclocking happens in a different place than it used to, and why an XMP or EXPO profile has to carry PMIC voltages rather than just frequency and timings.",
      spec: "On-DIMM 1.1 V regulation",
    },
    {
      id: "spd",
      name: "SPD hub",
      role: "Tells the board what this stick is",
      detail:
        "A small EEPROM holding the module's safe default speed plus its XMP or EXPO profiles. At power-on the board reads this before anything else and boots at the conservative JEDEC speed — that is why brand-new memory runs at 4800 MT/s until you switch the profile on in firmware. It also stores the thermal sensor readings the board uses to throttle memory.",
      spec: "JEDEC + XMP 3.0 / EXPO profiles",
    },
    {
      id: "heatspreader",
      name: "Heat spreader",
      role: "Cooling, and clearance you have to check",
      detail:
        "DDR5 at high speed with an active PMIC genuinely produces heat, and hot memory silently increases refresh rate and loses bandwidth. The spreader helps — but tall ones are the number-one cause of a big air cooler not fitting. Low-profile kits exist for exactly this reason, and RGB versions add a controller board that raises height further.",
      spec: "Aluminium, 34–44 mm tall",
    },
    {
      id: "fingers",
      name: "Gold fingers & notch",
      role: "The electrical and mechanical interface",
      detail:
        "The off-centre notch is a physical key: DDR5 will simply not seat in a DDR4 slot, no matter how hard you press. The 288 gold-plated contacts carry two independent 32-bit sub-channels, which is why one DDR5 stick already behaves a bit like two smaller channels and improves access parallelism over DDR4.",
      spec: "288-pin, 2 × 32-bit sub-channels",
    },
  ],
  ssd: [
    {
      id: "controller",
      name: "Controller",
      role: "The brain of the drive",
      detail:
        "A small multi-core processor running firmware that maps the logical blocks your OS asks for onto constantly-moving physical NAND pages. It handles wear levelling, garbage collection, error correction and encryption. PCIe 5.0 controllers are fast enough that heat, not flash, is the limit — they will throttle hard in seconds without a heatsink.",
      spec: "8-channel, PCIe 5.0 x4",
    },
    {
      id: "nand",
      name: "NAND packages",
      role: "Where the data actually lives",
      detail:
        "Charge trapped in stacked cells, now over 200 layers deep. TLC stores three bits per cell and QLC four — more capacity per wafer, but fewer voltage levels apart, so QLC is slower to write and endures fewer cycles. Flash can only be erased in large blocks, which is why drives keep a fast pseudo-SLC cache and why speed drops on very long writes once that cache is exhausted.",
      spec: "3D TLC, 232+ layers",
    },
    {
      id: "dram-cache",
      name: "DRAM cache",
      role: "Holds the address map",
      detail:
        "This chip stores the flash translation table so the controller can find any block instantly. DRAM-less drives keep that table in flash and borrow a slice of system RAM instead (HMB) — fine for a laptop, but noticeably worse for random reads under load, which is what makes a PC feel snappy. Sequential benchmark numbers hide this difference almost completely.",
      spec: "1 GB LPDDR4 per 1 TB",
    },
    {
      id: "m2-key",
      name: "M.2 edge connector",
      role: "Slots straight into the board",
      detail:
        "An M-key edge carrying four PCIe lanes plus power. The notch position prevents putting an NVMe drive in a SATA-only slot. The 2280 name is literal: 22 mm wide, 80 mm long — worth checking against laptops and handhelds, which often only take 2230 or 2242.",
      spec: "M.2 2280, M-key, PCIe x4",
    },
    {
      id: "label",
      name: "Label & heatsink",
      role: "More functional than it looks",
      detail:
        "Many stock labels have a thin copper or graphene layer that genuinely helps spread heat, so peeling it off can make things worse. On PCIe 5.0 drives a proper heatsink is mandatory rather than optional — without one the controller crosses 80 °C within about 30 seconds of a big write and halves its own speed to survive.",
      spec: "Graphene label or alloy heatsink",
    },
  ],
};

export const products: Product[] = [
  // ---------------- CPUs ----------------
  {
    id: "core-ultra-9-285k",
    name: "Core Ultra 9 285K",
    brand: "Intel",
    category: "cpu",
    kind: "cpu",
    generation: "Arrow Lake (Core Ultra 200S)",
    year: 2024,
    tagline: "Intel's first desktop chiplet design, built for efficiency over raw clocks.",
    highlights: [
      "24 cores: 8 performance + 16 efficiency, no hyper-threading",
      "Tiles built on TSMC N3B and stitched with Foveros packaging",
      "Big drop in power draw versus the 14900K at similar multi-core output",
    ],
    specs: [
      { label: "Cores / threads", value: "24 / 24" },
      { label: "Max boost", value: "5.7 GHz" },
      { label: "L3 cache", value: "36 MB" },
      { label: "Memory", value: "DDR5-6400" },
      { label: "TDP / turbo", value: "125 W / 250 W" },
      { label: "Socket", value: "LGA1851" },
    ],
    partNotes: {
      "compute-die":
        "Arrow Lake splits the P-cores (Lion Cove) and E-cores (Skymont) onto a compute tile made on TSMC's N3B node. Hyper-threading is gone: Intel found the die area was better spent on more E-cores, which is why multi-core throughput holds up while some older threaded benchmarks regress.",
      "io-die":
        "A separate SoC tile carries the memory controller, an NPU for on-device AI and the low-power island that handles background work while the compute tile sleeps entirely.",
    },
  },
  {
    id: "core-i9-14900k",
    name: "Core i9-14900K",
    brand: "Intel",
    category: "cpu",
    kind: "cpu",
    generation: "Raptor Lake Refresh (14th Gen)",
    year: 2023,
    tagline: "The last monolithic Intel flagship — enormous clocks, enormous appetite.",
    highlights: [
      "24 cores / 32 threads with hyper-threading still intact",
      "Hits 6.0 GHz on the best two cores",
      "Needs the microcode fix and sane power limits for long-term stability",
    ],
    specs: [
      { label: "Cores / threads", value: "24 / 32" },
      { label: "Max boost", value: "6.0 GHz" },
      { label: "L3 cache", value: "36 MB" },
      { label: "Memory", value: "DDR5-5600" },
      { label: "TDP / turbo", value: "125 W / 253 W" },
      { label: "Socket", value: "LGA1700" },
    ],
    partNotes: {
      ihs: "Raptor Lake's thick copper lid sits above a small, extremely dense die — the reason this chip can pull 300 W and still spike past 90 °C on a 360 mm radiator. Contact frame kits exist because the stock socket mechanism bends the package slightly.",
    },
  },
  {
    id: "ryzen-9-9950x",
    name: "Ryzen 9 9950X",
    brand: "AMD",
    category: "cpu",
    kind: "cpu",
    generation: "Zen 5 (Ryzen 9000)",
    year: 2024,
    tagline: "Two eight-core chiplets and a full AVX-512 data path.",
    highlights: [
      "16 cores / 32 threads on the AM5 socket",
      "Full-width AVX-512 — huge for encoding and scientific work",
      "Runs far cooler than the previous generation at the same output",
    ],
    specs: [
      { label: "Cores / threads", value: "16 / 32" },
      { label: "Max boost", value: "5.7 GHz" },
      { label: "L3 cache", value: "64 MB" },
      { label: "Memory", value: "DDR5-5600" },
      { label: "TDP / turbo", value: "170 W / 230 W" },
      { label: "Socket", value: "AM5" },
    ],
    partNotes: {
      "io-die":
        "AMD's cIOD is still on a 6 nm node and hosts the memory controller plus the Infinity Fabric links to both core chiplets. Its fabric clock is why memory tuning on AM5 revolves around keeping FCLK, UCLK and MCLK in a clean ratio.",
      cache:
        "64 MB of L3 arrives as two separate 32 MB pools, one per chiplet. A thread that migrates between chiplets loses its cache, which is why pinning a game to one CCD sometimes gains frames.",
    },
  },
  {
    id: "ryzen-7-9800x3d",
    name: "Ryzen 7 9800X3D",
    brand: "AMD",
    category: "cpu",
    kind: "cpu",
    generation: "Zen 5 + 3D V-Cache",
    year: 2024,
    tagline: "The gaming CPU: 96 MB of L3 stacked under the cores.",
    highlights: [
      "Cache die moved beneath the cores, so it clocks and overclocks freely",
      "Dominant in simulation and strategy games bound by cache misses",
      "Only 8 cores — a 9950X still wins heavy rendering work",
    ],
    specs: [
      { label: "Cores / threads", value: "8 / 16" },
      { label: "Max boost", value: "5.2 GHz" },
      { label: "L3 cache", value: "96 MB (64 MB stacked)" },
      { label: "Memory", value: "DDR5-5600" },
      { label: "TDP / turbo", value: "120 W / 162 W" },
      { label: "Socket", value: "AM5" },
    ],
    partNotes: {
      cache:
        "This is the whole point of the chip. A 64 MB SRAM die is bonded underneath the core die with direct copper-to-copper contacts, tripling L3. Flipping the stack means the cores now sit on top, touching the heat spreader, which fixed the clock and thermal penalty the 5800X3D had.",
    },
  },
  {
    id: "apple-m4-pro",
    name: "Apple M4 Pro",
    brand: "Apple",
    category: "cpu",
    kind: "cpu",
    generation: "M4 family, 3 nm",
    year: 2024,
    tagline: "A whole system on one package — CPU, GPU, NPU and memory together.",
    highlights: [
      "Unified memory: CPU and GPU read the same pool with no copying",
      "Very high IPC at modest clocks, so laptop battery life stays intact",
      "A 38 TOPS neural engine for on-device AI",
    ],
    specs: [
      { label: "CPU cores", value: "14 (10P + 4E)" },
      { label: "GPU cores", value: "20" },
      { label: "Memory", value: "Up to 64 GB unified, 273 GB/s" },
      { label: "Neural engine", value: "16-core, 38 TOPS" },
      { label: "Process", value: "TSMC N3E" },
      { label: "Package", value: "SoC with on-package LPDDR5X" },
    ],
    partNotes: {
      substrate:
        "Apple mounts the LPDDR5X memory dies on the same package as the SoC. Wires get shorter, so bandwidth rises and power per bit falls — but memory is soldered at purchase and can never be upgraded.",
      pads: "There is no socket at all. The package is soldered to the logic board, which removes the socket's electrical overhead and any upgrade path along with it.",
    },
  },

  // ---------------- GPUs ----------------
  {
    id: "rtx-5090",
    name: "GeForce RTX 5090",
    brand: "NVIDIA",
    category: "gpu",
    kind: "gpu",
    generation: "Blackwell (RTX 50)",
    year: 2025,
    tagline: "32 GB of GDDR7 on a 512-bit bus, and a 575 W appetite to match.",
    highlights: [
      "First consumer card with GDDR7 and nearly 1.8 TB/s of bandwidth",
      "Multi-frame generation renders up to three extra frames per real one",
      "Needs the 12V-2x6 plug fully seated — no compromise here",
    ],
    specs: [
      { label: "Shader cores", value: "21,760" },
      { label: "VRAM", value: "32 GB GDDR7, 512-bit" },
      { label: "Bandwidth", value: "1,792 GB/s" },
      { label: "Board power", value: "575 W" },
      { label: "Interface", value: "PCIe 5.0 x16" },
      { label: "Outputs", value: "3 × DP 2.1b, 1 × HDMI 2.1" },
    ],
    partNotes: {
      vram: "Sixteen GDDR7 packages surround the die on a 512-bit bus. GDDR7 uses three-level PAM3 signalling instead of PAM4, trading a little per-pin density for much better signal integrity at 28+ Gbps.",
      "power-connector":
        "At 575 W this card runs close to the 12V-2x6 connector's 600 W ceiling. Seat it until it clicks, keep the bend at least 35 mm away from the plug, and use the PSU's native cable rather than an adapter chain.",
    },
  },
  {
    id: "rtx-5070-ti",
    name: "GeForce RTX 5070 Ti",
    brand: "NVIDIA",
    category: "gpu",
    kind: "gpu",
    generation: "Blackwell (RTX 50)",
    year: 2025,
    tagline: "The sensible 1440p-to-4K Blackwell card, with 16 GB of headroom.",
    highlights: [
      "16 GB GDDR7 on a 256-bit bus — enough for 4K textures",
      "Roughly 4080-class raster with the newer AI feature set",
      "300 W means a normal 750 W supply is fine",
    ],
    specs: [
      { label: "Shader cores", value: "8,960" },
      { label: "VRAM", value: "16 GB GDDR7, 256-bit" },
      { label: "Bandwidth", value: "896 GB/s" },
      { label: "Board power", value: "300 W" },
      { label: "Interface", value: "PCIe 5.0 x16" },
      { label: "Outputs", value: "3 × DP 2.1b, 1 × HDMI 2.1" },
    ],
  },
  {
    id: "rtx-4070-super",
    name: "GeForce RTX 4070 SUPER",
    brand: "NVIDIA",
    category: "gpu",
    kind: "gpu",
    generation: "Ada Lovelace (RTX 40)",
    year: 2024,
    tagline: "The 1440p sweet spot of the previous generation, still excellent value.",
    highlights: [
      "12 GB GDDR6X — comfortable at 1440p, tight at 4K",
      "220 W, so it fits small cases and modest power supplies",
      "Very large L2 cache offsets its narrow 192-bit bus",
    ],
    specs: [
      { label: "Shader cores", value: "7,168" },
      { label: "VRAM", value: "12 GB GDDR6X, 192-bit" },
      { label: "Bandwidth", value: "504 GB/s" },
      { label: "Board power", value: "220 W" },
      { label: "Interface", value: "PCIe 4.0 x16" },
      { label: "Outputs", value: "3 × DP 1.4a, 1 × HDMI 2.1" },
    ],
    partNotes: {
      "gpu-die":
        "Ada leans on a huge 48 MB L2 cache. A narrow 192-bit memory bus would normally starve this chip, but most requests never reach VRAM at all — the cache absorbs them, which is how a modest bus still feeds 7,168 shaders.",
    },
  },
  {
    id: "rx-9070-xt",
    name: "Radeon RX 9070 XT",
    brand: "AMD",
    category: "gpu",
    kind: "gpu",
    generation: "RDNA 4",
    year: 2025,
    tagline: "AMD's raster-per-pound champion with a serious ray tracing rebuild.",
    highlights: [
      "16 GB GDDR6 at a mid-range price",
      "Redesigned RT units close much of the gap in path-traced titles",
      "FSR 4 moves upscaling to a machine-learning model",
    ],
    specs: [
      { label: "Compute units", value: "64" },
      { label: "VRAM", value: "16 GB GDDR6, 256-bit" },
      { label: "Bandwidth", value: "645 GB/s" },
      { label: "Board power", value: "304 W" },
      { label: "Interface", value: "PCIe 5.0 x16" },
      { label: "Outputs", value: "2 × DP 2.1a, 2 × HDMI 2.1b" },
    ],
  },
  {
    id: "rx-7900-xtx",
    name: "Radeon RX 7900 XTX",
    brand: "AMD",
    category: "gpu",
    kind: "gpu",
    generation: "RDNA 3",
    year: 2022,
    tagline: "The chiplet GPU: one compute die surrounded by six memory dies.",
    highlights: [
      "24 GB of VRAM — the most memory per pound available for years",
      "Excellent raster, weaker heavy ray tracing than its NVIDIA rival",
      "First consumer GPU to split memory controllers onto separate chiplets",
    ],
    specs: [
      { label: "Compute units", value: "96" },
      { label: "VRAM", value: "24 GB GDDR6, 384-bit" },
      { label: "Bandwidth", value: "960 GB/s" },
      { label: "Board power", value: "355 W" },
      { label: "Interface", value: "PCIe 4.0 x16" },
      { label: "Outputs", value: "2 × DP 2.1, HDMI 2.1, USB-C" },
    ],
    partNotes: {
      "gpu-die":
        "RDNA 3 splits the design: a 5 nm graphics compute die does the shading, while six 6 nm memory cache dies around it hold the controllers and Infinity Cache. Analogue circuits do not shrink, so leaving them on an older node saves real money.",
    },
  },
  {
    id: "arc-b580",
    name: "Arc B580",
    brand: "Intel",
    category: "gpu",
    kind: "gpu",
    generation: "Battlemage",
    year: 2024,
    tagline: "12 GB of VRAM at an entry price — the budget spoiler.",
    highlights: [
      "More memory than similarly priced rivals, which ages well",
      "XeSS 2 upscaling with frame generation",
      "Wants a modern CPU with Resizable BAR enabled",
    ],
    specs: [
      { label: "Xe cores", value: "20" },
      { label: "VRAM", value: "12 GB GDDR6, 192-bit" },
      { label: "Bandwidth", value: "456 GB/s" },
      { label: "Board power", value: "190 W" },
      { label: "Interface", value: "PCIe 4.0 x8" },
      { label: "Outputs", value: "3 × DP 2.1, HDMI 2.1" },
    ],
    partNotes: {
      "pcie-fingers":
        "Only eight lanes are wired. On a PCIe 4.0 board that is plenty, but drop it into an older 3.0 machine and the halved bandwidth becomes measurable — one of the reasons this card's reviews vary so much by test system.",
    },
  },

  // ---------------- Motherboards ----------------
  {
    id: "z890-aorus",
    name: "Z890 flagship board",
    brand: "Intel platform",
    category: "motherboard",
    kind: "motherboard",
    generation: "LGA1851 / Z890",
    year: 2024,
    tagline: "Arrow Lake's home: PCIe 5.0 everywhere and Thunderbolt 4 built in.",
    highlights: [
      "PCIe 5.0 for both the graphics slot and the primary M.2",
      "Native USB4 and Wi-Fi 7 on the chipset",
      "DDR5 only — no DDR4 fallback on this platform",
    ],
    specs: [
      { label: "Socket", value: "LGA1851" },
      { label: "Memory", value: "4 × DDR5-9200 (OC)" },
      { label: "Storage", value: "1 × M.2 5.0 + 3 × M.2 4.0" },
      { label: "Networking", value: "5 GbE + Wi-Fi 7" },
      { label: "VRM", value: "16+1+2, 110 A stages" },
      { label: "Form factor", value: "ATX" },
    ],
  },
  {
    id: "x870e-board",
    name: "X870E flagship board",
    brand: "AMD platform",
    category: "motherboard",
    kind: "motherboard",
    generation: "AM5 / X870E",
    year: 2024,
    tagline: "AM5 with a long upgrade runway and mandatory USB4.",
    highlights: [
      "AMD has committed to AM5 support through 2027 and beyond",
      "Two chipset dies chained together for extra downstream lanes",
      "EXPO memory profiles tuned specifically for Ryzen",
    ],
    specs: [
      { label: "Socket", value: "AM5 (LGA1718)" },
      { label: "Memory", value: "4 × DDR5-8000 (EXPO)" },
      { label: "Storage", value: "2 × M.2 5.0 + 2 × M.2 4.0" },
      { label: "Networking", value: "2.5 GbE + Wi-Fi 7" },
      { label: "VRM", value: "18+2+2, 110 A stages" },
      { label: "Form factor", value: "ATX" },
    ],
    partNotes: {
      chipset:
        "X870E is literally two Promontory 21 dies daisy-chained. The first hangs off the CPU, the second off the first — more ports, but everything on the far die shares one uplink with everything on the near die.",
    },
  },
  {
    id: "b650-itx",
    name: "B650 Mini-ITX board",
    brand: "AMD platform",
    category: "motherboard",
    kind: "motherboard",
    generation: "AM5 / B650",
    year: 2023,
    tagline: "17 × 17 cm of compromise engineering for small builds.",
    highlights: [
      "Only two DIMM slots — which actually helps memory clock higher",
      "One x16 slot and no room for expansion cards",
      "VRM cooling is the real constraint in a tiny case",
    ],
    specs: [
      { label: "Socket", value: "AM5 (LGA1718)" },
      { label: "Memory", value: "2 × DDR5-6400" },
      { label: "Storage", value: "2 × M.2 4.0" },
      { label: "Networking", value: "2.5 GbE + Wi-Fi 6E" },
      { label: "VRM", value: "10+2, 70 A stages" },
      { label: "Form factor", value: "Mini-ITX" },
    ],
    partNotes: {
      dimm: "Two slots is a feature here, not a cut. Shorter traces and no unused stubs mean ITX boards frequently hit higher stable memory speeds than four-slot ATX boards.",
    },
  },

  // ---------------- Memory ----------------
  {
    id: "ddr5-6000-cl30",
    name: "DDR5-6000 CL30 kit",
    brand: "2 × 16 GB",
    category: "ram",
    kind: "ram",
    generation: "DDR5, EXPO / XMP",
    year: 2023,
    tagline: "The tuning sweet spot for both Ryzen and modern Intel.",
    highlights: [
      "6000 MT/s keeps AM5's fabric in its ideal 1:1 ratio",
      "CL30 works out to a genuinely low 10 ns first-word latency",
      "Two sticks, in the far slots, is the configuration that just works",
    ],
    specs: [
      { label: "Capacity", value: "32 GB (2 × 16)" },
      { label: "Speed", value: "6000 MT/s" },
      { label: "Timings", value: "30-36-36-76" },
      { label: "Voltage", value: "1.35 V" },
      { label: "Bandwidth", value: "96 GB/s peak" },
      { label: "Profile", value: "EXPO + XMP 3.0" },
    ],
  },
  {
    id: "ddr5-8000-cl38",
    name: "DDR5-8000 CL38 kit",
    brand: "2 × 24 GB",
    category: "ram",
    kind: "ram",
    generation: "DDR5, XMP 3.0",
    year: 2024,
    tagline: "Raw bandwidth for Intel platforms happy to run a memory divider.",
    highlights: [
      "Non-binary 24 GB dies give 48 GB without dropping speed",
      "Excellent for content creation and simulation bandwidth",
      "Needs a strong memory controller — not every CPU sample will boot it",
    ],
    specs: [
      { label: "Capacity", value: "48 GB (2 × 24)" },
      { label: "Speed", value: "8000 MT/s" },
      { label: "Timings", value: "38-48-48-128" },
      { label: "Voltage", value: "1.45 V" },
      { label: "Bandwidth", value: "128 GB/s peak" },
      { label: "Profile", value: "XMP 3.0" },
    ],
    partNotes: {
      pmic: "High-speed kits ship with an unlocked PMIC so the board can push VDD and VDDQ past JEDEC limits. Locked PMICs are the reason some cheaper kits refuse to overclock at all.",
    },
  },

  // ---------------- Storage ----------------
  {
    id: "pcie5-nvme-2tb",
    name: "PCIe 5.0 NVMe SSD, 2 TB",
    brand: "Gen5 flagship",
    category: "storage",
    kind: "ssd",
    generation: "PCIe 5.0 x4, TLC",
    year: 2024,
    tagline: "14 GB/s sequential — and a heatsink that is not optional.",
    highlights: [
      "Around 14,000 MB/s read, 12,000 MB/s write",
      "Throttles within seconds without proper cooling",
      "Random performance, not sequential, is what you actually feel",
    ],
    specs: [
      { label: "Interface", value: "PCIe 5.0 x4, NVMe 2.0" },
      { label: "Sequential read", value: "14,000 MB/s" },
      { label: "Random read", value: "1.5M IOPS" },
      { label: "NAND", value: "232-layer 3D TLC" },
      { label: "Endurance", value: "1,200 TBW" },
      { label: "Form factor", value: "M.2 2280" },
    ],
  },
  {
    id: "pcie4-nvme-2tb",
    name: "PCIe 4.0 NVMe SSD, 2 TB",
    brand: "Gen4 workhorse",
    category: "storage",
    kind: "ssd",
    generation: "PCIe 4.0 x4, TLC + DRAM",
    year: 2022,
    tagline: "The drive most people should actually buy.",
    highlights: [
      "7,000 MB/s is already far beyond what games can consume",
      "Runs cool enough for laptops and a PS5 bay",
      "A DRAM cache keeps random reads strong when the drive fills up",
    ],
    specs: [
      { label: "Interface", value: "PCIe 4.0 x4, NVMe 1.4" },
      { label: "Sequential read", value: "7,300 MB/s" },
      { label: "Random read", value: "1.0M IOPS" },
      { label: "NAND", value: "176-layer 3D TLC" },
      { label: "Endurance", value: "1,200 TBW" },
      { label: "Form factor", value: "M.2 2280" },
    ],
  },
  {
    id: "dramless-qlc-4tb",
    name: "DRAM-less QLC SSD, 4 TB",
    brand: "Capacity pick",
    category: "storage",
    kind: "ssd",
    generation: "PCIe 4.0 x4, QLC + HMB",
    year: 2023,
    tagline: "Cheap terabytes — with a catch you should understand first.",
    highlights: [
      "Great for a game library, poor as a scratch or boot drive",
      "Writes collapse once the pseudo-SLC cache is exhausted",
      "Borrows system RAM instead of carrying its own DRAM",
    ],
    specs: [
      { label: "Interface", value: "PCIe 4.0 x4, HMB" },
      { label: "Sequential read", value: "5,000 MB/s" },
      { label: "Sustained write", value: "~900 MB/s after cache" },
      { label: "NAND", value: "3D QLC" },
      { label: "Endurance", value: "600 TBW" },
      { label: "Form factor", value: "M.2 2280" },
    ],
    partNotes: {
      "dram-cache":
        "There isn't one. The mapping table lives in flash with a slice cached in system RAM over the Host Memory Buffer. Sequential numbers stay respectable; random reads under load are where you notice the missing chip.",
    },
  },
];

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function partsFor(product: Product): HwPart[] {
  return kindParts[product.kind].map((p) => ({
    ...p,
    detail: product.partNotes?.[p.id]
      ? `${product.partNotes[p.id]}\n\n${p.detail}`
      : p.detail,
  }));
}

export const productCategories = [
  { id: "cpu", label: "CPUs" },
  { id: "gpu", label: "GPUs & graphics cards" },
  { id: "motherboard", label: "Motherboards" },
  { id: "ram", label: "Memory" },
  { id: "storage", label: "Storage" },
] as const;
