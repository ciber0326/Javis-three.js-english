import React from "react";
import { useColorStore, useMessageStore, useUserStore } from "../store";
import { MySwal } from "../utils/alert";
import { requestChatGPT } from "../services/chatBotApi";
import { playTextToSpeech } from "../hooks/useTextToSpeech";
import { useTalk } from "../providers/TalkProvider";
import { MainContainer } from "./Message/MainContainer";
import { MessageContainer } from "./Message/MessageContainer";
import { MessageList } from "./Message/MessageList";
import { useModal } from "../providers/ModalProvider";

export const Messages = () => {
  const user = useUserStore();
  const { finishText } = useTalk();
  const { alertModal } = useModal();

  const appendChatBoxText = async () => {
    if (user.openaiApiKey && user.openaiApiKey.length < 16) {
      alertModal({
        title: "APIキーが設定されていません",
        confirmText: "OK",
        cancelText: "Cancel",
        content: (
          <div>
            OpenAIの
            <a href="https://platform.openai.com/account/api-keys">APIページ</a>
            よりAPIキーを入手してください。
          </div>
        ),
      });
    }
    if (!finishText.current || finishText.current.length <= 2) {
      return;
    }
    const chatbotText = await requestChatGPT({
      text: finishText.current,
      apiKey: user.openaiApiKey,
    });
    playTextToSpeech({
      text: chatbotText,
      lang: "Auto",
      speed: user.talkSpeed,
    });
  };

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
  const messages = useMessageStore((state) => state.messages);

  return (
    <MessageList
      themeColor={color}
      backgroundColor="transparent"
      messages={messages}
      loading={true}
    />
  );
};
