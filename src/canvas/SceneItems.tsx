import React, { lazy, Suspense, memo } from "react";
import { Effects } from "./Effects";
import { ArcReactor } from "./ArcReactor";

const View = lazy(() =>
  import("@react-three/drei").then((module) => ({ default: module.View }))
);

function Scene() {
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

export const SceneView =  memo(Scene);
