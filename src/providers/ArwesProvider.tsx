import React, { ReactElement } from "react";
import {
  Animator,
  type AnimatorGeneralProviderSettings,
  AnimatorGeneralProvider,
  BleepsOnAnimator,
  type BleepsProviderSettings,
  BleepsProvider,
  Animated,
  FrameSVGCorners,
  aa,
  aaVisibility,
  useBleeps,
  createAppTheme,
  createAppStylesBaseline,

  Text
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
          <Animator active={true} combine manager="stagger">
            {children}
          </Animator>
        </BleepsProvider>
      </AnimatorGeneralProvider>
    </>
  );
};
