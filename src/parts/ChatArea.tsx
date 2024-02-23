import React, { lazy, Suspense } from "react";
import { SandboxBackground } from "./ChatBackground";
import { Messages } from "./Messages";
// import { View } from "@react-three/drei";
import SceneItems from "../canvas/SceneItems";

const View = lazy(() =>
  import("@react-three/drei").then((module) => ({ default: module.View }))
);

export const ChatArea = () => {
  return (
    <div className="w-full h-full">
      <Messages />
      <Suspense fallback={null}>
        {/** @ts-ignore */}
        {/* <View className="z-90 select-none h-full w-full">
          <SceneItems />
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="red" />
          </mesh>
        </View> */}
      </Suspense>
      <SandboxBackground />
    </div>
  );
};
