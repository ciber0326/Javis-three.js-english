import React, { useEffect, useRef, useState } from "react";
import type { MessageProps } from "../../store";
import {
  Animated,
  Animator,
  Text,
  FrameSVGNefrex,
  useFrameSVGAssemblingAnimation,
  useBleeps,
} from "@arwes/react";
import { MdPlayArrow } from "react-icons/md";
import { compareTime } from "../../utils/time";
import { playTextToSpeech } from "../../hooks/useTextToSpeech";

type MessageListProps = {
  themeColor: string;
  backgroundColor: string;
  messages: MessageProps[];
  loading: boolean;
};

export const MessageList = ({
  themeColor,
  backgroundColor,
  messages,
  loading,
}: MessageListProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scroll to bottom
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Animated className="card w-full px-3">
      <div
        ref={ref}
        id="message-list"
        className="max-h-[calc(100vh_-_130px)] overflow-y-auto"
      >
        {messages.map((message, idx) => (
          <div className="grid grid-cols-3 gap-4" key={idx.toString()}>
            {message.role === "user" && (
              <div className="col-span-1 md:col-span-2"></div>
            )}
            <div className="col-span-2 md:col-span-1">
              <Message message={message} key={message.id} />
            </div>
          </div>
        ))}
      </div>
    </Animated>
  );
};

const Message = ({ message }: { message: MessageProps }) => {
  const [openDetail, setOpenDetail] = useState(false);
  const bleeps = useBleeps();

  return (
    <Animator>
      <div className="relative my-2">
        <MessageFrame>
          <div className="font-bold p-5">
            <Text as="p" manager="decipher" easing="outSine" fixed>
              {message.message}
            </Text>
            {openDetail && (
              <>
                {/** ただの線 */}
                <div className="w-full border-t-2 my-2 border-orange-300"></div>
                <div className="font-bold">{"[英単語]"}</div>
                <Text
                  as="p"
                  manager="decipher"
                  easing="outSine"
                  fixed
                  className="text-sm text-orange-300"
                >
                  {message.words?.join(", ")}
                </Text>
                <div className="font-bold mt-1">{"[英単語 (和訳)]"}</div>
                <Text
                  as="p"
                  manager="decipher"
                  easing="outSine"
                  fixed
                  className="text-sm text-orange-300"
                >
                  {message.words_jp?.join(", ")}
                </Text>
                <div className="font-bold">{"[全文和訳]"}</div>
                <Text
                  as="p"
                  manager="decipher"
                  easing="outSine"
                  fixed
                  className="text-sm text-orange-300"
                >
                  {message.jp? message.jp : "和訳がありません"}
                </Text>
              </>
            )}
          </div>
          {message.role === "assistant" && (
            <div className="absolute left-4 bottom-4">
              <Text
                as="span"
                manager="decipher"
                easing="outSine"
                fixed
                className="text-sm font-bold text-cyan-500"
                onClick={() => {
                  setOpenDetail(!openDetail);
                  bleeps.intro?.play();
                }}
              >
                Detail...
                {openDetail ? "▲" : "▼"}
              </Text>
            </div>
          )}
          <div className="absolute bottom-4 right-4">
            <Text as="span" manager="decipher" easing="outSine" fixed>
              {compareTime(message.messagedAt)}
            </Text>
          </div>
          {/** Replay Audio */}
          {message.role === "assistant" && (
            <div
              className="absolute top-4 right-4"
              onClick={() => playTextToSpeech({ text: message.message })}
            >
              <MdPlayArrow
                size={24}
                color="#2beded"
                className="cursor-pointer"
              />
            </div>
          )}
        </MessageFrame>
      </div>
    </Animator>
  );
};

type MessageFrameProps = {
  children: React.ReactNode;
};
const MessageFrame = ({ children }: MessageFrameProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { onRender } = useFrameSVGAssemblingAnimation(svgRef);

  return (
    <div className="pb-5 pr-5">
      <Animator>
        <FrameSVGNefrex
          elementRef={svgRef}
          onRender={onRender}
          padding={4}
          strokeWidth={2}
          squareSize={12}
          smallLineLength={12}
          largeLineLength={48}
        />
      </Animator>
      {children}
    </div>
  );
};
