import React, { lazy } from "react";
import { Canvas } from "@react-three/offscreen";

const Scene = lazy(() => import("./Scene"));

const worker = new Worker(new URL("./worker.jsx", import.meta.url), {
  type: "module",
});

type OCanvasProps = {
  className?: string;
};
export const OCanvas = ({ className }: OCanvasProps) => {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 52 }}
        worker={worker}
        fallback={<Scene />}
        // transparent
        gl={{ alpha: true }}
      ></Canvas>
    </div>
  );
};
