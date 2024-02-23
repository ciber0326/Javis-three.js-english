import React, { lazy, Suspense } from "react";
import { CameraRig } from "./CameraRig";
import { Effects } from "./Effects";
import { ArcReactor } from "./ArcReactor";

const View = lazy(() =>
  import("@react-three/drei").then((module) => ({ default: module.View }))
);

export default function Scene() {
  return (
    <Suspense fallback={null}>
      {/** @ts-ignore */}
      <View className="h-full w-full">
        {/* <ambientLight intensity={0.5} /> */}
        <ArcReactor scale={0.2} />
        <Effects />
      </View>
    </Suspense>
  );
}
