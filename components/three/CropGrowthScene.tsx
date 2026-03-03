'use client'

import { useSpring } from '@react-spring/three';
import * as THREE from 'three';
import React, { Suspense, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';

// Utility: Fibonacci spiral for phyllotaxis
function fibonacciAngle(i: number) {
  return (i * 137.5 * Math.PI) / 180;
}

// Soil noise texture (simple procedural)
function SoilMaterial() {
  return (
    <meshStandardMaterial color="#3D1C02" roughness={0.9} metalness={0} />
  );
}

// Soil mounds
function SoilMounds() {
  const mounds = useMemo(() => [
    { pos: [1.2, -0.13, -1.1] as [number, number, number], scale: [0.4, 0.18, 0.4] as [number, number, number] },
    { pos: [-1.5, -0.12, 0.7] as [number, number, number], scale: [0.32, 0.15, 0.32] as [number, number, number] },
    { pos: [2.1, -0.14, 1.2] as [number, number, number], scale: [0.28, 0.13, 0.28] as [number, number, number] },
    { pos: [-2.2, -0.11, -1.5] as [number, number, number], scale: [0.36, 0.16, 0.36] as [number, number, number] },
    { pos: [0.7, -0.12, 2.0] as [number, number, number], scale: [0.3, 0.12, 0.3] as [number, number, number] },
  ], []);
  return (
    <group>
      {mounds.map((m, i) => (
        <mesh key={i} position={m.pos} scale={m.scale}>
          <sphereGeometry args={[0.5, 24, 24]} />
          <meshStandardMaterial color="#3D1C02" roughness={0.85} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

// Plant leaf shape (pointed oval)
function Leaf({ color = '#6DB33F', scale = 1, rotation = [0, 0, 0], position = [0, 0, 0], sway = 0 }) {
  // Custom shape points for a leaf
  const shape = useMemo(() => {
    const s = new THREE.Shape() as THREE.Shape;
    s.moveTo(0, 0);
    s.quadraticCurveTo(0.18, 0.5, 0, 1);
    s.quadraticCurveTo(-0.18, 0.5, 0, 0);
    return s;
  }, []);
  return (
    <mesh position={position as [number, number, number]} rotation={rotation as [number, number, number]} scale={[scale, scale, scale]}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
    </mesh>
  );
}

// Flower (6 petals)
function Flower({ color = '#FFD700', position = [0, 0, 0], bob = 0 }) {
  const petals = Array.from({ length: 6 });
  return (
    <group position={[position[0], position[1] + bob, position[2]]}>
      {petals.map((_, i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]} position={[0, 0, 0] as [number, number, number]}>
          <cylinderGeometry args={[0, 0.06, 0.22, 12]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#FF8C00" />
      </mesh>
    </group>
  );
}

// Fruit/Pod
function Fruit({ color = '#C0392B', position = [0, 0, 0], scale = 1 }) {
  return (
    <mesh position={position as [number, number, number]} scale={[scale, scale, scale]}>
      <sphereGeometry args={[0.09, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
    </mesh>
  );
}

// Main animated plant
function AnimatedPlant({ growthProgress = 0, offset = 0 }) {
  // growthProgress: 0.0 (seed) to 1.0 (harvest)
  // Stage boundaries
  const stage0 = 0.0, stage1 = 0.11, stage2 = 0.33, stage3 = 0.61, stage4 = 0.9;
  // Animation values
  const t = growthProgress;
  // Sway
  const sway = Math.sin((performance.now() / 1000 + offset) * 0.8) * 0.04;
  // Stage logic
  if (t < stage1) {
    // Seed stage
    const pulse = 0.9 + 0.2 * Math.abs(Math.sin((performance.now() / 1000 + offset) * Math.PI / 1));
    return (
      <group>
        <mesh position={[0, -0.04, 0]} scale={[pulse, 0.6 * pulse, pulse]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#6B3E26" roughness={0.7} />
        </mesh>
      </group>
    );
  } else if (t < stage2) {
    // Sprout stage
    const sproutT = (t - stage1) / (stage2 - stage1);
    const stemHeight = 0.3 * sproutT;
    const leafRot = (-80 + 80 * sproutT) * (Math.PI / 180);
    const leafColor = sproutT < 0.5 ? '#C5E384' : '#6DB33F';
    return (
      <group rotation={[0, 0, sway]}>
        {/* Stem */}
        <mesh position={[0, stemHeight / 2, 0]} scale={[1, sproutT, 1]}>
          <cylinderGeometry args={[0.015, 0.015, 0.3, 12]} />
          <meshStandardMaterial color="#C5E384" />
        </mesh>
        {/* Cotyledon leaves */}
        <Leaf color={leafColor} scale={0.13} position={[-0.05, stemHeight, 0]} rotation={[leafRot, 0, Math.PI / 6]} />
        <Leaf color={leafColor} scale={0.13} position={[0.05, stemHeight, 0]} rotation={[leafRot, 0, -Math.PI / 6]} />
      </group>
    );
  } else if (t < stage3) {
    // Young plant
    const youngT = (t - stage2) / (stage3 - stage2);
    const stalkHeight = 0.8 * youngT + 0.3;
    const leaves = [
      { pos: [0, stalkHeight * 0.5, 0], rot: [0, 0, sway + 0.1], delay: 0 },
      { pos: [0, stalkHeight * 0.7, 0], rot: [0, 0, sway - 0.1], delay: 0.2 },
      { pos: [0, stalkHeight * 0.9, 0], rot: [0, 0, sway], delay: 0.4 },
    ];
    return (
      <group rotation={[0, 0, sway]}>
        {/* Main stalk */}
        <mesh position={[0, stalkHeight / 2, 0]} scale={[1, 1, 1]}>
          <cylinderGeometry args={[0.025, 0.025, stalkHeight, 16]} />
          <meshStandardMaterial color="#6DB33F" />
        </mesh>
        {/* Compound leaves, staggered emergence */}
        {leaves.map((leaf, i) => {
          const emerge = Math.max(0, Math.min(1, (youngT - leaf.delay) / 0.4));
          return (
            <Leaf key={i} color="#6DB33F" scale={0.22 * emerge} position={leaf.pos} rotation={leaf.rot} />
          );
        })}
      </group>
    );
  } else if (t < stage4) {
    // Mature crop
    const matureT = (t - stage3) / (stage4 - stage3);
    const plantHeight = 1.8 * matureT + 0.8;
    const leafCount = 6;
    const leaves = Array.from({ length: leafCount }).map((_, i) => {
      const angle = fibonacciAngle(i);
      const radius = 0.22 + 0.18 * i;
      return {
        pos: [Math.cos(angle) * radius, plantHeight * (0.3 + 0.1 * i), Math.sin(angle) * radius],
        rot: [0, angle, sway],
        scale: 0.25 + 0.08 * i,
      };
    });
    // Flower color random per mount
    const flowerColor = useMemo(() => (Math.random() > 0.5 ? '#FFD700' : '#FF8C00'), []);
    const flowerBob = Math.sin((performance.now() / 1000 + offset) * 1.2) * 0.02;
    return (
      <group rotation={[0, 0, sway]}>
        {/* Main stalk */}
        <mesh position={[0, plantHeight / 2, 0]}>
          <cylinderGeometry args={[0.03, 0.03, plantHeight, 18]} />
          <meshStandardMaterial color="#6DB33F" />
        </mesh>
        {/* Phyllotaxis leaves */}
        {leaves.map((leaf, i) => (
          <Leaf key={i} color="#6DB33F" scale={leaf.scale} position={leaf.pos} rotation={leaf.rot} />
        ))}
        {/* Flower */}
        <Flower color={flowerColor} position={[0, plantHeight + 0.13, 0]} bob={flowerBob} />
      </group>
    );
  } else {
    // Harvest ready
    const fruitT = Math.min(1, (t - stage4) / (1 - stage4));
    const plantHeight = 1.8;
    const leafCount = 7;
    const leaves = Array.from({ length: leafCount }).map((_, i) => {
      const angle = fibonacciAngle(i);
      const radius = 0.22 + 0.18 * i;
      return {
        pos: [Math.cos(angle) * radius, plantHeight * (0.3 + 0.1 * i), Math.sin(angle) * radius],
        rot: [0, angle, sway],
        scale: 0.25 + 0.08 * i,
      };
    });
    const flowerColor = useMemo(() => (Math.random() > 0.5 ? '#FFD700' : '#FF8C00'), []);
    const flowerBob = Math.sin((performance.now() / 1000 + offset) * 1.2) * 0.02;
    // Fruit color random per mount
    const fruitColor = useMemo(() => (Math.random() > 0.5 ? '#C0392B' : '#F4D03F'), []);
    return (
      <group rotation={[0, 0, sway]}>
        {/* Main stalk */}
        <mesh position={[0, plantHeight / 2, 0]}>
          <cylinderGeometry args={[0.03, 0.03, plantHeight, 18]} />
          <meshStandardMaterial color="#6DB33F" />
        </mesh>
        {/* Phyllotaxis leaves */}
        {leaves.map((leaf, i) => (
          <Leaf key={i} color="#6DB33F" scale={leaf.scale} position={leaf.pos} rotation={leaf.rot} />
        ))}
        {/* Flower */}
        <Flower color={flowerColor} position={[0, plantHeight + 0.13, 0]} bob={flowerBob} />
        {/* Fruit */}
        <Fruit color={fruitColor} position={[0, plantHeight + 0.03, 0]} scale={fruitT} />
        {/* Glow */}
        <pointLight position={[0, plantHeight + 0.03, 0]} color={fruitColor} intensity={0.7 * fruitT} distance={0.5} />
      </group>
    );
  }
}

// Main orchestrator
const CropGrowthScene = ({ autoPlay = true }: { autoPlay?: boolean }) => {
  // Animation state
  const elapsed = useRef(0);
  const [spring, api] = useSpring(() => ({ growth: 0 }));
  const lastTime = useRef(performance.now());
  useFrame(() => {
    if (!autoPlay) return;
    const now = performance.now();
    const dt = (now - lastTime.current) / 1000;
    lastTime.current = now;
    elapsed.current += dt;
    // 6s full cycle, 2s pause at harvest
    let t = (elapsed.current % 8) / 6;
    if (t > 1) t = 1;
    api.start({ growth: t });
    if (elapsed.current % 8 > 7.99) {
      elapsed.current = 0;
    }
  });

  // Render main hero plant and 6 background plants
  const field = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 6; ++i) {
      const x = (i % 3 - 1) * 1.2 + (i % 2 === 0 ? 0.3 : -0.3);
      const z = Math.floor(i / 3) * 1.1 - 1.2;
      const scale = 0.6 - i * 0.08;
      arr.push({ x, z, scale, offset: i * 0.15 });
    }
    return arr;
  }, []);

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <circleGeometry args={[3, 64]} />
        <SoilMaterial />
      </mesh>
      <SoilMounds />
      {/* Field of background plants */}
      {field.map((p, i) => {
        const [growth, setGrowth] = useState(0);
        useFrame(() => {
          const g = spring.growth.get() - p.offset;
          setGrowth(g < 0 ? 0 : g > 1 ? 1 : g);
        });
        return (
          <group key={i} position={[p.x, 0, p.z]} scale={[p.scale, p.scale, p.scale]}>
            <AnimatedPlant growthProgress={growth} offset={p.offset} />
          </group>
        );
      })}
      {/* Main hero plant */}
      <group position={[0, 0, 0]} scale={[1, 1, 1]}>
        {(() => {
          const [growth, setGrowth] = useState(0);
          useFrame(() => {
            setGrowth(spring.growth.get());
          });
          return <AnimatedPlant growthProgress={growth} offset={0} />;
        })()}
      </group>
      {/* Lights */}
      <pointLight position={[0, 5, 0]} color="#87CEEB" intensity={0.6} distance={8} />
      <pointLight position={[3, 3, 2]} color="#FDB347" intensity={1.2} distance={8} />
      <pointLight position={[-2, 1, -3]} color="#22C55E" intensity={0.4} distance={6} />
    </group>
  );
};

const CropGrowthSceneCanvas = (props: { autoPlay?: boolean }) => (
  <Suspense fallback={<div className="w-full h-64 flex items-center justify-center"><div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" /></div>}>
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.5, 4], fov: 38 }}
      style={{ width: '100%', height: '400px', background: '#0A0F0A', borderRadius: 16 }}
      shadows
    >
      <fog attach="fog" args={["#0A0F0A", 0.08]} />
      <Environment preset="park" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
      <CropGrowthScene {...props} />
    </Canvas>
  </Suspense>
);

export default CropGrowthSceneCanvas;
