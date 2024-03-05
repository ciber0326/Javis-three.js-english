import React, { useEffect, useRef } from "react";
import { useTalk } from "../providers/TalkProvider";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { Text } from "@arwes/react";
import { useUserStore } from "../store";

const _Controls = () => {
  const { mic, setMic } = useUserStore();
  const { speechText } = useTalk();
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [currentInput, setCurrentInput] = React.useState("");

  useEffect(() => {
    // 0.2秒ごとに音声認識の状態を監視
    const iid = setInterval(() => {
      setIsSpeaking(speechText.current.isPending);
      if (currentInput !== speechText.current.interimText) {
        setCurrentInput(speechText.current.interimText);
      }
    }, 200);
    return () => clearInterval(iid);
  }, [currentInput]);

  return (
    <div className="fixed bottom-4 right-4 flex justify-center items-center p-3 bg-transparent rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 ease-in-out">
      {currentInput && (
        <Text
          as="span"
          manager="decipher"
          easing="outSine"
          fixed
          className="text-sm font-bold text-cyan-500"
        >
          {currentInput}
        </Text>
      )}
      {mic && (
        <>
          {isSpeaking ? (
            <BsFillMicFill
              className="text-cyan-300 animate-pulse w-6 h-6"
              onClick={() => setMic(false)}
            />
          ) : (
            <BsFillMicFill
              className="text-gray-500 w-6 h-6"
              onClick={() => setMic(false)}
            />
          )}
        </>
      )}
      {!mic && (
        <BsFillMicMuteFill
          className="text-red-500 w-6 h-6"
          onClick={() => setMic(true)}
        />
      )}
    </div>
  );
};

export const Controls = React.memo(_Controls);
