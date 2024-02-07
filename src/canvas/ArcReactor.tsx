import React, { Suspense, useRef } from "react";
import { GroupProps, useFrame } from "@react-three/fiber";
import { useCursor, useGLTF } from "@react-three/drei";
import HolographicMaterial from "./Materials/HolographicMaterial";
import { Group } from "three";

export const ArcReactor = ({
  ...props
}: GroupProps & { children?: React.ReactNode }) => {
  const ref = useRef<Group>(null);
  const zSpeed = useRef(0.1);
  const { nodes } = useGLTF("arc_reactor.glb");

  // @ts-ignore
  useCursor(ref);

  useFrame(({}) => {
    // z軸を回転
    if (ref.current) {
      ref.current.rotation.z += zSpeed.current * 0.05;
    }
    // 0.1以上の場合は、減衰させる
    if (zSpeed.current > 0.1) {
      zSpeed.current -= 0.002;
    } else {
      zSpeed.current = 0.1;
    }
  });

  return (
    <Suspense fallback={null}>
      <group
        ref={ref}
        {...props}
        dispose={null}
        onClick={() => {
          if (zSpeed.current < 5) {
            zSpeed.current += 0.5;
          }
        }}
        // 右クリックで0.1に戻す
        onDoubleClick={(e) => {
          zSpeed.current = 0.1;
        }}
      >
        <mesh
          // @ts-ignore
          geometry={nodes.Object_2.geometry}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <HolographicMaterial
            fresnelAmount={0.35}
            fresnelOpacity={0.5}
            scanlineSize={6.0}
            hologramBrightness={0.6}
            enableBlinking={false}
            blinkFresnelOnly={false}
            enableAdditive={true}
            hologramOpacity={0.75}
            hologramColor="#2beded"
          />
        </mesh>
      </group>
    </Suspense>
  );
};
