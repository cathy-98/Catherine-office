"use client";

import { Suspense } from "react";
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
        camera={{ position: [0.25, 3.05, 6.35], fov: 40 }}
        shadows
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#e6d8c9"]} />
        <fog attach="fog" args={["#e6d8c9", 10, 18]} />
        <ambientLight intensity={0.5} />
        <hemisphereLight args={["#fff3df", "#8f6aae", 0.42]} />
        <directionalLight
          position={[-2.2, 5.6, 4.2]}
          intensity={1.45}
          castShadow
          shadow-camera-far={14}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-2.8, 2.3, 2]} intensity={0.35} color="#b78cd3" />
        <pointLight position={[2.65, 1.9, -1.6]} intensity={0.85} color="#fff0d8" />
        <spotLight
          position={[2.9, 3.1, 0.4]}
          angle={0.48}
          penumbra={0.7}
          intensity={0.45}
          color="#fff4df"
        />

        <CameraController activeObject={activeObject} />
        <Suspense fallback={null}>
          <OfficeScene
            activeObject={activeObject}
            hoveredObject={hoveredObject}
            onHoverObject={onHoverObject}
            onSelectObject={onSelectObject}
          />
        </Suspense>
        <Environment preset="apartment" />
      </Canvas>
      <Tooltip object={hoveredObject} />
    </div>
  );
}
