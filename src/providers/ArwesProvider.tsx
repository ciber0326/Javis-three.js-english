import React, { ReactElement, Suspense, useState } from "react";
import {
  Animator,
  type AnimatorGeneralProviderSettings,
  AnimatorGeneralProvider,
  type BleepsProviderSettings,
  BleepsProvider,
  createAppTheme,
  createAppStylesBaseline,
  Text,
} from "@arwes/react";
import { type CSSObject, Global } from "@emotion/react";

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
      {show ? (
        children
      ) : (
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
            background: "black",
            color: "white",
            fontSize: "24px",
          }}
        >
          {/** StartButton */}
          <div>
            <button onClick={onStart}>
              <Text as="span" style={{ fontSize: "24px" }}>
                Start
              </Text>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
