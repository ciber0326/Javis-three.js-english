import React from "react";
import { useUserStore } from "../store";
import { SandboxBackground } from "./ChatBackground";
import { Messages } from "./Messages";
import { OCanvas } from "../canvas/OCanvas";

export const ChatArea = () => {
  return (
    <div className="w-full h-full">
      <Messages />
      <OCanvas className="z-10 select-none" />
      <SandboxBackground />
    </div>
  );
};
