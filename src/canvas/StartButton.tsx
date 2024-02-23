import React from "react";
import { useThree } from "@react-three/fiber";
import { Text3D, useFont, useCursor, MeshTransmissionMaterial } from "@react-three/drei";
import { Group } from "three";
import { useColorStore } from "../store";

type StartButtonProps = {
  onClick: () => void;
};
export const StartButton = ({ onClick }: StartButtonProps) => {
  const ref = React.useRef<Group>(null);
  const viewport = useThree((state) => state.viewport);
  const font = useFont("/fonts/RussoOne.json");

  const { color } = useColorStore();

  // @ts-ignore
  useCursor(ref);

  return (
    <group ref={ref} onClick={onClick} scale={viewport.width / 10} position-z={2}>
      <Text3D font={font.data} position={[-2.5, -0.5, 0]}>
        {"JARVIS"}
        <MeshTransmissionMaterial backside backsideThickness={10} thickness={5} />
      </Text3D>
      <Text3D font={font.data} scale={0.2} position={[-1.2, -0.95, 0]}>
        {"CLICK TO START"}
        {/** 光沢感を出す */}
        <meshPhongMaterial 
          color={color} 
          // metalness={0.5}
          // roughness={0.5}
          // envMapIntensity={1}
          // clearcoat={1}
        />
      </Text3D>
    </group>
  );
};

useFont.preload("/fonts/RussoOne.json");
