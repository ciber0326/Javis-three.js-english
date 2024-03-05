import React, { useEffect, useState, useRef } from "react";
import {
  Animator,
  FrameSVGCorners,
  Text,
  BleepsOnAnimator,
  useBleeps,
  Animated,
  aaVisibility,
  aa,
  createAppTheme,
} from "@arwes/react";
import { FaKey } from "react-icons/fa";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { useColorStore, useUserStore } from "../store";
import { useTalk } from "../providers/TalkProvider";
import { useModal } from "../providers/ModalProvider";

const theme = createAppTheme();

export const Header = () => {
  const { saveLocalStorageKey, setLanguage, language, mic, openaiApiKey, setOpenaiApiKey } = useUserStore();
  const { color, foreColor } = useColorStore();
  const { err } = useTalk();
  const { alertModal } = useModal();
  const bleeps = useBleeps();

  const { openLinkDesciption, startSpeech } = useTalk();

  const changeLang = () => {
    if (language === "en-US") {
      setLanguage("ja-JP");
    } else {
      setLanguage("en-US");
    }
  };

  return (
    <div className="z-30 fixed top-4 left-0 w-full">
      <Animator>
        <BleepsOnAnimator transitions={{ entering: "intro" }} continuous />
        <Animated
          className="card"
          id="card"
          style={{
            position: "relative",
            display: "block",
            maxWidth: "90%",
            height: "75px",
            margin: theme.space([2, "auto"]),
            padding: theme.space(4),
            textAlign: "center",
            zIndex: 1,
          }}
          // Effects for entering and exiting animation transitions.
          animated={[aaVisibility(), aa("y", "2rem", 0)]}
          // Play bleep when the card is clicked.
          onClick={() => bleeps.click?.play()}
        >
          <style>{`
              .card .arwes-react-frames-framesvg [data-name=bg] {
                color: ${foreColor};
              }
              .card .arwes-react-frames-framesvg [data-name=line] {
                color: ${color};
              }
            `}</style>
          <Animator>
            <FrameSVGCorners strokeWidth={2} />
          </Animator>

          <Text as="h2" className="italic">
            JARVIS <span className="sm:inline hidden">English</span>
          </Text>

          <div
            style={{
              position: "absolute",
              top: "24px",
              right: "56px",
              fontSize: "20px",
              zIndex: 1,
              cursor: "pointer",
            }}
          >
            <a onClick={() => startSpeech()}>
              {mic ? <BsFillMicFill /> : <BsFillMicMuteFill />}
            </a>
          </div>
          <div
            style={{
              position: "absolute",
              top: "24px",
              right: "84px",
              zIndex: 1,
              cursor: "pointer",
            }}
          >
            <a onClick={() => changeLang()}>
              {language === "en-US" ? "US" : "JP"}
            </a>
          </div>
          <div
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              fontSize: "20px",
              zIndex: 1,
              cursor: "pointer",
            }}
          >
            <a
              onClick={() => {
                alertModal({
                  title: "APIキーの設定",
                  confirmText: "OK",
                  cancelText: "Cancel",
                  content: ( 
                    <div className="w-full p-4">
                      <div className="mb-3">
                        <a href="https://platform.openai.com/account/api-keys" target="_blank">OpenAIのAPIページ</a>
                      </div>
                      <input
                        type="password"
                        placeholder="OpenAIのAPIキーをここに入力してください。"
                        // value={openaiApiKey}
                        className="w-full block text-white text-sm font-bold p-2 rounded-sm outline-none"
                        onChange={(e) => {
                          // 音も鳴らす
                          bleeps.click?.play();
                          setOpenaiApiKey(openaiApiKey);
                        }}
                        style={{
                          backgroundColor: foreColor,
                        }}
                      />
                    </div>
                  ),
                  okFunc: () => {
                    err.current = false;
                    saveLocalStorageKey(openaiApiKey);
                  },
                });
              }}
            >
              <FaKey />
            </a>
          </div>
        </Animated>
        {/* </Animator> */}
      </Animator>
    </div>
  );
};
