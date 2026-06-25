"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { OrbitControls } from "@react-three/drei";
import type { OfficeObject } from "@/types/office";
import { CAMERA_DEFAULT_POSITION, CAMERA_DEFAULT_TARGET } from "@/lib/constants";

type CameraControllerProps = {
  activeObject: OfficeObject | null;
  isPanelOpen: boolean;
};

const defaultPosition = new Vector3(...CAMERA_DEFAULT_POSITION);
const defaultTarget = new Vector3(...CAMERA_DEFAULT_TARGET);

export function CameraController({ activeObject, isPanelOpen }: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera, pointer } = useThree();
  const prefersReducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    if (activeObject) {
      camera.position.lerp(new Vector3(...activeObject.focusPosition), 0.045);
    }

    const lookAtTarget = activeObject
      ? new Vector3(...activeObject.position).add(new Vector3(0, 0.45, 0))
      : defaultTarget
          .clone()
          .add(
            prefersReducedMotion || isPanelOpen
              ? new Vector3(0, 0, 0)
              : new Vector3(pointer.x * 0.06 + Math.sin(elapsed * 0.22) * 0.035, pointer.y * 0.03, 0),
          );

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
      autoRotate={!activeObject && !isPanelOpen && !prefersReducedMotion}
      autoRotateSpeed={0.1}
      dampingFactor={0.08}
      enableDamping
      minDistance={3.2}
      maxDistance={9.2}
      minPolarAngle={Math.PI / 4.2}
      maxPolarAngle={Math.PI / 1.92}
      rotateSpeed={0.62}
      zoomSpeed={0.62}
    />
  );
}
