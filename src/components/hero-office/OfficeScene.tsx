"use client";

import { MeshReflectorMaterial, RoundedBox } from "@react-three/drei";
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
          color="#eee7dd"
          roughness={0.78}
          metalness={0.05}
          blur={[320, 120]}
          mixBlur={0.45}
          mixStrength={0.12}
          mirror={0.08}
        />
      </mesh>

      <RoundedBox args={[4.7, 0.28, 2.35]} radius={0.08} position={[0, 0.36, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f4eee5" roughness={0.72} />
      </RoundedBox>
      <RoundedBox args={[0.18, 0.85, 0.18]} radius={0.04} position={[-2.05, -0.1, -0.82]} castShadow>
        <meshStandardMaterial color="#c9b8a8" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[0.18, 0.85, 0.18]} radius={0.04} position={[2.05, -0.1, -0.82]} castShadow>
        <meshStandardMaterial color="#c9b8a8" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[0.18, 0.85, 0.18]} radius={0.04} position={[-2.05, -0.1, 0.82]} castShadow>
        <meshStandardMaterial color="#c9b8a8" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[0.18, 0.85, 0.18]} radius={0.04} position={[2.05, -0.1, 0.82]} castShadow>
        <meshStandardMaterial color="#c9b8a8" roughness={0.7} />
      </RoundedBox>

      <mesh position={[0, 1.75, -2.05]} receiveShadow>
        <boxGeometry args={[5.4, 3.1, 0.12]} />
        <meshStandardMaterial color="#f7f3ed" roughness={0.85} />
      </mesh>

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
