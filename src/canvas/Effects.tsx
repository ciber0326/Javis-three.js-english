import React, { Suspense } from "react";
import { Bloom, EffectComposer, Noise } from "@react-three/postprocessing";

export const Effects = () => {
  return (
    <Suspense fallback={null}>
      <EffectComposer disableNormalPass>
        <Noise opacity={0.1} />
        <Bloom luminanceThreshold={0.2} mipmapBlur luminanceSmoothing={0} intensity={1.45} />
      </EffectComposer>
    </Suspense>
  );
};
