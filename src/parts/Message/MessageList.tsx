import React, { useEffect, useRef, useState } from "react";
import type { MessageProps } from "../../store";
import {
  Animated,
  Animator,
  Text,
  FrameSVGNefrex,
  useFrameSVGAssemblingAnimation,
} from "@arwes/react";
import { MdPlayArrow } from "react-icons/md";
import { compareTime } from "../../utils/time";

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
    <Animated ref={ref} className="card w-full max-h-full px-3">
      {/* {loading && <div>Loading...</div>} */}
      {messages.map((message) => (
        <div className="grid grid-cols-3 gap-4">
          {message.role === "user" && (
            <div className="col-span-1 md:col-span-2"></div>
          )}
          <div className="col-span-2 md:col-span-1">
            <Message message={message} key={message.id} />
          </div>
        </div>
      ))}
    </Animated>
  );
};

const Message = ({ message }: { message: MessageProps }) => {
  return (
    <Animator>
      <div className="relative my-2">
        <MessageFrame>
          <div className="font-bold p-5">
            <Text as="p" manager="decipher" easing="outSine" fixed>
              {message.message}
            </Text>
          </div>
          <div className="absolute bottom-4 right-4">
            <Text as="span" manager="decipher" easing="outSine" fixed>
              {compareTime(message.messagedAt)}
            </Text>
          </div>
          {/** Replay Audio */}
          {message.role === "assistant" && (
            <div className="absolute top-4 right-4">
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
