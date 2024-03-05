import React, { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Text3D,
  useFont,
  useCursor,
  MeshTransmissionMaterial,
  Float,
} from "@react-three/drei";
import { DoubleSide, Group } from "three";
import { useColorStore } from "../store";
import {
  Geometry,
  Base,
  Addition,
  Subtraction,
  CSGGeometryRef,
} from "@react-three/csg";
import { TextGeometry } from "three-stdlib";

type StartButtonProps = {
  onClick: () => void;
};
export const StartButton = ({ onClick }: StartButtonProps) => {
  const ref = React.useRef<Group>(null);
  const csg = React.useRef<CSGGeometryRef>(null);
  const grp = React.useRef<Group>(null);
  const viewport = useThree((state) => state.viewport);
  const font = useFont("/fonts/RussoOne.json");
  const [geometry, setGeometry] = React.useState<TextGeometry|null>(null);

  const { color } = useColorStore();

  // @ts-ignore
  useCursor(ref);

  useEffect(() => {
    if (font.data && !geometry) {
      const geometry = new TextGeometry("JARVIS", {
        font: font,
        size: 1,
        height: 0.5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
      });
      setGeometry(geometry);
    }
  }, [font]);

  // useFrame(({ pointer }) => {
  //   if (csg.current && grp.current) {
  //     csg.current.update();
  //     // grp.current.rotation.z = pointer.x / viewport.width;
  //     grp.current.position.set(
  //       (pointer.x * viewport.width) / 2,
  //       (pointer.y * viewport.height) / 2,
  //       0
  //     );
  //   }
  // });

  return (
    <Float speed={5} floatingRange={[0.2, 0.3]} floatIntensity={0.1} rotationIntensity={0.1}>
      <group
        ref={ref}
        onClick={onClick}
        scale={viewport.width / 10}
        position-z={1}
      >
        <mesh receiveShadow castShadow>
          <Geometry ref={csg} useGroups>
            {geometry && (
              <Base scale={1} position={[-2.5, -0.5, 0]} geometry={geometry}>
                <MeshTransmissionMaterial
                  backside
                  samples={8}
                  resolution={512}
                  thickness={0.3}
                  roughness={0.2}
                  anisotropy={1}
                  chromaticAberration={0.2}
                />
              </Base>
            )}
            <Subtraction position={[0, 0, 0.1]}>
              <sphereGeometry args={[0.4, 32, 32]} />
              <meshStandardMaterial color="red" side={DoubleSide} />
            </Subtraction>
            <Subtraction position={[2, 0.5, 0.1]}>
              <sphereGeometry args={[0.4, 32, 32]} />
              <meshStandardMaterial color="red" side={DoubleSide} />
            </Subtraction>
            <Subtraction position={[-2, -0.5, -0.1]}>
              <sphereGeometry args={[0.6, 32, 32]} />
              <meshStandardMaterial color="red" side={DoubleSide} />
            </Subtraction>
            <Subtraction position={[-0.8, 0, -0.3]}>
              <sphereGeometry args={[0.42, 32, 32]} />
              <meshStandardMaterial color="#e8383d" side={DoubleSide} />
            </Subtraction>
            <Subtraction position={[0.8, -0.6, -0.3]}>
              <sphereGeometry args={[0.62, 32, 32]} />
              <meshStandardMaterial color="#e8383d" side={DoubleSide} />
            </Subtraction>
          </Geometry>
        </mesh>
        <Text3D font={font.data} scale={0.2} position={[-1.2, -0.95, 0]}>
          {"CLICK TO START"}
          {/** 光沢感を出す */}
          <meshPhongMaterial
            color={"gold"}
          />
        </Text3D>
      </group>
    </Float>
  );
};

useFont.preload("/fonts/RussoOne.json");
