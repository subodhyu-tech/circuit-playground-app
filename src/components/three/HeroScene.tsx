import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Float } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const CYAN = "#4fd8e8";
const VIOLET = "#a879ff";
const EMERALD = "#48e0a8";
const AMBER = "#ffc65c";

function Die({ hovered }: { hovered: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    const dt = Math.min(delta, 0.05);
    const target = hovered ? 0.55 : 0.25;
    ref.current.rotation.y += dt * target;
    ref.current.position.y =
      0.35 + Math.sin(state.clock.elapsedTime * 1.2) * 0.05;
  });

  const pads = useMemo(() => {
    const out: [number, number][] = [];
    const n = 9;
    for (let i = 0; i < n; i++) {
      const t = -1.05 + (i / (n - 1)) * 2.1;
      out.push([t, 1.22], [t, -1.22], [1.22, t] as never, [-1.22, t] as never);
    }
    return out;
  }, []);

  return (
    <group ref={ref}>
      {/* substrate */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[2.9, 0.16, 2.9]} />
        <meshStandardMaterial color="#12161f" roughness={0.55} metalness={0.4} />
      </mesh>
      {/* die */}
      <mesh castShadow position={[0, 0.14, 0]}>
        <boxGeometry args={[1.9, 0.13, 1.9]} />
        <meshStandardMaterial
          color="#1d2635"
          roughness={0.22}
          metalness={0.9}
          emissive={CYAN}
          emissiveIntensity={hovered ? 0.35 : 0.16}
        />
      </mesh>
      {/* etched core grid */}
      {Array.from({ length: 16 }).map((_, i) => {
        const x = (i % 4) - 1.5;
        const z = Math.floor(i / 4) - 1.5;
        return (
          <mesh key={i} position={[x * 0.42, 0.215, z * 0.42]}>
            <boxGeometry args={[0.3, 0.03, 0.3]} />
            <meshStandardMaterial
              color="#0d1119"
              emissive={i % 5 === 0 ? VIOLET : CYAN}
              emissiveIntensity={i % 3 === 0 ? 1.4 : 0.5}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>
        );
      })}
      {/* pads */}
      {pads.map((p, i) => (
        <mesh key={`p${i}`} position={[p[0] * 1.25, 0.02, p[1] * 1.25]}>
          <boxGeometry args={[0.11, 0.06, 0.11]} />
          <meshStandardMaterial color={AMBER} metalness={1} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function OrbitRing({
  radius,
  color,
  speed,
  tilt,
  count,
}: {
  radius: number;
  color: string;
  speed: number;
  tilt: number;
  count: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += Math.min(delta, 0.05) * speed;
  });
  return (
    <group ref={ref} rotation={[tilt, 0, tilt / 2]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.012, 8, 128]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.6}
          roughness={0.4}
        />
      </mesh>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * radius, 0, Math.sin(a) * radius]}
            rotation={[0, -a, 0]}
            castShadow
          >
            <boxGeometry args={[0.5, 0.1, 0.24]} />
            <meshStandardMaterial
              color="#1a2130"
              emissive={color}
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Traces() {
  const lines = useMemo(() => {
    const items: { pos: [number, number, number]; len: number; rot: number; c: string }[] = [];
    const colors = [CYAN, VIOLET, EMERALD, AMBER];
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      const r = 2.6 + (i % 5) * 0.45;
      items.push({
        pos: [Math.cos(a) * r, -0.62, Math.sin(a) * r],
        len: 0.7 + (i % 4) * 0.35,
        rot: -a,
        c: colors[i % colors.length] as string,
      });
    }
    return items;
  }, []);

  return (
    <group>
      {lines.map((l, i) => (
        <mesh key={i} position={l.pos} rotation={[0, l.rot, 0]}>
          <boxGeometry args={[l.len, 0.008, 0.03]} />
          <meshStandardMaterial color={l.c} emissive={l.c} emissiveIntensity={1.2} />
        </mesh>
      ))}
    </group>
  );
}

function Board() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.65, 0]} receiveShadow>
      <circleGeometry args={[7.5, 64]} />
      <meshStandardMaterial color="#0c1017" roughness={0.85} metalness={0.25} />
    </mesh>
  );
}

function Rig({ hovered }: { hovered: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    group.current.rotation.y += (x * 0.35 - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (-y * 0.15 + 0.05 - group.current.rotation.x) * 0.04;
  });
  return (
    <group ref={group}>
      <Board />
      <Traces />
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
        <Die hovered={hovered} />
      </Float>
      <OrbitRing radius={2.5} color={CYAN} speed={0.3} tilt={0.12} count={5} />
      <OrbitRing radius={3.4} color={VIOLET} speed={-0.22} tilt={-0.24} count={7} />
      <OrbitRing radius={4.3} color={EMERALD} speed={0.16} tilt={0.3} count={9} />
    </group>
  );
}

export default function HeroScene() {
  const [hovered, setHovered] = useState(false);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 3.6, 8.2], fov: 45 }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <color attach="background" args={["#0b0e14"]} />
      <fog attach="fog" args={["#0b0e14", 9, 22]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[6, 9, 5]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, 2, -4]} intensity={40} color={VIOLET} distance={18} />
      <pointLight position={[5, 1.5, 4]} intensity={30} color={CYAN} distance={18} />
      <Suspense fallback={null}>
        <Rig hovered={hovered} />
        <Environment>
          <Lightformer intensity={2} position={[0, 6, 0]} scale={[12, 12, 1]} />
          <Lightformer
            intensity={1.4}
            color={CYAN}
            position={[-6, 2, -2]}
            rotation-y={Math.PI / 2}
            scale={[20, 2, 1]}
          />
          <Lightformer
            intensity={1.2}
            color={VIOLET}
            position={[6, 2, 2]}
            rotation-y={-Math.PI / 2}
            scale={[20, 2, 1]}
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
