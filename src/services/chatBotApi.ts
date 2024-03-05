import axios from "axios";
import { MessageProps } from "../store";

const endpoint = "https://api.openai.com/v1/chat/completions";

interface IReqChatGPT {
  text: string;
  apiKey: string;
  hisotries?: MessageProps[];
  system?: string;
  maxHistories?: number;
}
export const requestChatGPT = async (
  {
    text,
    apiKey,
    hisotries,
    system,
    maxHistories = 3,
  }: IReqChatGPT
): Promise<string | null> => {
  const config = {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  };

  const messages = [];

  if (system && system.length > 10) {
    messages.push({ role: "system", content: system })
  }

  if (hisotries && Array.isArray(hisotries) && hisotries.length > 0) {
    // maxを考慮
    const _hisotries = hisotries.slice(-maxHistories);
    _hisotries.forEach((message) => {
      messages.push({ role: message.role, content: message.message });
    });
  }

  messages.push({ role: "user", content: text });

  const data = {
    model: "gpt-3.5-turbo-1106",
    messages: messages,
    temperature: 0.7,
    response_format: { "type": "json_object" }
  };

  try {
    const response = await axios.post(endpoint, data, config);
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
