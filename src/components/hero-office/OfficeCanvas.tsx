"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import type { OfficeObject } from "@/types/office";
import { OfficeScene } from "./OfficeScene";
import { CameraController } from "./CameraController";
import { Tooltip } from "./Tooltip";

type OfficeCanvasProps = {
  activeObject: OfficeObject | null;
  hoveredObject: OfficeObject | null;
  onHoverObject: (object: OfficeObject | null) => void;
  onSelectObject: (object: OfficeObject) => void;
};

export function OfficeCanvas({
  activeObject,
  hoveredObject,
  onHoverObject,
  onSelectObject,
}: OfficeCanvasProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 3.2, 7.2], fov: 42 }}
        shadows
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#f8f5f0"]} />
        <fog attach="fog" args={["#f8f5f0", 7, 13]} />
        <ambientLight intensity={1.65} />
        <directionalLight
          position={[2.5, 5, 3.5]}
          intensity={2.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-3, 2.5, 2]} intensity={0.65} color="#c9a8dc" />

        <CameraController activeObject={activeObject} />
        <OfficeScene
          activeObject={activeObject}
          hoveredObject={hoveredObject}
          onHoverObject={onHoverObject}
          onSelectObject={onSelectObject}
        />
        <Environment preset="apartment" />
      </Canvas>
      <Tooltip object={hoveredObject} />
    </div>
  );
}
