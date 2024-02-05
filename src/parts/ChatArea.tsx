import React, { useRef } from "react";
import { useUserStore } from "../store";

import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiOutlineReload } from "react-icons/ai";
import { SandboxBackground } from "./ChatBackground";
import { Messages } from "./Messages";

export const ChatArea = () => {
  const user = useUserStore();

  return (
    <div className="w-full h-full">
      <Messages />
      <SandboxBackground />
    </div>
  );
};
