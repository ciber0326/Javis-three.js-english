import React, { useContext, createContext, useRef, useEffect } from "react";
import { MySwal } from "../utils/alert";
import { MessageProps, useUserStore } from "../store";
import { useSpeechRecognition, type SpeechRecognitionResultProps } from "../hooks/useSpeechRecognition";

export const TalkContext = createContext({
  openLinkDesciption: () => {},
  startReload: () => {},
  startSpeech: () => {},
  logs: { current: [] } as React.MutableRefObject<MessageProps[]>,
  err: { current: false } as React.MutableRefObject<boolean>,
  speechText: { current: {} } as React.MutableRefObject<SpeechRecognitionResultProps>,
});

type TalkProviderProps = {
  children: React.ReactNode;
};
export const TalkProvider = ({ children }: TalkProviderProps) => {
  const user = useUserStore();
  const logs = useRef<MessageProps[]>([]);
  const err = useRef(false);

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

  useEffect(() => {
    user.getLocalStorageKey();
  }, []);

  return (
    <TalkContext.Provider
      value={{
        openLinkDesciption,
        startReload,
        startSpeech,
        logs,
        err,
        speechText,
      }}
    >
      {children}
    </TalkContext.Provider>
  );
};

export const useTalk = () => useContext(TalkContext);
