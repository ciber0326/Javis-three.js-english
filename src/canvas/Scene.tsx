import React from "react";
import { OrbitControls } from "@react-three/drei";
import { CameraRig } from "./CameraRig";
import { Effects } from "./Effects";
import { ArcReactor } from "./ArcReactor";

export default function Scene() {
  return (
    <>
      {/* <ambientLight intensity={0.5} /> */}
      <ArcReactor scale={0.2} />
      <Effects />
      <CameraRig />
    </>
  );
}
