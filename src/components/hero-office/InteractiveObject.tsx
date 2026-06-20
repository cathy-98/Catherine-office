"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { RoundedBox, useGLTF } from "@react-three/drei";
import { Box3, MeshStandardMaterial, Vector3 } from "three";
import type { Group, Mesh, Object3D } from "three";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
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
      object.position[1] + (glow ? 0.045 + Math.sin(state.clock.elapsedTime * 2.2) * 0.025 : 0);
    const targetScale = (object.scale ?? 1) * (glow ? 1.06 : 1);
    const nextScale = groupRef.current.scale.x + (targetScale - groupRef.current.scale.x) * 0.18;
    groupRef.current.scale.setScalar(nextScale);
  });

  return (
    <group
      ref={groupRef}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale ?? 1}
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
      {/* Replace remaining placeholders with <primitive object={gltf.scene} /> as final .glb assets arrive. */}
      {object.kind === "laptop" ? (
        <MacBookModel glow={glow} />
      ) : object.kind === "coffee" ? (
        <CoffeeCupModel glow={glow} />
      ) : object.kind === "aurora" ? (
        <AuroraModel modelPath={object.modelPath} glow={glow} />
      ) : (
        <PlaceholderModel kind={object.kind} glow={glow} />
      )}
      {glow ? (
        <pointLight position={[0, 0.45, 0.2]} intensity={1.15} distance={2.35} color="#b38ad1" />
      ) : null}
    </group>
  );
}

function AuroraModel({ modelPath, glow }: { modelPath: string; glow: boolean }) {
  const gltf = useGLTF(modelPath);
  const scene = useMemo(() => prepareGroundedModel(gltf.scene), [gltf.scene]);

  return (
    <group rotation={[0, Math.PI, 0]} scale={1.02}>
      <primitive object={scene} />
      {glow ? (
        <mesh position={[0, 0.34, 0]}>
          <sphereGeometry args={[0.55, 24, 16]} />
          <meshBasicMaterial color="#b38ad1" transparent opacity={0.12} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  );
}

function MacBookModel({ glow }: { glow: boolean }) {
  const materials = useLoader(MTLLoader, "/models/macbook/materials.mtl");
  const obj = useLoader(OBJLoader, "/models/macbook/model.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });
  const model = useMemo(() => prepareModel(obj), [obj]);

  return (
    <group position={[0, 0.11, -0.02]} rotation={[0, 0, 0]} scale={0.34}>
      {/* MacBook OBJ slot. Replace with /models/laptop.glb later if a final optimized GLB is exported. */}
      <primitive object={model} />
      {glow ? (
        <mesh position={[0, 0.9, 0.2]} scale={[1.5, 0.08, 1]}>
          <sphereGeometry args={[0.7, 24, 16]} />
          <meshBasicMaterial color="#b38ad1" transparent opacity={0.11} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  );
}

function CoffeeCupModel({ glow }: { glow: boolean }) {
  const obj = useLoader(OBJLoader, "/models/office-pack/coffee-cup/CHAHIN_COFFEE_CUP.obj");
  const model = useMemo(() => prepareTintedModel(obj, glow ? "#dcc4ec" : "#c9a8dc"), [obj, glow]);

  return (
    <group position={[0, 0, 0]} rotation={[0, -0.18, 0]} scale={0.28}>
      {/* Real coffee cup OBJ from The Office Pack. Replace with /models/coffee.glb later if needed. */}
      <mesh position={[0, -0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.035, 40]} />
        <meshStandardMaterial color="#f1e7f6" roughness={0.72} />
      </mesh>
      <primitive object={model} />
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.018, 32]} />
        <meshStandardMaterial color="#b77f56" roughness={0.68} />
      </mesh>
      <mesh position={[-0.12, 0.72, 0.03]} rotation={[0.25, 0, -0.25]}>
        <torusGeometry args={[0.12, 0.006, 8, 26, Math.PI * 0.85]} />
        <meshBasicMaterial color="#d7c0e6" transparent opacity={0.32} />
      </mesh>
      <mesh position={[0.1, 0.82, -0.02]} rotation={[0.2, 0, 0.22]}>
        <torusGeometry args={[0.1, 0.006, 8, 26, Math.PI * 0.8]} />
        <meshBasicMaterial color="#d7c0e6" transparent opacity={0.24} />
      </mesh>
    </group>
  );
}

function prepareModel(scene: Object3D) {
  const model = scene.clone(true);
  model.traverse((child) => {
    child.castShadow = true;
    child.receiveShadow = true;
  });
  return model;
}

function prepareGroundedModel(scene: Object3D) {
  const model = scene.clone(true);
  const box = new Box3().setFromObject(model);
  const center = new Vector3();
  box.getCenter(center);

  model.position.set(-center.x, -box.min.y, -center.z);
  model.traverse((child) => {
    child.castShadow = true;
    child.receiveShadow = true;
  });
  return model;
}

function prepareTintedModel(scene: Object3D, color: string) {
  const model = scene.clone(true);
  const box = new Box3().setFromObject(model);
  const center = new Vector3();

  box.getCenter(center);
  model.position.set(-center.x, -box.min.y, -center.z);
  model.traverse((child) => {
    child.castShadow = true;
    child.receiveShadow = true;
    if ("isMesh" in child) {
      const mesh = child as Mesh;
      mesh.material = new MeshStandardMaterial({
        color,
        roughness: 0.58,
        metalness: 0.04,
        emissive: color,
        emissiveIntensity: color === "#ffffff" ? 0 : 0.08,
      });
    }
  });
  return model;
}

function PlaceholderModel({ kind, glow }: { kind: OfficeObject["kind"]; glow: boolean }) {
  const material = (
    <meshStandardMaterial
      color={glow ? "#f7f1ff" : "#ffffff"}
      emissive={glow ? "#8f6aae" : "#000000"}
      emissiveIntensity={glow ? 0.22 : 0}
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
      <group rotation={[0, -0.25, 0]}>
        <RoundedBox args={[0.7, 0.42, 0.26]} radius={0.05} position={[0, 0.08, 0]} castShadow>
          <meshStandardMaterial color={glow ? "#3b3342" : "#4b4642"} roughness={0.52} />
        </RoundedBox>
        <RoundedBox args={[0.28, 0.12, 0.18]} radius={0.035} position={[-0.19, 0.36, 0]} castShadow>
          <meshStandardMaterial color="#efe8df" roughness={0.52} />
        </RoundedBox>
        <mesh position={[0, 0.08, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.21, 0.18, 36]} />
          <meshStandardMaterial color="#181614" roughness={0.34} />
        </mesh>
        <mesh position={[0, 0.08, 0.305]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.018, 32]} />
          <meshStandardMaterial color={glow ? "#b38ad1" : "#2d272d"} roughness={0.2} metalness={0.15} />
        </mesh>
        <mesh position={[0.24, 0.32, 0.13]} castShadow>
          <sphereGeometry args={[0.05, 20, 12]} />
          <meshStandardMaterial color="#efe8df" roughness={0.42} />
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

useGLTF.preload("/models/aurora.glb");
