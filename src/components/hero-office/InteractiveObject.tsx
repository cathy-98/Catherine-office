"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";
import type { OfficeObject } from "@/types/office";

type InteractiveObjectProps = {
  object: OfficeObject;
  isActive: boolean;
  isHovered: boolean;
  onHover: (object: OfficeObject | null) => void;
  onSelect: (object: OfficeObject) => void;
};

export function InteractiveObject({
  object,
  isActive,
  isHovered,
  onHover,
  onSelect,
}: InteractiveObjectProps) {
  const groupRef = useRef<Group>(null);
  const glow = isActive || isHovered;

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y =
      object.position[1] + (glow ? Math.sin(state.clock.elapsedTime * 2.2) * 0.025 : 0);
  });

  return (
    <group
      ref={groupRef}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
        onHover(object);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "auto";
        onHover(null);
      }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(object);
      }}
    >
      {/* Replace this switch with <primitive object={gltf.scene} /> after loading object.modelPath. */}
      <PlaceholderModel kind={object.kind} glow={glow} />
      {glow ? (
        <pointLight position={[0, 0.45, 0.2]} intensity={0.9} distance={2.1} color="#b38ad1" />
      ) : null}
    </group>
  );
}

function PlaceholderModel({ kind, glow }: { kind: OfficeObject["kind"]; glow: boolean }) {
  const material = (
    <meshStandardMaterial
      color={glow ? "#f7f1ff" : "#ffffff"}
      emissive={glow ? "#8f6aae" : "#000000"}
      emissiveIntensity={glow ? 0.16 : 0}
      roughness={0.58}
      metalness={0.05}
    />
  );

  if (kind === "laptop") {
    return (
      <group>
        <RoundedBox args={[1.05, 0.08, 0.68]} radius={0.035} castShadow>
          {material}
        </RoundedBox>
        <RoundedBox args={[0.94, 0.62, 0.05]} radius={0.035} position={[0, 0.34, -0.28]} rotation={[-0.62, 0, 0]} castShadow>
          <meshStandardMaterial color={glow ? "#dac7ea" : "#d8d2cc"} roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, 0.34, -0.252]} rotation={[-0.62, 0, 0]}>
          <planeGeometry args={[0.72, 0.42]} />
          <meshBasicMaterial color="#6f4a8e" transparent opacity={glow ? 0.5 : 0.24} />
        </mesh>
      </group>
    );
  }

  if (kind === "coffee") {
    return (
      <group>
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.15, 0.36, 32]} />
          {material}
        </mesh>
        <mesh position={[0.2, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.1, 0.018, 12, 32]} />
          <meshStandardMaterial color="#e8ddd2" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.015, 32]} />
          <meshStandardMaterial color="#8a6148" roughness={0.7} />
        </mesh>
      </group>
    );
  }

  if (kind === "aurora") {
    return (
      <group>
        <mesh position={[0, 0.22, 0]} castShadow>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial color={glow ? "#f5edf8" : "#d7d0c8"} roughness={0.72} />
        </mesh>
        <mesh position={[0.18, 0.5, 0]} castShadow>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial color={glow ? "#f5edf8" : "#d7d0c8"} roughness={0.72} />
        </mesh>
        <mesh position={[0.11, 0.68, 0.06]} rotation={[0.4, 0.1, -0.2]} castShadow>
          <coneGeometry args={[0.07, 0.16, 3]} />
          <meshStandardMaterial color="#c9bfb6" roughness={0.72} />
        </mesh>
        <mesh position={[0.27, 0.68, 0.05]} rotation={[0.35, -0.25, 0.45]} castShadow>
          <coneGeometry args={[0.07, 0.16, 3]} />
          <meshStandardMaterial color="#c9bfb6" roughness={0.72} />
        </mesh>
        <mesh position={[-0.28, 0.25, 0]} rotation={[0, 0, 0.75]} castShadow>
          <torusGeometry args={[0.24, 0.025, 10, 40, Math.PI * 1.15]} />
          <meshStandardMaterial color="#c9bfb6" roughness={0.72} />
        </mesh>
      </group>
    );
  }

  if (kind === "camera") {
    return (
      <group>
        <RoundedBox args={[0.62, 0.36, 0.3]} radius={0.055} castShadow>
          <meshStandardMaterial color={glow ? "#eee2f8" : "#d5cec7"} roughness={0.54} />
        </RoundedBox>
        <mesh position={[0, 0, 0.19]} castShadow>
          <cylinderGeometry args={[0.16, 0.18, 0.18, 32]} />
          <meshStandardMaterial color="#746c65" roughness={0.38} />
        </mesh>
        <mesh position={[-0.2, 0.23, 0]} castShadow>
          <boxGeometry args={[0.2, 0.12, 0.22]} />
          {material}
        </mesh>
      </group>
    );
  }

  if (kind === "window") {
    return (
      <group>
        <RoundedBox args={[1.25, 1.35, 0.06]} radius={0.045} castShadow>
          <meshStandardMaterial color="#efe9e1" roughness={0.64} />
        </RoundedBox>
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[1.04, 1.12]} />
          <meshBasicMaterial color="#d9d0ef" transparent opacity={glow ? 0.42 : 0.26} />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[0.035, 1.18, 0.035]} />
          <meshStandardMaterial color="#fffaf3" />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <boxGeometry args={[1.1, 0.035, 0.035]} />
          <meshStandardMaterial color="#fffaf3" />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <RoundedBox args={[0.62, 0.06, 0.48]} radius={0.025} castShadow>
        <meshStandardMaterial color={glow ? "#fbf4ff" : "#f3eee8"} roughness={0.78} />
      </RoundedBox>
      <mesh position={[-0.16, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.18, 0.32]} />
        <meshBasicMaterial color="#8f6aae" transparent opacity={0.48} />
      </mesh>
      <mesh position={[0.12, 0.05, 0.04]} rotation={[-Math.PI / 2, 0, -0.2]}>
        <planeGeometry args={[0.2, 0.24]} />
        <meshBasicMaterial color="#d7c0e6" transparent opacity={0.72} />
      </mesh>
    </group>
  );
}
