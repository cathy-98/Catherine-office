"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { MeshReflectorMaterial, RoundedBox, useGLTF } from "@react-three/drei";
import { Box3, MeshStandardMaterial, Vector3 } from "three";
import type { Group, Mesh, Object3D } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import type { OfficeObject } from "@/types/office";
import { officeObjects } from "./officeData";
import { InteractiveObject } from "./InteractiveObject";

type OfficeSceneProps = {
  activeObject: OfficeObject | null;
  hoveredObject: OfficeObject | null;
  onHoverObject: (object: OfficeObject | null) => void;
  onSelectObject: (object: OfficeObject) => void;
};

export function OfficeScene({
  activeObject,
  hoveredObject,
  onHoverObject,
  onSelectObject,
}: OfficeSceneProps) {
  return (
    <group position={[0, -0.48, 0]} rotation={[0, -0.12, 0]}>
      {/* Replace this room shell with /models/office.glb when the final office model exists. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[9, 7]} />
        <MeshReflectorMaterial
          color="#d9c8b8"
          roughness={0.68}
          metalness={0.05}
          blur={[320, 120]}
          mixBlur={0.35}
          mixStrength={0.08}
          mirror={0.04}
        />
      </mesh>

      <mesh position={[0, 1.55, -2.58]} receiveShadow>
        <boxGeometry args={[5.35, 2.72, 0.08]} />
        <meshStandardMaterial color="#e2d4c7" roughness={0.9} />
      </mesh>
      <mesh position={[2.78, 1.45, -0.75]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[3.65, 2.54, 0.08]} />
        <meshStandardMaterial color="#e7dbcf" roughness={0.9} />
      </mesh>
      <FloorPlanks />

      <mesh position={[1.15, 1.58, -2.525]}>
        <planeGeometry args={[1.35, 1.38]} />
        <meshBasicMaterial color="#d9dfe5" transparent opacity={0.34} />
      </mesh>
      <WallOfficeDetails />

      <mesh position={[0, 0.012, 1.15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1.78, 64]} />
        <meshStandardMaterial color="#c8a7da" roughness={0.82} transparent opacity={0.34} />
      </mesh>
      <mesh position={[0.15, 0.018, 0.85]} rotation={[-Math.PI / 2, 0, 0.2]} receiveShadow>
        <circleGeometry args={[1.08, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.82} transparent opacity={0.18} />
      </mesh>

      <DeskModel />
      <DigitalSetupModel />

      <WiggleChair />

      <CatTreeModel />

      {officeObjects.map((object) => (
        <InteractiveObject
          key={object.id}
          object={object}
          isActive={activeObject?.id === object.id}
          isHovered={hoveredObject?.id === object.id}
          onHover={onHoverObject}
          onSelect={onSelectObject}
        />
      ))}
    </group>
  );
}

function FloorPlanks() {
  return (
    <group position={[0, 0.035, 0.05]}>
      {Array.from({ length: 9 }).map((_, index) => (
        <RoundedBox
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          args={[0.5, 0.025, 4.2]}
          radius={0.008}
          position={[-2 + index * 0.5, 0, 0.12]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={index % 2 ? "#d2bba5" : "#cbb39d"} roughness={0.82} />
        </RoundedBox>
      ))}
    </group>
  );
}

function WallOfficeDetails() {
  return (
    <group>
      {/* Real OBJ assets from The Office Pack, styled with Catherine Lab materials. */}
      <OfficePackObj
        objPath="/models/office-pack/wall-shelf/WallShelf.obj"
        color="#d0b8a2"
        position={[-2.1, 1.42, -2.43]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[0.46, 0.46, 0.46]}
      />
      <ShelfPlant />
    </group>
  );
}

function ShelfPlant() {
  return (
    <group position={[-1.82, 1.48, -2.31]} rotation={[0, 0.08, 0]}>
      <RoundedBox args={[0.16, 0.14, 0.14]} radius={0.025} position={[0, 0.07, 0]} castShadow>
        <meshStandardMaterial color="#9eaf87" roughness={0.74} />
      </RoundedBox>
      {[-0.1, -0.04, 0.04, 0.1].map((offset, index) => (
        <mesh
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          position={[offset * 0.85, 0.23, 0]}
          rotation={[0.18, 0, offset * -4.2]}
          castShadow
        >
          <coneGeometry args={[0.024, 0.24, 5]} />
          <meshStandardMaterial color={index % 2 ? "#6f866a" : "#8ba07a"} roughness={0.78} />
        </mesh>
      ))}
    </group>
  );
}

function CatTreeModel() {
  const gltf = useGLTF("/models/cat-tree.glb");
  const scene = useMemo(() => prepareDecorativeModel(gltf.scene), [gltf.scene]);

  return (
    <group position={[2.2, 0.04, -1.8]} rotation={[0, -0.72, 0]} scale={[0.13, 0.18, 0.13]}>
      {/* Decorative model slot. Replace /models/cat-tree.glb when Aurora's final furniture exists. */}
      <primitive object={scene} />
    </group>
  );
}

function DeskModel() {
  const gltf = useGLTF("/models/desk.glb");
  const scene = useMemo(() => prepareDecorativeModel(gltf.scene, "#d6bfa9"), [gltf.scene]);

  return (
    <group position={[0.1, -0.64, 0.06]} rotation={[0, 0.05, 0]} scale={1.08}>
      {/* Desk model slot. Replace /models/desk.glb when the final office furniture exists. */}
      <primitive object={scene} />
    </group>
  );
}

function OfficePackObj({
  objPath,
  color,
  position,
  rotation,
  scale,
}: {
  objPath: string;
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}) {
  const obj = useLoader(OBJLoader, objPath);
  const scene = useMemo(() => prepareOfficePackModel(obj, color), [obj, color]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

function WiggleChair() {
  const groupRef = useRef<Group>(null);
  const impulseRef = useRef(0);

  useFrame((state) => {
    if (!groupRef.current) return;
    const impulse = impulseRef.current;
    const wobble = Math.sin(state.clock.elapsedTime * 22) * impulse;

    groupRef.current.rotation.set(wobble * 0.06, Math.PI + wobble * 0.08, wobble * 0.05);
    groupRef.current.position.x = 0.08 + wobble * 0.025;
    impulseRef.current *= 0.88;
    if (impulseRef.current < 0.01) impulseRef.current = 0;
  });

  return (
    <group
      ref={groupRef}
      position={[0.08, -0.02, 1.25]}
      rotation={[0, Math.PI, 0]}
      scale={[0.025, 0.025, 0.025]}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "auto";
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        impulseRef.current = 1;
      }}
    >
      <OfficePackObj objPath="/models/office-pack/chair/48.obj" color="#bca793" position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]} />
    </group>
  );
}

function DigitalSetupModel() {
  const gltf = useGLTF("/models/digital-setup.glb");
  const scene = useMemo(() => prepareDecorativeModel(gltf.scene, "#9f8a78"), [gltf.scene]);

  return (
    <group position={[-0.12, 0.552, 0.08]} rotation={[0, 0.04, 0]}>
      <RoundedBox args={[2.85, 0.035, 1.28]} radius={0.045} position={[0, -0.012, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#a18a77" roughness={0.78} metalness={0.02} />
      </RoundedBox>
      <RoundedBox args={[2.62, 0.012, 1.06]} radius={0.035} position={[0, 0.014, 0]} receiveShadow>
        <meshStandardMaterial color="#7f6b78" roughness={0.82} transparent opacity={0.34} />
      </RoundedBox>
      {/* Neutralized setup slot. Original file: gamer_setup_pack.glb; flattened as a subtle tech layer under desk objects. */}
      <group position={[0.03, 0.02, -0.02]} scale={[1.18, 0.055, 1.22]}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

function prepareOfficePackModel(scene: Object3D, color: string) {
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
        roughness: 0.74,
        metalness: 0.03,
      });
    }
  });
  return model;
}

function prepareDecorativeModel(scene: Object3D, overrideColor?: string) {
  const model = scene.clone(true);
  model.traverse((child) => {
    child.castShadow = true;
    child.receiveShadow = true;
    if (overrideColor && "isMesh" in child) {
      const mesh = child as Mesh;
      mesh.material = new MeshStandardMaterial({
        color: overrideColor,
        roughness: 0.68,
        metalness: 0.03,
      });
    }
  });
  return model;
}

useGLTF.preload("/models/cat-tree.glb");
useGLTF.preload("/models/desk.glb");
useGLTF.preload("/models/digital-setup.glb");
