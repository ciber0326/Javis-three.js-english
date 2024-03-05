import React from "react";
import { Canvas, CanvasProps, addEffect } from "@react-three/fiber";
import { Preload, View } from "@react-three/drei";
import Lenis from "@studio-freight/lenis";
import { CameraRig } from "../canvas/CameraRig";

// LenisでSmoothなScroll
// const lenis = new Lenis({ syncTouch: true });
// addEffect((t) => lenis.raf(t));

interface SceneProps extends CanvasProps {
  style?: React.CSSProperties;
}
export const Scene = ({ style, ...props }: SceneProps) => {
  return (
    <Canvas
      shadows
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        ...style,
      }}
      eventSource={document.body}
      eventPrefix="client"
      {...props}
    >
      <Preload all />
      <View.Port />
    </Canvas>
  );
};
