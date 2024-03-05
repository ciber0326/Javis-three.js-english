import React, { useEffect, useRef } from "react";
import {
  MessageProps,
  useColorStore,
  useMessageStore,
  useUserStore,
} from "../store";
import { requestChatGPT } from "../services/chatBotApi";
import { playTextToSpeech } from "../hooks/useTextToSpeech";
import { useTalk } from "../providers/TalkProvider";
import { MainContainer } from "./Message/MainContainer";
import { MessageContainer } from "./Message/MessageContainer";
import { MessageList } from "./Message/MessageList";
import { useModal } from "../providers/ModalProvider";
import { useBleeps } from "@arwes/react";
import { parseJsonGpt } from "../utils/gpts";

export const Messages = () => {
  const user = useUserStore();
  const currentInput = useRef("");
  const { speechText, logs, err } = useTalk();
  const { addMessage } = useMessageStore();
  const { alertModal } = useModal();
  const { foreColor } = useColorStore();
  const bleeps = useBleeps();

  const appendChatBoxText = async () => {
    if (err.current) {
      return;
    }
    if (!user.openaiApiKey) {
      alertModal({
        title: "APIキーの設定",
        confirmText: "OK",
        cancelText: "Cancel",
        content: (
          <div className="w-full p-4">
            <div className="mb-3">
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
              >
                OpenAIのAPIページ
              </a>
            </div>
            <input
              type="password"
              placeholder="OpenAIのAPIキーをここに入力してください。"
              // value={user.openaiApiKey}
              className="w-full block text-white text-sm font-bold p-2 rounded-sm outline-none"
              onChange={(e) => {
                // 音も鳴らす
                bleeps.click?.play();
                user.setOpenaiApiKey(e.target.value);
              }}
              style={{
                backgroundColor: foreColor,
              }}
            />
          </div>
        ),
        okFunc: () => {
          err.current = false;
          user.saveLocalStorageKey(user.openaiApiKey);
        },
      });
      err.current = true;
      return;
    }
    if (
      !speechText.current.finishText ||
      speechText.current.finishText.length <= 2
    ) {
      return;
    }
    // すでに同じテキストが入力されていたら何もしない
    if (currentInput.current === speechText.current.finishText) {
      return;
    }
    currentInput.current = speechText.current.finishText;
    const usersend = {
      id: speechText.current.finishText,
      role: "user",
      message: speechText.current.finishText,
      messagedAt: new Date(),
    } as MessageProps;
    addMessage(usersend);
    bleeps.click?.play();
    const chatbotText = await requestChatGPT({
      text: speechText.current.finishText,
      apiKey: user.openaiApiKey,
      system: user.system,
      hisotries: logs.current,
    });
    if (!chatbotText) {
      err.current = true;
      return;
    }
    const res = parseJsonGpt(chatbotText);
    if (!res) {
      return;
    }
    const assistantsend = {
      id: res.id,
      role: "assistant",
      message: res.jarvis,
      messagedAt: new Date(),
      jp: res.jp,
      words: res.words,
      words_jp: res.words_jp,
    } as MessageProps;
    addMessage(assistantsend);
    logs.current.push(usersend);
    logs.current.push(assistantsend);
    bleeps.click?.play();
    playTextToSpeech({
      text: res.jarvis,
      lang: "Auto",
      speed: user.talkSpeed,
    });
  };

  useEffect(() => {
    // 1秒毎に確認する
    const update = () => {
      appendChatBoxText();
    };
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [speechText, user.openaiApiKey]);

  return (
    <div className="absolute z-20 top-32 left-0 w-full mx-auto">
      <MainContainer>
        <MessageContainer>
          {/* <MessageHeader showBack={false}/> */}
          <MessageListComponent />
        </MessageContainer>
      </MainContainer>
    </div>
  );
};

const MessageListComponent = () => {
  const color = useColorStore((state) => state.color);
  const { messages } = useMessageStore();

  return (
    <MessageList
      themeColor={color}
      backgroundColor="transparent"
      messages={messages}
      loading={true}
    />
  );
};
