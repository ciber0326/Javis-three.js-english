/** @jsx jsx */
import { jsx } from '@emotion/react';
import React from 'react';
import { useColorStore, useMessageStore, useUserStore } from '../store';
import { MySwal } from '../utils/alert';
import { requestChatGPT } from '../services/chatBotApi';
import { playTextToSpeech } from '../hooks/useTextToSpeech';
import { useTalk } from '../providers/TalkProvider';
import {
  MainContainer,
  MessageInput,
  MessageHeader,
  MessageList,
  MessageContainer,
} from "@minchat/react-chat-ui";

export const Messages = () => {

  const user = useUserStore();
  const { finishText } = useTalk();
  const [open, setOpen] = React.useState(false);

  const appendChatBoxText = async () => {
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
        speed: user.talkSpeed
      });
  };

  return (
    <MainContainer>
      <MessageContainer>
        {/* <MessageHeader showBack={false}/> */}
        <MessageListComponent />
      </MessageContainer>
    </MainContainer>
  )
}

const MessageListComponent = () => {

  const color = useColorStore((state) => state.color);
  const messages = useMessageStore((state) => state.messages);

  return (
    <MessageList
      themeColor={color}
      currentUserId='me'
      messages={messages.map((message) => {
        return {
          text: message.message,
          user: {
            id: message.id,
            name: message.username,
            avatar: message.avatar,
          },
          createdAt: message.messagedAt,
        };
      })}
    />
  )
}

const CustomMessage = () => {}