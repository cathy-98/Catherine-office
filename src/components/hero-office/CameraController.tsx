"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { OrbitControls } from "@react-three/drei";
import type { OfficeObject } from "@/types/office";
import { CAMERA_DEFAULT_POSITION, CAMERA_DEFAULT_TARGET } from "@/lib/constants";

type CameraControllerProps = {
  activeObject: OfficeObject | null;
};

const defaultPosition = new Vector3(...CAMERA_DEFAULT_POSITION);
const defaultTarget = new Vector3(...CAMERA_DEFAULT_TARGET);

export function CameraController({ activeObject }: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera, pointer } = useThree();

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    if (activeObject) {
      camera.position.lerp(new Vector3(...activeObject.focusPosition), 0.045);
    }

    const lookAtTarget = activeObject
      ? new Vector3(...activeObject.position).add(new Vector3(0, 0.45, 0))
      : defaultTarget
          .clone()
          .add(new Vector3(pointer.x * 0.08 + Math.sin(elapsed * 0.25) * 0.05, pointer.y * 0.04, 0));

    if (controlsRef.current) {
      controlsRef.current.target.lerp(lookAtTarget, 0.06);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom
      enableRotate
      autoRotate={!activeObject}
      autoRotateSpeed={0.16}
      dampingFactor={0.08}
      enableDamping
      minDistance={4.8}
      maxDistance={8.4}
      minPolarAngle={Math.PI / 3.4}
      maxPolarAngle={Math.PI / 2.03}
      rotateSpeed={0.36}
      zoomSpeed={0.45}
    />
  );
}
