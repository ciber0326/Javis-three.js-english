import React, { lazy, Suspense, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";

import { ShaderMaterial, Vector2 } from "three";
import FulidVertex from "../glsl/fulid.vert";
import FulidFragment from "../glsl/fulid.frag";

const View = lazy(() =>
  import("@react-three/drei").then((module) => ({ default: module.View }))
);

type HomeShaderProps = {
  children?: React.ReactNode;
};
export const HomeShader = ({ children }: HomeShaderProps) => {
  return (
    <Suspense fallback={null}>
      {/** @ts-ignore */}
      <View className="h-full w-full">
        {children}
        {/* <ShaderComponent /> */}
        <PlaneComponent />
        {/* <OrbitControls /> */}
        <ambientLight intensity={0.5} />
      </View>
    </Suspense>
  );
};

/**
 * ナビエ・ストークス方程式
 * ∂u/∂t = - (u・∇)u - ∇p + v∇²u + F
 *²
 * F: 外力     : マウスの動き
 * u: 流体速度
 * p: 圧力
 * v: 粘性項   : 30固定 (高ければ高いほど粘性)
 * t: 時間
 *
 * ∇⋅u=0 とする:   流体の流入と流出が同じになる
 * Δt=1/60 とする: 1秒間に60回更新される
 *
 * @step1: 外力項を求める
 * @step2: 流体の流れを求める
 * @step3: 粘性を求める
 * @step4: 流体が互いに押し合う力を求める
 *
 */
const F = new Vector2(0, 0);
const ShaderComponent = () => {
  const ref = React.useRef<ShaderMaterial>(null);
  const prevPointer = React.useRef({ x: 0, y: 0 });
  const viewport = useThree((state) => state.viewport);

  useFrame(({ clock, pointer }) => {
    // Step1: fを差分で更新
    const _x = pointer.x - prevPointer.current.x;
    const _y = pointer.y - prevPointer.current.y;
    F.set(_x, _y);
    prevPointer.current = {
      x: pointer.x,
      y: pointer.y,
    };

    if (ref.current) {
      ref.current.uniforms.uTime.value = clock.getElapsedTime();
      ref.current.uniforms.F.value = F;
      ref.current.uniforms.resolution.value = viewport.height / viewport.width;
    }
  });

  const uniforms = {
    // キャンパス用
    resolution: {
      value: viewport.height / viewport.width,
    },
    pxNum: {
      value: 16,
    },
    // F: 外力
    F: {
      value: F,
    },
    // 時間
    uTime: {
      value: 0,
    },
  };

  return (
    <mesh scale={1.1}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={ref}
        vertexShader={FulidVertex}
        fragmentShader={FulidFragment}
        uniforms={uniforms}
      />
    </mesh>
  );
};

const PlaneComponent = () => {
  const viewport = useThree((state) => state.viewport);

  return (
    <mesh scale={1.1} receiveShadow>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <meshStandardMaterial color="#1e1e1e" />
    </mesh>
  );
};