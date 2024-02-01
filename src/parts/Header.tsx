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
import { AiOutlineQuestionCircle, AiFillSave } from "react-icons/ai";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { useColorStore, useUserStore } from "../store";
import { useTalk } from "../providers/TalkProvider";

const theme = createAppTheme();

export const Header = () => {
  const [active, setActive] = useState(false);
  const user = useUserStore();
  const { color, foreColor } = useColorStore();
  const bleeps = useBleeps();

  const { openLinkDesciption, startSpeech } = useTalk();

  const changeLang = () => {
    if (user.language === "en-US") {
      user.setLanguage("ja-JP");
    } else {
      user.setLanguage("en-US");
    }
  };

  return (
    <Animator>
      {/* <Animator merge combine manager='stagger'> */}
      {/* <Animator active={active}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 75,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: 75,
                top: 0,
                left: 0,
                zIndex: 1,
              }}
            >
              <div>
                AI英会話
                <a
                  className="icon desc"
                  onClick={() => {
                    openLinkDesciption();
                  }}
                >
                  <AiOutlineQuestionCircle />
                </a>
                <a className="icon mic" onClick={() => startSpeech()}>
                  {user.mic ? <BsFillMicFill /> : <BsFillMicMuteFill />}
                </a>
                <a className="icon lang" onClick={() => changeLang()}>
                  言語({user.language})
                </a>
              </div>
              <div className="keyinput">
                <input
                  className="input"
                  type="password"
                  placeholder="OpenAIのAPIキーをここに入力してください。"
                  value={user.openaiApiKey}
                  onChange={(e) => {
                    user.setOpenaiApiKey(e.target.value);
                  }}
                />
                <a
                  className="save"
                  onClick={() => user.saveLocalStorageKey(user.openaiApiKey)}
                >
                  <AiFillSave />
                </a>
              </div>
            </div>
          </div>
        </Animator> */}
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

        <Text as="h2">English Lesson</Text>

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
          <a onClick={() => startSpeech()}>
            {user.mic ? <BsFillMicFill /> : <BsFillMicMuteFill />}
          </a>
        </div>
        <div
          style={{
            position: "absolute",
            top: "24px",
            right: "56px",
            zIndex: 1,
            cursor: "pointer",
          }}
        >
          <a onClick={() => changeLang()}>
            {user.language === "en-US" ? "JP" : "US"}
          </a>
        </div>
        <div>
          <input
            type="password"
            placeholder="OpenAIのAPIキーをここに入力してください。"
            value={user.openaiApiKey}
            onChange={(e) => {
              user.setOpenaiApiKey(e.target.value);
            }}
          />
        </div>
      </Animated>
      {/* </Animator> */}
    </Animator>
  );
};
