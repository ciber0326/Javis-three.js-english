import React, { ReactElement, Suspense, useState } from "react";
import {
  Animator,
  type AnimatorGeneralProviderSettings,
  AnimatorGeneralProvider,
  type BleepsProviderSettings,
  BleepsProvider,
  createAppTheme,
  createAppStylesBaseline,
} from "@arwes/react";
import { type CSSObject, Global } from "@emotion/react";
import { HomeShader } from "../canvas/HomeShader";
import SceneItems from "../canvas/SceneItems";
import { StartButton } from "../canvas/StartButton";
import { CameraRig } from "../canvas/CameraRig";
import { SoftShadows } from "@react-three/drei";
import { PointerLight } from "../canvas/PointerLight";

const theme = createAppTheme();
const stylesBaseline = createAppStylesBaseline(theme);

const animatorsSettings: AnimatorGeneralProviderSettings = {
  duration: {
    enter: 0.2,
    exit: 0.2,
    stagger: 0.04,
  },
};

const bleepsSettings: BleepsProviderSettings = {
  master: {
    volume: 0.9,
  },
  bleeps: {
    intro: {
      sources: [
        {
          src: "https://arwes.dev/assets/sounds/intro.mp3",
          type: "audio/mpeg",
        },
      ],
    },
    click: {
      sources: [
        {
          src: "https://arwes.dev/assets/sounds/click.mp3",
          type: "audio/mpeg",
        },
      ],
    },
  },
};

type ArwesProviderProps = {
  children: React.ReactNode;
};
export const ArwesProvider = ({ children }: ArwesProviderProps) => {
  return (
    <>
      <Global styles={stylesBaseline as Record<string, CSSObject>} />
      <AnimatorGeneralProvider {...animatorsSettings}>
        <BleepsProvider {...bleepsSettings}>
          <StartScreen>
            <Suspense>
              <Animator active={true} combine manager="stagger">
                {children}
              </Animator>
            </Suspense>
          </StartScreen>
        </BleepsProvider>
      </AnimatorGeneralProvider>
    </>
  );
};

type StartScreenProps = {
  children: React.ReactNode;
};
const StartScreen = (
  props: StartScreenProps
): ReactElement<StartScreenProps> => {
  const { children } = props;
  const [show, setShow] = useState(false);

  const onStart = () => {
    setShow(true);
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
        }}
      >
        {show ? (
          <>
            <div>{children}</div>
            <SceneItems />
          </>
        ) : (
          <>
            {/** StartButton */}
            <HomeShader>
              <StartButton onClick={onStart} />
              <CameraRig />
              <PointerLight />
              <fog attach="fog" args={["black", 0, 14]} />
              <pointLight position={[10, -10, -20]} intensity={10} />
              <pointLight position={[-10, -10, -20]} intensity={10} />
              <SoftShadows samples={3} />
            </HomeShader>
          </>
        )}
      </div>
    </>
  );
};
