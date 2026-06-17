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
    const subtleDrift = new Vector3(pointer.x * 0.12, pointer.y * 0.08, 0);
    const targetPosition = activeObject
      ? new Vector3(...activeObject.focusPosition)
      : defaultPosition.clone().add(subtleDrift);

    camera.position.lerp(targetPosition, 0.045);

    const lookAtTarget = activeObject
      ? new Vector3(...activeObject.position).add(new Vector3(0, 0.45, 0))
      : defaultTarget.clone().add(new Vector3(Math.sin(elapsed * 0.25) * 0.08, 0, 0));

    if (controlsRef.current) {
      controlsRef.current.target.lerp(lookAtTarget, 0.06);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={false}
      enableRotate
      minPolarAngle={Math.PI / 3.6}
      maxPolarAngle={Math.PI / 2.15}
      rotateSpeed={0.22}
    />
  );
}
