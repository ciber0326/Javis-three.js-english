import React, { useContext, createContext, useRef } from "react";
import { MySwal } from "../utils/alert";
import { useUserStore } from "../store";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";

export const TalkContext = createContext({
  openLinkDesciption: () => {},
  startReload: () => {},
  startSpeech: () => {},
  finishText: {
    current: "",
  },
});

type TalkProviderProps = {
  children: React.ReactNode;
};
export const TalkProvider = ({ children }: TalkProviderProps) => {
  const finishText = useRef("");
  const user = useUserStore();

  const speechText = useSpeechRecognition({
    enabled: user.mic,
    lang: user.language,
    continuous: true,
    interimResults: true,
  });

  const openLinkDesciption = () => {
    MySwal.fire({
      title: "APIキーの入手してますか?",
      html:
        'OpenAIの<a href="https://platform.openai.com/account/api-keys">APIページ</a>よりAPIキーを入手してください。<br/>' +
        '入手後その値を"OpeAIのAPIキーをここに入力してください"と記述されたところ貼り付けてください。',
      imageUrl: "description-openai-key.jpg",
      imageHeight: 200,
      imageAlt: "A tall image",
    });
  };

  const saveLocalStorage = () => {
    MySwal.fire({
      title: "APIキーを保持する?",
      showDenyButton: true,
      confirmButtonText: "する",
      denyButtonText: `しない`,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("OPENAI_API_KEY", user.openaiApiKey);
        MySwal.fire("保持しました!", "", "success");
      }
    });
  };

  const startReload = () => {
    // suspendRef.current = false;
    // const suspend = document.getElementById("suspend");
    // suspend.style.display = "none";
    // setReload(reload + 1);
  };

  const startSpeech = () => {
    if (user.openaiApiKey && user.openaiApiKey.length < 16) {
      MySwal.fire({
        icon: "error",
        title: "APIキーが設定されていません。",
        html:
          'OpenAIの<a href="https://platform.openai.com/account/api-keys">APIページ</a>よりAPIキーを入手してください。<br/>' +
          '入手後その値を"OpeAIのAPIキーをここに入力してください"と記述されたところ貼り付けてください。',
        imageUrl: "description-openai-key.jpg",
        imageHeight: 200,
        imageAlt: "Image",
      });
      return;
    }
    user.setMic(!user.mic);
  };

  return (
    <TalkContext.Provider
      value={{
        openLinkDesciption,
        startReload,
        startSpeech,
        finishText,
      }}
    >
      {children}
    </TalkContext.Provider>
  );
};

export const useTalk = () => useContext(TalkContext);
