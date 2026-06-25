"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from "three";
import type { OfficeObject } from "@/types/office";
import { OfficeScene } from "./OfficeScene";
import { CameraController } from "./CameraController";
import { Tooltip } from "./Tooltip";

type OfficeCanvasProps = {
  activeObject: OfficeObject | null;
  hoveredObject: OfficeObject | null;
  isHinting: boolean;
  onHoverObject: (object: OfficeObject | null) => void;
  onSelectObject: (object: OfficeObject) => void;
  onSceneReady: () => void;
};

export function OfficeCanvas({
  activeObject,
  hoveredObject,
  isHinting,
  onHoverObject,
  onSelectObject,
  onSceneReady,
}: OfficeCanvasProps) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0.55, 2.9, 6.65], fov: 38 }}
        shadows
        dpr={activeObject ? [1, 1.25] : [1, 1.8]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = SRGBColorSpace;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
          gl.shadowMap.type = PCFSoftShadowMap;
        }}
      >
        <color attach="background" args={["#eadfce"]} />
        <fog attach="fog" args={["#eadfce", 10, 18]} />
        <ambientLight intensity={0.42} />
        <hemisphereLight args={["#fff4e4", "#8f6aae", 0.46]} />
        <directionalLight
          position={[-2.2, 5.6, 4.2]}
          intensity={1.55}
          castShadow
          shadow-camera-far={14}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-2.8, 2.3, 2]} intensity={0.5} color="#b78cd3" />
        <pointLight position={[2.65, 1.9, -1.6]} intensity={0.8} color="#ffe8ca" />
        <spotLight
          position={[2.9, 3.1, 0.4]}
          angle={0.48}
          penumbra={0.7}
          intensity={0.45}
          color="#fff4df"
        />

        <CameraController activeObject={activeObject} isPanelOpen={Boolean(activeObject)} />
        <Suspense fallback={null}>
          <OfficeScene
            activeObject={activeObject}
            hoveredObject={hoveredObject}
            isHinting={isHinting}
            onHoverObject={onHoverObject}
            onSelectObject={onSelectObject}
            onSceneReady={onSceneReady}
          />
        </Suspense>
        <Environment preset="apartment" />
      </Canvas>
      <Tooltip object={hoveredObject} />
    </div>
  );
}
