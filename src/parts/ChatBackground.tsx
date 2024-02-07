import React, { Suspense, useState, useEffect } from "react";
import { Animator } from "@arwes/react-animator";
import { GridLines, Dots, MovingLines } from "@arwes/react-bgs";

export const SandboxBackground = () => {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const iid = setInterval(() => setActive((active) => !active), 3000);
    return () => clearInterval(iid);
  }, []);

  return (
    <Animator active={active} duration={{ enter: 2, exit: 2 }}>
      <GridLines lineColor="hsla(180, 100%, 75%, 0.05)" distance={30} />
      <Dots color="hsla(180, 100%, 75%, 0.05)" distance={30} />
      <MovingLines
        lineColor="hsla(180, 100%, 75%, 0.07)"
        distance={30}
        sets={40}
      />
    </Animator>
  );
};
