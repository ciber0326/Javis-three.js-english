import React from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

export const Effects = () => {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} height={300} />
    </EffectComposer>
  );
};
