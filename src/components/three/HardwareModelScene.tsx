import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, Html } from "@react-three/drei";
import { Suspense, createContext, useContext, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import type { ModelKind } from "@/data/hardware";

type Props = {
  kind: ModelKind;
  productId?: string;
  selected: string | null;
  onSelect: (id: string) => void;
  exploded?: boolean;
  spin?: boolean;
};

const ViewerCtx = createContext({ exploded: false });

const ACCENT = "#22d3ee";


/* ------------------------------------------------------------------ */
/* Clickable part wrapper                                              */
/* ------------------------------------------------------------------ */

function Part({
  id,
  label,
  selected,
  onSelect,
  children,
}: {
  id: string;
  label: string;
  selected: string | null;
  onSelect: (id: string) => void;
  children: (state: { active: boolean; hovered: boolean }) => ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  const group = useRef<THREE.Group>(null);
  const active = selected === id;
  const { exploded } = useContext(ViewerCtx);
  const home = useRef<THREE.Vector3 | null>(null);
  const dir = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!group.current) return;
    const g = group.current;
    const target = active ? 1.06 : hovered ? 1.03 : 1;
    const k = 1 - Math.exp(-12 * Math.min(delta, 0.05));
    g.scale.lerp(new THREE.Vector3(target, target, target), k);

    if (!home.current) {
      home.current = g.position.clone();
      const box = new THREE.Box3().setFromObject(g);
      const c = box.getCenter(new THREE.Vector3());
      dir.current.copy(c.lengthSq() < 0.0001 ? new THREE.Vector3(0, 1, 0) : c.normalize());
    }
    const goal = exploded
      ? home.current.clone().add(dir.current.clone().multiplyScalar(1.6))
      : home.current;
    g.position.lerp(goal, k * 0.6);
  });

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {children({ active, hovered })}
      {(active || hovered) && (
        <Html center distanceFactor={9} zIndexRange={[10, 0]}>
          <div className="pointer-events-none whitespace-nowrap rounded-md border border-cyan-400/40 bg-black/80 px-2 py-1 text-[11px] font-medium text-cyan-200 backdrop-blur">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

function mat(base: string, state: { active: boolean; hovered: boolean }, opts?: { metal?: number; rough?: number }) {
  return (
    <meshStandardMaterial
      color={base}
      metalness={opts?.metal ?? 0.6}
      roughness={opts?.rough ?? 0.35}
      emissive={state.active ? ACCENT : state.hovered ? "#0e7490" : "#000000"}
      emissiveIntensity={state.active ? 0.55 : state.hovered ? 0.3 : 0}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Models                                                              */
/* ------------------------------------------------------------------ */

function CpuModel(p: Omit<Props, "kind">) {
  return (
    <group rotation={[0.15, 0.5, 0]}>
      <Part id="substrate" label="Organic substrate" {...p}>
        {(s) => (
          <mesh castShadow receiveShadow position={[0, -0.16, 0]}>
            <boxGeometry args={[3.4, 0.16, 3.4]} />
            {mat("#0f5132", s, { metal: 0.2, rough: 0.7 })}
          </mesh>
        )}
      </Part>

      <Part id="ihs" label="Integrated heat spreader" {...p}>
        {(s) => (
          <group position={[0, 0.16, 0]}>
            <mesh castShadow>
              <boxGeometry args={[2.6, 0.24, 2.6]} />
              {mat("#c9d1d9", s, { metal: 0.95, rough: 0.22 })}
            </mesh>
            <mesh position={[0, 0.02, 1.5]}>
              <boxGeometry args={[1.2, 0.16, 0.4]} />
              {mat("#c9d1d9", s, { metal: 0.95, rough: 0.22 })}
            </mesh>
            <mesh position={[0, 0.02, -1.5]}>
              <boxGeometry args={[1.2, 0.16, 0.4]} />
              {mat("#c9d1d9", s, { metal: 0.95, rough: 0.22 })}
            </mesh>
          </group>
        )}
      </Part>

      {/* dies shown floating above, as an exploded view */}
      <Part id="compute-die" label="Compute die / core tile" {...p}>
        {(s) => (
          <mesh castShadow position={[-0.6, 0.95, 0]}>
            <boxGeometry args={[1.2, 0.12, 1.6]} />
            {mat("#1f2937", s, { metal: 0.4, rough: 0.3 })}
          </mesh>
        )}
      </Part>

      <Part id="cache" label="Cache slices" {...p}>
        {(s) => (
          <mesh castShadow position={[0.55, 0.95, 0.45]}>
            <boxGeometry args={[0.7, 0.12, 0.7]} />
            {mat("#7c3aed", s, { metal: 0.4, rough: 0.3 })}
          </mesh>
        )}
      </Part>

      <Part id="io-die" label="I/O die & memory controller" {...p}>
        {(s) => (
          <mesh castShadow position={[0.55, 0.95, -0.5]}>
            <boxGeometry args={[0.9, 0.12, 0.6]} />
            {mat("#0ea5e9", s, { metal: 0.4, rough: 0.35 })}
          </mesh>
        )}
      </Part>

      <Part id="pads" label="Land grid contacts" {...p}>
        {(s) => (
          <group position={[0, -0.27, 0]}>
            <mesh receiveShadow>
              <boxGeometry args={[3.2, 0.06, 3.2]} />
              {mat("#b08d3f", s, { metal: 1, rough: 0.3 })}
            </mesh>
          </group>
        )}
      </Part>
    </group>
  );
}

function GpuModel(p: Omit<Props, "kind">) {
  return (
    <group rotation={[0.35, -0.55, 0]} position={[0, 0.2, 0]}>
      <Part id="cooler" label="Heatsink & vapour chamber" {...p}>
        {(s) => (
          <group>
            <mesh castShadow position={[0, 0.5, 0]}>
              <boxGeometry args={[6.4, 1.1, 2.6]} />
              {mat("#111827", s, { metal: 0.7, rough: 0.4 })}
            </mesh>
            {Array.from({ length: 14 }).map((_, i) => (
              <mesh key={i} position={[-2.9 + i * 0.44, 0.5, -1.35]}>
                <boxGeometry args={[0.06, 0.9, 0.1]} />
                {mat("#334155", s, { metal: 0.9, rough: 0.3 })}
              </mesh>
            ))}
          </group>
        )}
      </Part>

      <Part id="fans" label="Axial fans" {...p}>
        {(s) => (
          <group position={[0, 1.08, 0]}>
            {[-1.7, 1.7].map((x) => (
              <Fan key={x} x={x} state={s} />
            ))}
          </group>
        )}
      </Part>

      <Part id="gpu-die" label="GPU die" {...p}>
        {(s) => (
          <mesh castShadow position={[0, -0.18, 0]}>
            <boxGeometry args={[1.3, 0.16, 1.3]} />
            {mat("#0f172a", s, { metal: 0.5, rough: 0.25 })}
          </mesh>
        )}
      </Part>

      <Part id="vram" label="VRAM packages" {...p}>
        {(s) => (
          <group position={[0, -0.18, 0]}>
            {[
              [-1.2, 0.9],
              [-1.2, -0.9],
              [1.2, 0.9],
              [1.2, -0.9],
              [0, 1.0],
              [0, -1.0],
            ].map((pos, i) => (
              <mesh key={i} position={[pos[0]!, 0, pos[1]!]} castShadow>
                <boxGeometry args={[0.5, 0.12, 0.4]} />
                {mat("#1e293b", s, { metal: 0.4, rough: 0.4 })}
              </mesh>
            ))}
          </group>
        )}
      </Part>

      <Part id="vrm" label="Power delivery (VRM)" {...p}>
        {(s) => (
          <group position={[2.3, -0.12, 0]}>
            {Array.from({ length: 6 }).map((_, i) => (
              <mesh key={i} position={[0, 0, -1 + i * 0.4]} castShadow>
                <boxGeometry args={[0.6, 0.2, 0.28]} />
                {mat("#475569", s, { metal: 0.8, rough: 0.3 })}
              </mesh>
            ))}
          </group>
        )}
      </Part>

      <Part id="power-connector" label="12V-2x6 power connector" {...p}>
        {(s) => (
          <mesh castShadow position={[1.4, 1.15, 0.9]}>
            <boxGeometry args={[0.9, 0.3, 0.4]} />
            {mat("#0b1220", s, { metal: 0.3, rough: 0.6 })}
          </mesh>
        )}
      </Part>

      <Part id="pcie-fingers" label="PCIe edge connector" {...p}>
        {(s) => (
          <mesh castShadow position={[-1.0, -0.62, 0]}>
            <boxGeometry args={[3.2, 0.22, 0.16]} />
            {mat("#c9a227", s, { metal: 1, rough: 0.25 })}
          </mesh>
        )}
      </Part>

      <Part id="outputs" label="Display outputs" {...p}>
        {(s) => (
          <group position={[-3.35, 0.35, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.16, 1.9, 2.5]} />
              {mat("#94a3b8", s, { metal: 0.95, rough: 0.3 })}
            </mesh>
            {[-0.8, -0.2, 0.4, 1.0].map((z) => (
              <mesh key={z} position={[-0.12, 0.1, z]}>
                <boxGeometry args={[0.1, 0.3, 0.5]} />
                {mat("#0f172a", s, { metal: 0.2, rough: 0.8 })}
              </mesh>
            ))}
          </group>
        )}
      </Part>

      {/* PCB */}
      <mesh position={[0, -0.32, 0]} receiveShadow>
        <boxGeometry args={[6.2, 0.14, 2.4]} />
        <meshStandardMaterial color="#052e2b" metalness={0.2} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Fan({ x, state }: { x: number; state: { active: boolean; hovered: boolean } }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += Math.min(delta, 0.05) * 6;
  });
  return (
    <group position={[x, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[1.05, 1.05, 0.1, 32, 1, true]} />
        <meshStandardMaterial
          color="#1f2937"
          side={THREE.DoubleSide}
          emissive={state.active ? ACCENT : "#000"}
          emissiveIntensity={state.active ? 0.4 : 0}
        />
      </mesh>
      <group ref={ref}>
        {Array.from({ length: 9 }).map((_, i) => (
          <mesh key={i} rotation={[0, (i / 9) * Math.PI * 2, 0.28]} position={[0, 0, 0]}>
            <boxGeometry args={[0.95, 0.03, 0.28]} />
            <meshStandardMaterial
              color="#334155"
              emissive={state.active ? ACCENT : state.hovered ? "#0e7490" : "#000"}
              emissiveIntensity={state.active ? 0.5 : state.hovered ? 0.25 : 0}
            />
          </mesh>
        ))}
        <mesh>
          <cylinderGeometry args={[0.28, 0.28, 0.14, 24]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

function MotherboardModel(p: Omit<Props, "kind">) {
  return (
    <group rotation={[0.9, 0, 0.35]} position={[0, 0, 0]}>
      <mesh receiveShadow position={[0, -0.1, 0]}>
        <boxGeometry args={[6, 0.16, 6]} />
        <meshStandardMaterial color="#0b1f1c" metalness={0.25} roughness={0.8} />
      </mesh>

      <Part id="socket" label="CPU socket" {...p}>
        {(s) => (
          <mesh castShadow position={[-0.6, 0.08, -1.2]}>
            <boxGeometry args={[2, 0.2, 2]} />
            {mat("#1f2937", s, { metal: 0.6, rough: 0.4 })}
          </mesh>
        )}
      </Part>

      <Part id="vrm" label="VRM & heatsinks" {...p}>
        {(s) => (
          <group>
            <mesh castShadow position={[-0.6, 0.25, -2.5]}>
              <boxGeometry args={[2.4, 0.55, 0.7]} />
              {mat("#374151", s, { metal: 0.9, rough: 0.3 })}
            </mesh>
            <mesh castShadow position={[-2.3, 0.25, -1.2]}>
              <boxGeometry args={[0.7, 0.55, 2]} />
              {mat("#374151", s, { metal: 0.9, rough: 0.3 })}
            </mesh>
          </group>
        )}
      </Part>

      <Part id="dimm" label="DIMM slots" {...p}>
        {(s) => (
          <group position={[1.7, 0.16, -1.2]}>
            {[-0.45, -0.15, 0.15, 0.45].map((x, i) => (
              <mesh key={i} position={[x, 0, 0]} castShadow>
                <boxGeometry args={[0.16, 0.3, 2.6]} />
                {mat(i % 2 === 0 ? "#0e7490" : "#1e293b", s, { metal: 0.4, rough: 0.5 })}
              </mesh>
            ))}
          </group>
        )}
      </Part>

      <Part id="pcie" label="PCIe slots" {...p}>
        {(s) => (
          <group position={[-0.4, 0.14, 1.5]}>
            {[0, 0.9].map((z, i) => (
              <mesh key={i} position={[0, 0, z]} castShadow>
                <boxGeometry args={[3.4, 0.26, 0.24]} />
                {mat(i === 0 ? "#4c1d95" : "#1e293b", s, { metal: 0.5, rough: 0.45 })}
              </mesh>
            ))}
          </group>
        )}
      </Part>

      <Part id="chipset" label="Chipset" {...p}>
        {(s) => (
          <mesh castShadow position={[1.9, 0.2, 2.1]}>
            <boxGeometry args={[1.3, 0.4, 1.3]} />
            {mat("#334155", s, { metal: 0.85, rough: 0.3 })}
          </mesh>
        )}
      </Part>

      <Part id="m2" label="M.2 slots" {...p}>
        {(s) => (
          <group>
            {[0.55, 2.0].map((z, i) => (
              <mesh key={i} castShadow position={[-0.4, 0.12, z + (i === 0 ? -1.4 : 0.4)]}>
                <boxGeometry args={[2.6, 0.18, 0.4]} />
                {mat("#64748b", s, { metal: 0.9, rough: 0.3 })}
              </mesh>
            ))}
          </group>
        )}
      </Part>

      <Part id="atx-power" label="ATX power headers" {...p}>
        {(s) => (
          <mesh castShadow position={[2.6, 0.2, -0.2]}>
            <boxGeometry args={[0.5, 0.4, 1.4]} />
            {mat("#0b1220", s, { metal: 0.3, rough: 0.7 })}
          </mesh>
        )}
      </Part>

      <Part id="rear-io" label="Rear I/O" {...p}>
        {(s) => (
          <mesh castShadow position={[-2.6, 0.35, -3.0]}>
            <boxGeometry args={[2.6, 0.8, 0.3]} />
            {mat("#94a3b8", s, { metal: 0.95, rough: 0.25 })}
          </mesh>
        )}
      </Part>
    </group>
  );
}

function RamModel(p: Omit<Props, "kind">) {
  return (
    <group rotation={[0.2, -0.35, 0]}>
      <Part id="heatspreader" label="Heat spreader" {...p}>
        {(s) => (
          <group>
            {[-0.16, 0.16].map((z) => (
              <mesh key={z} castShadow position={[0, 0.4, z]}>
                <boxGeometry args={[5.4, 1.9, 0.08]} />
                {mat("#111827", s, { metal: 0.9, rough: 0.35 })}
              </mesh>
            ))}
            <mesh position={[0, 1.4, 0]}>
              <boxGeometry args={[5.4, 0.18, 0.4]} />
              {mat("#22d3ee", s, { metal: 0.2, rough: 0.5 })}
            </mesh>
          </group>
        )}
      </Part>

      {/* PCB */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[5.6, 2.2, 0.1]} />
        <meshStandardMaterial color="#052e2b" metalness={0.2} roughness={0.8} />
      </mesh>

      <Part id="dram" label="DRAM chips" {...p}>
        {(s) => (
          <group position={[0, 0.2, 0.09]}>
            {[-2.0, -1.0, 0, 1.0, 2.0].map((x) => (
              <mesh key={x} position={[x, 0, 0]} castShadow>
                <boxGeometry args={[0.75, 0.9, 0.1]} />
                {mat("#1e293b", s, { metal: 0.4, rough: 0.5 })}
              </mesh>
            ))}
          </group>
        )}
      </Part>

      <Part id="pmic" label="Power management IC" {...p}>
        {(s) => (
          <mesh castShadow position={[2.35, -0.5, 0.09]}>
            <boxGeometry args={[0.45, 0.45, 0.12]} />
            {mat("#7c3aed", s, { metal: 0.5, rough: 0.4 })}
          </mesh>
        )}
      </Part>

      <Part id="spd" label="SPD hub / XMP profile chip" {...p}>
        {(s) => (
          <mesh castShadow position={[-2.35, -0.5, 0.09]}>
            <boxGeometry args={[0.4, 0.4, 0.12]} />
            {mat("#0ea5e9", s, { metal: 0.5, rough: 0.4 })}
          </mesh>
        )}
      </Part>

      <Part id="fingers" label="Edge contacts" {...p}>
        {(s) => (
          <group position={[0, -1.0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[5.6, 0.34, 0.12]} />
              {mat("#c9a227", s, { metal: 1, rough: 0.25 })}
            </mesh>
            <mesh position={[0.6, 0, 0.07]}>
              <boxGeometry args={[0.12, 0.36, 0.06]} />
              {mat("#052e2b", s, { metal: 0.2, rough: 0.9 })}
            </mesh>
          </group>
        )}
      </Part>
    </group>
  );
}

function SsdModel(p: Omit<Props, "kind">) {
  return (
    <group rotation={[0.65, -0.2, 0]}>
      <mesh position={[0, -0.06, 0]} receiveShadow>
        <boxGeometry args={[6.4, 0.1, 1.6]} />
        <meshStandardMaterial color="#052e2b" metalness={0.2} roughness={0.8} />
      </mesh>

      <Part id="controller" label="SSD controller" {...p}>
        {(s) => (
          <mesh castShadow position={[1.6, 0.1, 0]}>
            <boxGeometry args={[0.9, 0.18, 0.9]} />
            {mat("#1f2937", s, { metal: 0.6, rough: 0.35 })}
          </mesh>
        )}
      </Part>

      <Part id="nand" label="NAND flash packages" {...p}>
        {(s) => (
          <group position={[-0.9, 0.1, 0]}>
            {[-1.2, 0.1].map((x) => (
              <mesh key={x} position={[x, 0, 0]} castShadow>
                <boxGeometry args={[1.0, 0.18, 1.1]} />
                {mat("#111827", s, { metal: 0.4, rough: 0.5 })}
              </mesh>
            ))}
          </group>
        )}
      </Part>

      <Part id="dram-cache" label="DRAM cache" {...p}>
        {(s) => (
          <mesh castShadow position={[0.6, 0.1, 0]}>
            <boxGeometry args={[0.6, 0.16, 0.8]} />
            {mat("#0ea5e9", s, { metal: 0.5, rough: 0.4 })}
          </mesh>
        )}
      </Part>

      <Part id="m2-key" label="M.2 key & edge connector" {...p}>
        {(s) => (
          <group position={[3.0, 0.02, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.5, 0.12, 1.4]} />
              {mat("#c9a227", s, { metal: 1, rough: 0.25 })}
            </mesh>
            <mesh position={[0, 0.05, 0.35]}>
              <boxGeometry args={[0.52, 0.14, 0.1]} />
              {mat("#052e2b", s, { metal: 0.2, rough: 0.9 })}
            </mesh>
          </group>
        )}
      </Part>

      <Part id="label" label="Product label / heatsink" {...p}>
        {(s) => (
          <mesh castShadow position={[-1.4, 0.28, 0]}>
            <boxGeometry args={[3.4, 0.1, 1.4]} />
            {mat("#e2e8f0", s, { metal: 0.1, rough: 0.7 })}
          </mesh>
        )}
      </Part>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Product-sculpted models                                             */
/* ------------------------------------------------------------------ */

/** RTX 5090 Founders Edition — slim dual flow-through shroud with the
 *  signature silver X-frame crossing the face of the card. */
function Rtx5090Model(p: Omit<Props, "kind" | "productId">) {
  return (
    <group rotation={[0.35, -0.55, 0]} position={[0, 0.2, 0]}>
      <Part id="cooler" label="Flow-through heatsink & vapour chamber" {...p}>
        {(s) => (
          <group>
            {/* slim 2-slot body */}
            <mesh castShadow position={[0, 0.4, 0]}>
              <boxGeometry args={[6.6, 0.85, 2.7]} />
              {mat("#0b0f16", s, { metal: 0.8, rough: 0.35 })}
            </mesh>
            {/* silver X-frame trim — the 5090 FE signature */}
            {[Math.PI / 4.6, -Math.PI / 4.6].map((r, i) => (
              <mesh key={i} position={[0, 0.86, 0]} rotation={[0, r, 0]}>
                <boxGeometry args={[7.0, 0.08, 0.5]} />
                {mat("#c7ccd4", s, { metal: 1, rough: 0.18 })}
              </mesh>
            ))}
            {/* fin stack visible at both ends (flow-through) */}
            {Array.from({ length: 10 }).map((_, i) => (
              <mesh key={i} position={[-3.1 + i * 0.16, 0.4, 0]}>
                <boxGeometry args={[0.05, 0.7, 2.5]} />
                {mat("#334155", s, { metal: 0.9, rough: 0.3 })}
              </mesh>
            ))}
          </group>
        )}
      </Part>

      <Part id="fans" label="Dual axial flow-through fans" {...p}>
        {(s) => (
          <group position={[0, 0.92, 0]}>
            {[-1.85, 1.85].map((x) => (
              <Fan key={x} x={x} state={s} />
            ))}
          </group>
        )}
      </Part>

      <Part id="gpu-die" label="GB202 GPU die" {...p}>
        {(s) => (
          <mesh castShadow position={[0, -0.22, 0]}>
            <boxGeometry args={[1.5, 0.16, 1.5]} />
            {mat("#0f172a", s, { metal: 0.5, rough: 0.25 })}
          </mesh>
        )}
      </Part>

      <Part id="vram" label="GDDR7 memory packages" {...p}>
        {(s) => (
          <group position={[0, -0.22, 0]}>
            {[
              [-1.4, 0.95], [-1.4, -0.95], [1.4, 0.95], [1.4, -0.95],
              [-0.5, 1.15], [0.5, 1.15], [-0.5, -1.15], [0.5, -1.15],
            ].map((pos, i) => (
              <mesh key={i} position={[pos[0]!, 0, pos[1]!]} castShadow>
                <boxGeometry args={[0.5, 0.12, 0.4]} />
                {mat("#1e293b", s, { metal: 0.4, rough: 0.4 })}
              </mesh>
            ))}
          </group>
        )}
      </Part>

      <Part id="vrm" label="Power delivery (VRM)" {...p}>
        {(s) => (
          <group position={[2.4, -0.16, 0]}>
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh key={i} position={[0, 0, -1.1 + i * 0.32]} castShadow>
                <boxGeometry args={[0.6, 0.2, 0.24]} />
                {mat("#475569", s, { metal: 0.8, rough: 0.3 })}
              </mesh>
            ))}
          </group>
        )}
      </Part>

      <Part id="power-connector" label="12V-2x6 power connector" {...p}>
        {(s) => (
          <mesh castShadow position={[1.6, 0.95, 1.0]} rotation={[0, 0.35, 0]}>
            <boxGeometry args={[0.9, 0.3, 0.4]} />
            {mat("#0b1220", s, { metal: 0.3, rough: 0.6 })}
          </mesh>
        )}
      </Part>

      <Part id="pcie-fingers" label="PCIe 5.0 edge connector" {...p}>
        {(s) => (
          <mesh castShadow position={[-1.0, -0.66, 0]}>
            <boxGeometry args={[3.2, 0.22, 0.16]} />
            {mat("#c9a227", s, { metal: 1, rough: 0.25 })}
          </mesh>
        )}
      </Part>

      <Part id="outputs" label="Display outputs" {...p}>
        {(s) => (
          <group position={[-3.45, 0.25, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.16, 1.6, 2.5]} />
              {mat("#94a3b8", s, { metal: 0.95, rough: 0.3 })}
            </mesh>
            {[-0.8, -0.2, 0.4, 1.0].map((z) => (
              <mesh key={z} position={[-0.12, 0.05, z]}>
                <boxGeometry args={[0.1, 0.3, 0.5]} />
                {mat("#0f172a", s, { metal: 0.2, rough: 0.8 })}
              </mesh>
            ))}
          </group>
        )}
      </Part>

      <mesh position={[0, -0.36, 0]} receiveShadow>
        <boxGeometry args={[6.4, 0.14, 2.5]} />
        <meshStandardMaterial color="#0a0f14" metalness={0.3} roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Ryzen 9 9950X — AM5 package with the distinctive octagonal "starfish"
 *  heat spreader and two core complex dies beside the I/O die. */
function Ryzen9950xModel(p: Omit<Props, "kind" | "productId">) {
  return (
    <group rotation={[0.15, 0.5, 0]}>
      <Part id="substrate" label="Organic substrate" {...p}>
        {(s) => (
          <mesh castShadow receiveShadow position={[0, -0.16, 0]}>
            <boxGeometry args={[3.4, 0.16, 3.4]} />
            {mat("#0f5132", s, { metal: 0.2, rough: 0.7 })}
          </mesh>
        )}
      </Part>

      <Part id="ihs" label="Octagonal heat spreader" {...p}>
        {(s) => (
          <group position={[0, 0.16, 0]}>
            {/* AM5 "starfish" IHS: centre plate + 8 arms */}
            <mesh castShadow>
              <boxGeometry args={[2.4, 0.24, 2.4]} />
              {mat("#c9d1d9", s, { metal: 0.95, rough: 0.22 })}
            </mesh>
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
              return (
                <mesh
                  key={i}
                  position={[Math.cos(a) * 1.45, 0, Math.sin(a) * 1.45]}
                  rotation={[0, -a, 0]}
                >
                  <boxGeometry args={[0.75, 0.22, 0.55]} />
                  {mat("#c9d1d9", s, { metal: 0.95, rough: 0.22 })}
                </mesh>
              );
            })}
          </group>
        )}
      </Part>

      {/* 9950X has TWO core complex dies (CCDs) */}
      <Part id="compute-die" label="Core complex dies (2× CCD)" {...p}>
        {(s) => (
          <group position={[-0.35, 0.95, 0]}>
            <mesh castShadow position={[0, 0, -0.55]}>
              <boxGeometry args={[1.0, 0.12, 0.85]} />
              {mat("#1f2937", s, { metal: 0.4, rough: 0.3 })}
            </mesh>
            <mesh castShadow position={[0, 0, 0.55]}>
              <boxGeometry args={[1.0, 0.12, 0.85]} />
              {mat("#1f2937", s, { metal: 0.4, rough: 0.3 })}
            </mesh>
          </group>
        )}
      </Part>

      <Part id="cache" label="L3 cache (64 MB)" {...p}>
        {(s) => (
          <mesh castShadow position={[0.75, 0.95, 0.55]}>
            <boxGeometry args={[0.6, 0.12, 0.6]} />
            {mat("#f97316", s, { metal: 0.4, rough: 0.3 })}
          </mesh>
        )}
      </Part>

      <Part id="io-die" label="I/O die (cIOD)" {...p}>
        {(s) => (
          <mesh castShadow position={[0.75, 0.95, -0.5]}>
            <boxGeometry args={[0.9, 0.12, 0.7]} />
            {mat("#0ea5e9", s, { metal: 0.4, rough: 0.35 })}
          </mesh>
        )}
      </Part>

      <Part id="pads" label="AM5 land grid contacts" {...p}>
        {(s) => (
          <group position={[0, -0.27, 0]}>
            <mesh receiveShadow>
              <boxGeometry args={[3.2, 0.06, 3.2]} />
              {mat("#b08d3f", s, { metal: 1, rough: 0.3 })}
            </mesh>
          </group>
        )}
      </Part>
    </group>
  );
}

/* ------------------------------------------------------------------ */

function Rig({ kind, productId, selected, onSelect, spin = true }: Props) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current) return;
    const t = Math.min(delta, 0.05);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
    if (spin) group.current.rotation.y += t * 0.12;
  });


  const inner = { selected, onSelect };
  return (
    <group ref={group}>
      {kind === "cpu" && <CpuModel {...inner} />}
      {kind === "gpu" && <GpuModel {...inner} />}
      {kind === "motherboard" && <MotherboardModel {...inner} />}
      {kind === "ram" && <RamModel {...inner} />}
      {kind === "ssd" && <SsdModel {...inner} />}
    </group>
  );
}

export default function HardwareModelScene({
  kind,
  selected,
  onSelect,
  exploded = false,
  spin = true,
}: Props) {
  const distance = kind === "cpu" ? 9 : kind === "ssd" ? 11 : 12;
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 4.5, distance], fov: 45 }}
      className="rounded-2xl"
    >
      <color attach="background" args={["#05070d"]} />
      <fog attach="fog" args={["#05070d", 18, 40]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-8, 3, -4]} intensity={40} color="#7c3aed" />
      <pointLight position={[8, 2, 4]} intensity={30} color="#22d3ee" />
      <Suspense fallback={null}>
        <ViewerCtx.Provider value={{ exploded }}>
          <Rig kind={kind} selected={selected} onSelect={onSelect} spin={spin} />
        </ViewerCtx.Provider>
        <Environment>
          <Lightformer intensity={2} position={[0, 6, 0]} scale={[12, 12, 1]} />
          <Lightformer
            intensity={1.2}
            color="#67e8f9"
            position={[-6, 2, -2]}
            rotation-y={Math.PI / 2}
            scale={[20, 2, 1]}
          />
          <Lightformer
            intensity={1}
            color="#a78bfa"
            position={[6, 2, 2]}
            rotation-y={-Math.PI / 2}
            scale={[20, 2, 1]}
          />
        </Environment>
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}
