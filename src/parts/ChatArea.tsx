import React, { useRef } from "react";
import { useUserStore } from "../store";

import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiOutlineReload } from "react-icons/ai";
import { SandboxBackground } from "./ChatBackground";

export const ChatArea = () => {
  const user = useUserStore();

  return (
    <div>
      {/* <div
        className="chatroom"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }}
      >
        <div className="messages">
          <div className="message system">
            <div>
              APIキーを入力後、
              <br />
              マイクをONにしてください
            </div>
            <div className="mic-help">
              {!user.mic && (
                <a className="btn" onClick={() => undefined}>
                  マイクONにする
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="chatthinking">
          <div id="suspend" className="suspend">
            回答を作成しています
            <BiDotsHorizontalRounded />
          </div>
        </div>
        <div className="nowspeaking">
          <div className="text">
            <a
              className="reload"
              onClick={() => {
                // startReload();
              }}
            >
              <AiOutlineReload />
            </a>
            <span id="text"></span>
          </div>
        </div>
      </div> */}
      <SandboxBackground />
    </div>
  );
};
