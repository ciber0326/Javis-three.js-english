import React from "react";
import { Vector3 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";

const dumpVec3 = new Vector3();
type CameraRigProps = {
  xRange?: number;
  yRange?: number;
};
export const CameraRig = (
  { xRange = 0.1, yRange = 0.1 }: CameraRigProps
) => {
  const { camera } = useThree();
  dumpVec3.copy(camera.position.clone())
  const { x, y, z } = dumpVec3;
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [
        x + (state.pointer.x * state.viewport.width) * xRange,
        y + (state.pointer.y * state.viewport.height) * yRange,
        z,
      ],
      0.25,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });
  return <></>;
};
