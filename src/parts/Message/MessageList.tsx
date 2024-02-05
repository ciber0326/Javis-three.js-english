import React, { useEffect, useRef } from "react";
import type { MessageProps } from "../../store";

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
    <div
      ref={ref}
      className="w-full h-full"
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      test
    </div>
  );
};

const Message = ({ message }: { message: MessageProps }) => {
  return (
    <div>
      <div>{message.message}</div>
      <div>{message.messagedAt.toString()}</div>
    </div>
  );
};
