import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { PointLight } from "three";

/**
 * Pointerによって光源の位置を変更する
 */
export const PointerLight = () => {
  const ref = useRef<PointLight>(null);

  useFrame(({ viewport, pointer }) => {
    if (ref.current) {
      ref.current.position.set(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        5.5
      );
    }
  });

  return <pointLight ref={ref} intensity={20} color={"gold"} />;
};
