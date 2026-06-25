"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial, RoundedBox, Text, useGLTF } from "@react-three/drei";
import { Box3, MeshBasicMaterial, MeshStandardMaterial, Vector3 } from "three";
import type { Group, Mesh, Object3D } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import type { OfficeObject } from "@/types/office";
import { officeObjects } from "./officeData";
import { InteractiveObject } from "./InteractiveObject";

const USE_REFERENCE_ROOM = true;

type OfficeSceneProps = {
  activeObject: OfficeObject | null;
  hoveredObject: OfficeObject | null;
  isHinting: boolean;
  onHoverObject: (object: OfficeObject | null) => void;
  onSelectObject: (object: OfficeObject) => void;
  onSceneReady: () => void;
};

const SKILLS_HOVER_OBJECT: OfficeObject = {
  id: "skills",
  kind: "moodboard",
  label: "Moodboard",
  title: "Habilidades",
  tooltipLabel: "Habilidades",
  body: "",
  modelPath: "",
  position: [-0.35, 1.68, -2.47],
  focusPosition: [-0.35, 1.9, 1.65],
};

const CV_HOVER_OBJECT: OfficeObject = {
  id: "cv",
  kind: "folder",
  label: "Documento",
  title: "CV",
  tooltipLabel: "CV",
  body: "",
  modelPath: "",
  position: [1.28, 0.63, 0.45],
  focusPosition: [1.18, 1.18, 2.1],
};

export function OfficeScene({
  activeObject,
  hoveredObject,
  isHinting,
  onHoverObject,
  onSelectObject,
  onSceneReady,
}: OfficeSceneProps) {
  const readyRef = useRef(false);
  const { size } = useThree();
  const isMobileScene = size.width < 768;

  useFrame(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    onSceneReady();
  });

  if (USE_REFERENCE_ROOM) {
    return (
      <group position={[0.08, -0.48, 0]} rotation={[0, -0.08, 0]}>
        <ReferenceOfficeRoom />
        <ReferenceRoomHotspots
          activeObject={activeObject}
          hoveredObject={hoveredObject}
          isHinting={isHinting}
          onHoverObject={onHoverObject}
          onSelectObject={onSelectObject}
        />
      </group>
    );
  }

  return (
    <group position={[0.08, -0.48, 0]} rotation={[0, -0.08, 0]}>
      {/* Keep the room shell custom and lightweight. Full downloaded rooms are reference-only unless they are cleanly separated. */}
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
        <meshStandardMaterial color="#d8c9ba" roughness={0.9} />
      </mesh>
      <mesh position={[2.78, 1.45, -0.75]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[3.65, 2.54, 0.08]} />
        <meshStandardMaterial color="#d0c0b2" roughness={0.9} />
      </mesh>
      <EditorialWallLayer />
      <FloorPlanks />

      <mesh position={[1.15, 1.58, -2.525]}>
        <planeGeometry args={[1.35, 1.38]} />
        <meshBasicMaterial color="#d9dfe5" transparent opacity={0.34} />
      </mesh>
      <WindowView />
      <WallOfficeDetails />
      {!isMobileScene ? <RightWallStudioCards /> : null}
      <WallMoodboard
        isHovered={hoveredObject?.id === "skills"}
        onHover={(isHovered) => onHoverObject(isHovered ? SKILLS_HOVER_OBJECT : null)}
      />

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
      <DeskEditorialDetails
        isCvHovered={hoveredObject?.id === "cv"}
        onHoverCv={(isHovered) => onHoverObject(isHovered ? CV_HOVER_OBJECT : null)}
      />
      <DeskLight />
      {!isMobileScene ? <ColorStudyTray /> : null}
      {!isMobileScene ? <PersonalDetails /> : null}

      <WiggleChair />

      <CatTreeModel />

      {officeObjects.map((object) => (
        <InteractiveObject
          key={object.id}
          object={object}
          isActive={activeObject?.id === object.id}
          isHovered={hoveredObject?.id === object.id}
          isHinted={isHinting && !activeObject && !hoveredObject}
          onHover={onHoverObject}
          onSelect={onSelectObject}
        />
      ))}
    </group>
  );
}

function ReferenceOfficeRoom() {
  const gltf = useGLTF("/models/oficina-reference.glb");
  const scene = useMemo(() => prepareReferenceOfficeModel(gltf.scene), [gltf.scene]);
  const chairImpulseRef = useRef(0);
  const [isDeskLightOn, setIsDeskLightOn] = useState(false);

  useEffect(() => {
    scene.traverse((child) => {
      if (!("isMesh" in child)) return;

      const mesh = child as Mesh;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach((material) => {
        const standardMaterial = material as MeshStandardMaterial;
        if (mesh.name === "Object_4" || material.name.toLowerCase().includes("interruptor")) {
          standardMaterial.color.set(isDeskLightOn ? "#b38ad1" : "#272326");
          standardMaterial.emissive.set(isDeskLightOn ? "#6f4a8e" : "#000000");
          standardMaterial.emissiveIntensity = isDeskLightOn ? 0.18 : 0;
          standardMaterial.needsUpdate = true;
        }
        if (mesh.name === "Object_6" || mesh.name === "Object_23") {
          standardMaterial.color.set(isDeskLightOn ? "#fff0c9" : mesh.name === "Object_23" ? "#272326" : "#f7efe5");
          standardMaterial.emissive.set(isDeskLightOn ? "#ffe0a3" : "#000000");
          standardMaterial.emissiveIntensity = isDeskLightOn ? 0.85 : 0;
          standardMaterial.needsUpdate = true;
        }
      });
    });
  }, [isDeskLightOn, scene]);

  useFrame(() => {
    const impulse = chairImpulseRef.current;
    if (impulse <= 0) return;

    const wiggle = Math.sin(impulse * Math.PI * 4) * impulse;
    scene.traverse((child) => {
      if (!child.userData.isInteractiveChair) return;

      const basePosition = child.userData.basePosition as Vector3;
      const baseRotationY = child.userData.baseRotationY as number;
      child.position.x = basePosition.x + wiggle * 0.045;
      child.position.z = basePosition.z + wiggle * 0.025;
      child.rotation.y = baseRotationY + wiggle * 0.12;
    });

    chairImpulseRef.current *= 0.88;
    if (chairImpulseRef.current < 0.01) {
      chairImpulseRef.current = 0;
      scene.traverse((child) => {
        if (!child.userData.isInteractiveChair) return;

        const basePosition = child.userData.basePosition as Vector3;
        const baseRotationY = child.userData.baseRotationY as number;
        child.position.copy(basePosition);
        child.rotation.y = baseRotationY;
      });
    }
  });

  return (
    <group position={[0.9, 0.02, -0.55]} rotation={[0, 0.08, 0]} scale={0.92}>
      {/* CC BY room by maralflop1, retinted as a temporary Catherine Lab base. */}
      <primitive object={scene} />
      <ReferenceOfficeMessage />
      <ReferenceDeskLight isOn={isDeskLightOn} />
      <mesh
        position={[-1.05, 1.58, 1.55]}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "auto";
        }}
        onClick={(event) => {
          event.stopPropagation();
          setIsDeskLightOn((current) => !current);
        }}
      >
        <boxGeometry args={[0.32, 0.38, 0.32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh
        position={[0.42, 1.47, 0.78]}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "auto";
        }}
        onClick={(event) => {
          event.stopPropagation();
          chairImpulseRef.current = 1;
        }}
      >
        <sphereGeometry args={[0.48, 24, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function ReferenceOfficeMessage() {
  return (
    <group position={[1.38, 1.82, -0.83]} rotation={[0, 0, 0]}>
      <RoundedBox args={[0.62, 0.52, 0.018]} radius={0.045} castShadow receiveShadow>
        <meshStandardMaterial color="#c99de0" roughness={0.72} />
      </RoundedBox>
      <Text
        position={[0, 0.005, 0.017]}
        fontSize={0.058}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.45}
        textAlign="center"
      >
        Aquí nacen las mejores ideas
      </Text>
    </group>
  );
}

function ReferenceDeskLight({ isOn }: { isOn: boolean }) {
  if (!isOn) return null;

  return (
    <group position={[-1.28, 1.08, 1.14]}>
      <pointLight intensity={2.6} distance={1.8} color="#ffe2aa" />
      <mesh>
        <sphereGeometry args={[0.07, 24, 16]} />
        <meshBasicMaterial color="#ffe8b5" transparent opacity={0.72} />
      </mesh>
    </group>
  );
}

function ReferenceRoomHotspots({
  activeObject,
  hoveredObject,
  isHinting,
  onHoverObject,
  onSelectObject,
}: Pick<OfficeSceneProps, "activeObject" | "hoveredObject" | "isHinting" | "onHoverObject" | "onSelectObject">) {
  const positions: Record<OfficeObject["id"], { position: [number, number, number]; radius: number }> = {
    projects: { position: [0.18, 1.28, -0.08], radius: 0.32 },
    about: { position: [0.24, 0.98, -0.58], radius: 0.2 },
    beyond: { position: [1.62, 1.58, -1.06], radius: 0.24 },
    visual: { position: [-0.34, 1.2, -1.54], radius: 0.24 },
    timeline: { position: [0.78, 1.75, -2.02], radius: 0.34 },
    process: { position: [1.02, 0.94, 0.08], radius: 0.24 },
    skills: { position: [-0.52, 1.95, -1.54], radius: 0.26 },
    cv: { position: [1.24, 0.78, 0.26], radius: 0.22 },
  };

  return (
    <group>
      {officeObjects.map((object) => {
        const hotspot = positions[object.id];
        if (!hotspot) return null;

        return (
          <ReferenceHotspot
            key={object.id}
            object={{ ...object, position: hotspot.position }}
            radius={hotspot.radius}
            isActive={activeObject?.id === object.id}
            isHovered={hoveredObject?.id === object.id}
            isHinted={isHinting && !activeObject && !hoveredObject}
            onHoverObject={onHoverObject}
            onSelectObject={onSelectObject}
          />
        );
      })}
    </group>
  );
}

function ReferenceHotspot({
  object,
  radius,
  isActive,
  isHovered,
  isHinted,
  onHoverObject,
  onSelectObject,
}: {
  object: OfficeObject;
  radius: number;
  isActive: boolean;
  isHovered: boolean;
  isHinted: boolean;
  onHoverObject: (object: OfficeObject | null) => void;
  onSelectObject: (object: OfficeObject) => void;
}) {
  const groupRef = useRef<Group>(null);
  const ringRef = useRef<Mesh>(null);
  const dotRef = useRef<Mesh>(null);
  const impulseRef = useRef(0);
  const glow = isActive || isHovered;

  useFrame((state) => {
    const impulse = impulseRef.current;
    const clickBounce = Math.sin(impulse * Math.PI) * 0.14;
    if (groupRef.current) {
      groupRef.current.position.y = object.position[1] + clickBounce + (glow ? Math.sin(state.clock.elapsedTime * 2.4) * 0.018 : 0);
      groupRef.current.rotation.y = Math.sin(impulse * Math.PI * 2) * 0.14;
    }
    if (!ringRef.current) return;
    ringRef.current.scale.setScalar(glow ? 1.06 : 1);
    (ringRef.current.material as MeshBasicMaterial).opacity = glow ? 0.18 : 0;
    if (dotRef.current) {
      dotRef.current.scale.setScalar(glow ? 1.12 : 1);
      (dotRef.current.material as MeshBasicMaterial).opacity = glow ? 0.72 : 0;
    }
    impulseRef.current *= 0.88;
    if (impulseRef.current < 0.01) impulseRef.current = 0;
  });

  return (
    <group
      ref={groupRef}
      position={object.position}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
        onHoverObject(object);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "auto";
        onHoverObject(null);
      }}
      onClick={(event) => {
        event.stopPropagation();
        impulseRef.current = 1;
        onSelectObject(object);
      }}
    >
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.68, radius, 48]} />
        <meshBasicMaterial color="#b38ad1" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={dotRef} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius * 0.18, 24]} />
        <meshBasicMaterial color="#b38ad1" transparent opacity={0} depthWrite={false} />
      </mesh>
      {glow ? <pointLight position={[0, 0.35, 0]} intensity={0.65} distance={1.35} color="#b38ad1" /> : null}
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
          <meshStandardMaterial color={index % 2 ? "#cfb89f" : "#c5aa93"} roughness={0.82} />
        </RoundedBox>
      ))}
    </group>
  );
}

function EditorialWallLayer() {
  return (
    <group>
      <RoundedBox args={[1.86, 2.28, 0.026]} radius={0.055} position={[-1.05, 1.62, -2.505]} castShadow receiveShadow>
        <meshStandardMaterial color="#dfcde9" roughness={0.88} transparent opacity={0.82} />
      </RoundedBox>
      <RoundedBox args={[0.34, 2.02, 0.03]} radius={0.035} position={[-2.02, 1.5, -2.455]} castShadow>
        <meshStandardMaterial color="#8f6aae" roughness={0.7} transparent opacity={0.5} />
      </RoundedBox>
      <RoundedBox args={[1.12, 0.045, 0.035]} radius={0.012} position={[-1.22, 2.48, -2.45]} castShadow>
        <meshStandardMaterial color="#6f4a8e" roughness={0.7} transparent opacity={0.5} />
      </RoundedBox>
      <Text
        position={[-1.48, 2.22, -2.45]}
        fontSize={0.22}
        color="#6f4a8e"
        anchorX="center"
        anchorY="middle"
      >
        Cath.
      </Text>
      <Text
        position={[-1.03, 2.0, -2.45]}
        fontSize={0.07}
        color="#8f6aae"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.02}
      >
        UX/UI  WEB  IA
      </Text>
      <group position={[-1.3, 1.72, -2.445]}>
        {[0, 1, 2].map((index) => (
          <RoundedBox
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            args={[0.54, 0.055, 0.018]}
            radius={0.01}
            position={[0, -index * 0.16, 0]}
          >
            <meshStandardMaterial
              color={index === 0 ? "#6f4a8e" : index === 1 ? "#b38ad1" : "#f6f1eb"}
              roughness={0.72}
              transparent
              opacity={index === 2 ? 0.92 : 0.62}
            />
          </RoundedBox>
        ))}
      </group>
      <RoundedBox args={[5.35, 0.06, 0.08]} radius={0.012} position={[0, 0.24, -2.46]} receiveShadow>
        <meshStandardMaterial color="#c2aa96" roughness={0.82} />
      </RoundedBox>
      <RoundedBox args={[3.65, 0.06, 0.08]} radius={0.012} position={[2.71, 0.24, -0.75]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <meshStandardMaterial color="#bca38f" roughness={0.82} />
      </RoundedBox>
      <mesh position={[0.26, 0.045, 0.98]} rotation={[-Math.PI / 2, 0, 0.08]} receiveShadow>
        <circleGeometry args={[1.46, 64]} />
        <meshStandardMaterial color="#b38ad1" roughness={0.86} transparent opacity={0.26} />
      </mesh>
      <mesh position={[0.1, 0.052, 0.78]} rotation={[-Math.PI / 2, 0, 0.08]} receiveShadow>
        <circleGeometry args={[0.84, 64]} />
        <meshStandardMaterial color="#fffaf3" roughness={0.86} transparent opacity={0.32} />
      </mesh>
    </group>
  );
}

function WindowView() {
  return (
    <group position={[1.15, 1.58, -2.485]}>
      <mesh position={[0, -0.18, 0.025]}>
        <circleGeometry args={[0.46, 32, 0, Math.PI]} />
        <meshBasicMaterial color="#9caf93" transparent opacity={0.38} />
      </mesh>
      <mesh position={[0.28, -0.17, 0.026]}>
        <circleGeometry args={[0.34, 32, 0, Math.PI]} />
        <meshBasicMaterial color="#7f9378" transparent opacity={0.36} />
      </mesh>
      {[-0.36, -0.16, 0.05, 0.28].map((offset, index) => (
        <RoundedBox
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          args={[0.08, 0.18 + index * 0.035, 0.015]}
          radius={0.006}
          position={[offset, -0.39 + index * 0.012, 0.032]}
        >
          <meshBasicMaterial color="#c2b4cf" transparent opacity={0.35} />
        </RoundedBox>
      ))}
      <mesh position={[-0.22, 0.28, 0.03]}>
        <circleGeometry args={[0.08, 24]} />
        <meshBasicMaterial color="#f4dcae" transparent opacity={0.52} />
      </mesh>
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
      <ShelfBooks />
    </group>
  );
}

function ShelfBooks() {
  return (
    <group position={[-2.42, 1.55, -2.32]} rotation={[0, 0.08, 0]}>
      {[
        ["#8f6aae", 0.16],
        ["#efe4f7", 0.12],
        ["#d0b8a2", 0.18],
      ].map(([color, height], index) => (
        <RoundedBox
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          args={[0.055, Number(height), 0.12]}
          radius={0.012}
          position={[index * 0.07, Number(height) / 2, 0]}
          castShadow
        >
          <meshStandardMaterial color={color as string} roughness={0.72} />
        </RoundedBox>
      ))}
    </group>
  );
}

function RightWallStudioCards() {
  return (
    <group position={[2.735, 1.53, -0.78]} rotation={[0, Math.PI / 2, 0]}>
      <RoundedBox args={[1.18, 1.48, 0.025]} radius={0.05} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#eadcca" roughness={0.88} />
      </RoundedBox>
      <Text
        position={[0, 0.58, 0.02]}
        fontSize={0.09}
        color="#6f4a8e"
        anchorX="center"
        anchorY="middle"
      >
        estudio Cath.
      </Text>
      <StudioCard label="research" position={[-0.28, 0.24, 0.03]} color="#f6f1eb" />
      <StudioCard label="IA" position={[0.26, 0.2, 0.03]} color="#e7d5ef" />
      <StudioCard label="web" position={[-0.02, -0.22, 0.03]} color="#fffaf3" />
      <group position={[0.34, -0.5, 0.04]}>
        {["#6f4a8e", "#b38ad1", "#eadcca", "#f8f5f0"].map((color, index) => (
          <mesh
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            position={[index * 0.09, 0, 0]}
          >
            <circleGeometry args={[0.033, 24]} />
            <meshStandardMaterial color={color} roughness={0.72} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function StudioCard({
  label,
  position,
  color,
}: {
  label: string;
  position: [number, number, number];
  color: string;
}) {
  return (
    <group position={position} rotation={[0, 0, -0.04]}>
      <RoundedBox args={[0.38, 0.24, 0.018]} radius={0.018} castShadow>
        <meshStandardMaterial color={color} roughness={0.78} />
      </RoundedBox>
      <Text position={[0, 0, 0.014]} fontSize={0.048} color="#6f4a8e" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
}

function ShelfPlant() {
  return (
    <group position={[-1.96, 1.66, -2.36]} rotation={[0, 0.08, 0]}>
      <RoundedBox args={[0.2, 0.025, 0.16]} radius={0.02} position={[0, 0.012, 0]} castShadow>
        <meshStandardMaterial color="#efe4d7" roughness={0.74} />
      </RoundedBox>
      <RoundedBox args={[0.16, 0.12, 0.14]} radius={0.025} position={[0, 0.085, 0]} castShadow>
        <meshStandardMaterial color="#9eaf87" roughness={0.74} />
      </RoundedBox>
      {[-0.1, -0.04, 0.04, 0.1].map((offset, index) => (
        <mesh
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          position={[offset * 0.85, 0.27, 0]}
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

function WallMoodboard({
  isHovered,
  onHover,
}: {
  isHovered: boolean;
  onHover: (isHovered: boolean) => void;
}) {
  const glowColor = isHovered ? "#b38ad1" : "#d9c4e8";

  return (
    <group
      position={[-0.38, 1.72, -2.49]}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
        onHover(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "auto";
        onHover(false);
      }}
    >
      <RoundedBox args={[1.0, 0.58, 0.025]} radius={0.025} position={[0, 0, 0]} castShadow>
        <meshStandardMaterial color="#f5f0ea" roughness={0.82} />
      </RoundedBox>
      <MoodPaper label="UX/UI" position={[-0.29, 0.14, 0.025]} color="#efe3f6" />
      <MoodPaper label="web" position={[0.11, 0.15, 0.026]} color="#fffaf3" />
      <MoodPaper label="marca" position={[-0.18, -0.13, 0.027]} color="#e7dccf" />
      <group position={[0.27, -0.12, 0.03]}>
        <RoundedBox args={[0.25, 0.18, 0.012]} radius={0.012} castShadow>
          <meshStandardMaterial color="#ffffff" roughness={0.7} />
        </RoundedBox>
        <mesh position={[-0.055, 0.035, 0.012]}>
          <boxGeometry args={[0.095, 0.018, 0.008]} />
          <meshStandardMaterial color="#b38ad1" roughness={0.7} />
        </mesh>
        <mesh position={[0.02, -0.018, 0.012]}>
          <boxGeometry args={[0.16, 0.018, 0.008]} />
          <meshStandardMaterial color="#d8c7e6" roughness={0.7} />
        </mesh>
      </group>
      {[-0.05, 0.04, 0.13].map((offset, index) => (
        <mesh
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          position={[0.4 + offset, 0.2, 0.035]}
        >
          <circleGeometry args={[0.035, 24]} />
          <meshStandardMaterial
            color={index === 0 ? "#8f6aae" : index === 1 ? "#c8a7da" : "#eaded1"}
            roughness={0.74}
          />
        </mesh>
      ))}
      {isHovered ? (
        <pointLight position={[0, 0.2, 0.35]} intensity={0.5} distance={1.25} color={glowColor} />
      ) : null}
    </group>
  );
}

function MoodPaper({
  label,
  position,
  color,
}: {
  label: string;
  position: [number, number, number];
  color: string;
}) {
  return (
    <group position={position} rotation={[0, 0, -0.035]}>
      <RoundedBox args={[0.25, 0.18, 0.012]} radius={0.012} castShadow>
        <meshStandardMaterial color={color} roughness={0.72} />
      </RoundedBox>
      <Text
        position={[0, 0, 0.012]}
        fontSize={0.042}
        color="#6f4a8e"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.22}
      >
        {label}
      </Text>
    </group>
  );
}

function DeskEditorialDetails({
  isCvHovered,
  onHoverCv,
}: {
  isCvHovered: boolean;
  onHoverCv: (isHovered: boolean) => void;
}) {
  return (
    <group>
      <group
        position={[1.32, 0.66, 0.43]}
        rotation={[0, -0.22, 0]}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
          onHoverCv(true);
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "auto";
          onHoverCv(false);
        }}
      >
        <RoundedBox args={[0.42, 0.035, 0.28]} radius={0.018} castShadow receiveShadow>
          <meshStandardMaterial color={isCvHovered ? "#efe4f7" : "#eadcca"} roughness={0.72} />
        </RoundedBox>
        <mesh position={[-0.08, 0.028, -0.02]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.16, 0.09]} />
          <meshBasicMaterial color="#8f6aae" transparent opacity={0.42} />
        </mesh>
        <Text
          position={[0.08, 0.033, 0.02]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.055}
          color="#6f4a8e"
          anchorX="center"
          anchorY="middle"
        >
          CV
        </Text>
      </group>

      <group position={[0.04, 0.66, 0.45]} rotation={[0, 0.1, 0]}>
        <RoundedBox args={[0.54, 0.018, 0.34]} radius={0.018} castShadow receiveShadow>
          <meshStandardMaterial color="#fffaf3" roughness={0.76} />
        </RoundedBox>
        <mesh position={[-0.12, 0.017, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.16, 0.22]} />
          <meshBasicMaterial color="#b38ad1" transparent opacity={0.52} />
        </mesh>
        <mesh position={[0.1, 0.018, 0.02]} rotation={[-Math.PI / 2, 0, 0.12]}>
          <planeGeometry args={[0.17, 0.18]} />
          <meshBasicMaterial color="#d8c7e6" transparent opacity={0.64} />
        </mesh>
      </group>

      <group position={[-0.03, 0.7, 0.84]} rotation={[0, -0.12, 0]}>
        <RoundedBox args={[0.28, 0.018, 0.2]} radius={0.012} castShadow>
          <meshStandardMaterial color="#f3e3a4" roughness={0.78} />
        </RoundedBox>
        <Text
          position={[0, 0.018, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.045}
          color="#6f4a8e"
          anchorX="center"
          anchorY="middle"
        >
          idea
        </Text>
      </group>

      <mesh position={[-0.15, 0.695, 0.1]} rotation={[Math.PI / 2, 0, -1.42]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.72, 16]} />
        <meshStandardMaterial color="#d5bfa9" roughness={0.58} />
      </mesh>
      <RoundedBox args={[0.44, 0.025, 0.18]} radius={0.03} position={[-0.75, 0.67, 0.22]} castShadow receiveShadow>
        <meshStandardMaterial color="#f6f1eb" roughness={0.74} />
      </RoundedBox>
    </group>
  );
}

function DeskLight() {
  return (
    <group position={[1.55, 0.62, 0.04]} rotation={[0, -0.2, 0]}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.42, 16]} />
        <meshStandardMaterial color="#c7a98f" roughness={0.62} />
      </mesh>
      <mesh position={[0.1, 0.44, -0.05]} rotation={[0.25, 0, -0.28]} castShadow>
        <cylinderGeometry args={[0.18, 0.25, 0.22, 4]} />
        <meshStandardMaterial color="#f6efe4" roughness={0.68} />
      </mesh>
      <mesh position={[0.08, 0.34, -0.05]} rotation={[-Math.PI / 2, 0, -0.2]}>
        <coneGeometry args={[0.34, 0.55, 32, 1, true]} />
        <meshBasicMaterial color="#fff0c8" transparent opacity={0.13} depthWrite={false} />
      </mesh>
      <pointLight position={[0.08, 0.33, -0.04]} intensity={0.58} distance={1.65} color="#ffe6b8" />
      <RoundedBox args={[0.28, 0.035, 0.2]} radius={0.03} position={[0, 0.02, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#eadcca" roughness={0.72} />
      </RoundedBox>
    </group>
  );
}

function ColorStudyTray() {
  return (
    <group position={[-0.85, 0.68, 0.5]} rotation={[0, 0.18, 0]}>
      <RoundedBox args={[0.52, 0.024, 0.3]} radius={0.026} castShadow receiveShadow>
        <meshStandardMaterial color="#f5eee8" roughness={0.74} />
      </RoundedBox>
      {[
        ["#6f4a8e", -0.16],
        ["#b38ad1", -0.04],
        ["#d8c7e6", 0.08],
        ["#eadcca", 0.2],
      ].map(([color, x]) => (
        <RoundedBox
          key={color}
          args={[0.085, 0.018, 0.17]}
          radius={0.018}
          position={[Number(x), 0.024, 0]}
          castShadow
        >
          <meshStandardMaterial color={color as string} roughness={0.76} />
        </RoundedBox>
      ))}
    </group>
  );
}

function PersonalDetails() {
  return (
    <group>
      <group position={[-1.34, 0.08, 1.56]} rotation={[0, 0.32, 0]}>
        <RunningShoe position={[-0.09, 0, 0]} rotation={[-0.08, 0.18, 0.05]} />
        <RunningShoe position={[0.15, 0, 0.03]} rotation={[0.04, -0.24, -0.05]} />
      </group>
      <group position={[1.82, 0.065, 0.98]} rotation={[-Math.PI / 2, 0, -0.18]}>
        <RoundedBox args={[0.42, 0.3, 0.014]} radius={0.018} castShadow receiveShadow>
          <meshStandardMaterial color="#f7f0e8" roughness={0.78} />
        </RoundedBox>
        <mesh position={[0, 0.02, 0.01]}>
          <circleGeometry args={[0.14, 24, 0, Math.PI]} />
          <meshBasicMaterial color="#8fa184" transparent opacity={0.64} />
        </mesh>
        <mesh position={[0.12, 0.02, 0.012]}>
          <circleGeometry args={[0.1, 24, 0, Math.PI]} />
          <meshBasicMaterial color="#b7c2a8" transparent opacity={0.72} />
        </mesh>
      </group>
    </group>
  );
}

function RunningShoe({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <RoundedBox args={[0.22, 0.075, 0.11]} radius={0.03} position={[0, 0.06, 0]} castShadow>
        <meshStandardMaterial color="#f7f1eb" roughness={0.72} />
      </RoundedBox>
      <RoundedBox args={[0.24, 0.025, 0.12]} radius={0.02} position={[0.02, 0.03, 0]} castShadow>
        <meshStandardMaterial color="#d8c7e6" roughness={0.78} />
      </RoundedBox>
      <mesh position={[0.02, 0.09, 0.058]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.045, 0.004, 8, 18, Math.PI]} />
        <meshStandardMaterial color="#8f6aae" roughness={0.7} />
      </mesh>
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

function prepareReferenceOfficeModel(scene: Object3D) {
  const model = scene.clone(true);

  model.traverse((child) => {
    child.castShadow = true;
    child.receiveShadow = true;

    if (!("isMesh" in child)) return;

    const mesh = child as Mesh;
    const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    if (sourceMaterials.some((material) => material.name.toLowerCase().includes("silla"))) {
      mesh.userData.isInteractiveChair = true;
      mesh.userData.basePosition = mesh.position.clone();
      mesh.userData.baseRotationY = mesh.rotation.y;
    }
    if (sourceMaterials.some((material) => material.name.toLowerCase().includes("superficie"))) {
      mesh.visible = false;
      return;
    }

    const styledMaterials = sourceMaterials.map((material) => {
      const materialName = material.name.toLowerCase();
      const color =
        materialName.includes("pared")
          ? "#eaded0"
          : materialName.includes("interruptor")
            ? "#272326"
          : materialName.includes("superficie")
            ? "#d7c0a8"
            : materialName.includes("madera")
              ? "#b9977e"
              : materialName.includes("silla")
                ? "#b9a7c8"
                : materialName.includes("hojas")
                  ? "#879d78"
                  : materialName.includes("cuadro")
                    ? "#b38ad1"
                    : materialName.includes("ventana")
                      ? "#f7f1eb"
                      : materialName.includes("pantalla") || materialName.includes("negro")
                        ? "#272326"
                        : materialName.includes("papel") || materialName.includes("blanco")
                          ? "#f7efe5"
                          : "#d8c4b1";

      return new MeshStandardMaterial({
        color,
        roughness: materialName.includes("pantalla") ? 0.55 : 0.82,
        metalness: materialName.includes("metal") ? 0.08 : 0.02,
        emissive: materialName.includes("cuadro") ? "#6f4a8e" : "#000000",
        emissiveIntensity: materialName.includes("cuadro") ? 0.05 : 0,
      });
    });

    mesh.material = Array.isArray(mesh.material) ? styledMaterials : styledMaterials[0];
  });

  const box = new Box3();
  const center = new Vector3();

  model.updateMatrixWorld(true);
  model.traverse((child) => {
    if ("isMesh" in child && child.visible) {
      box.expandByObject(child);
    }
  });
  box.getCenter(center);
  model.position.set(-center.x, -box.min.y, -center.z);

  return model;
}

useGLTF.preload("/models/oficina-reference.glb");
useGLTF.preload("/models/cat-tree.glb");
useGLTF.preload("/models/desk.glb");
useGLTF.preload("/models/digital-setup.glb");
