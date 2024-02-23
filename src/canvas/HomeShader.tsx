import React, { lazy, Suspense, useMemo } from "react";
import { View } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

import { ShaderMaterial, Vector2 } from "three";
import CyberFragment from "../glsl/cyber.frag";

// const View = lazy(() =>
//   import("@react-three/drei").then((module) => ({ default: module.View }))
// );

type HomeShaderProps = {
  children?: React.ReactNode;
};
export const HomeShader = ({ children }: HomeShaderProps) => {
  return (
    <Suspense fallback={null}>
      {/** @ts-ignore */}
      <View className="h-full w-full">
        {children}
        <ShaderComponent />
        {/* <OrbitControls /> */}
        <ambientLight intensity={0.5} />
      </View>
    </Suspense>
  );
};

const ShaderComponent = () => {
  const ref = React.useRef<ShaderMaterial>(null);
  const viewport = useThree((state) => state.viewport);

  const resolution = useMemo(
    () => [viewport.width, viewport.height],
    [viewport.width, viewport.height]
  );

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uniforms.iTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <boxGeometry args={[viewport.width, viewport.height]} />
      {/* <shaderMaterial
        ref={ref}
        fragmentShader={CyberFragment}
        uniforms={
          {
            iTime: { value: 0 },
            iResolution: { value: new Vector2(...resolution) },
          } as any
        }
      /> */}
      <meshStandardMaterial color="red" />
    </mesh>
  );
};
