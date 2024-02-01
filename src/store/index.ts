import { create } from "zustand";

/**
 * Example Zustand store
 */
// type BearStore = {
//   bears: number
//   increasePopulation: () => void
//   removeAllBears: () => void
// }
// const useBearStore = create((set) => ({
//   bears: 0,
//   increasePopulation: () => set((state: BearStore) => ({ bears: state.bears + 1 })),
//   removeAllBears: () => set({ bears: 0 }),
// }))

/**
 * ユーザー設定
 * マイク状態 / 言語 / OpenAI API Key
 */
type language = "ja-JP" | "en-US";
type UserStore = {
  mic: boolean;
  language: language;
  openaiApiKey: string;
  talkSpeed: number;
  setMic: (mic: boolean) => void;
  setLanguage: (language: language) => void;
  setOpenaiApiKey: (openaiApiKey: string) => void;
  setTalkSpeed: (talkSpeed: number) => void;
  saveLocalStorageKey: (openaiApiKey: string) => void;
  getLocalStorageKey: () => string;
};
const useUserStore = create<UserStore>((set) => ({
  mic: false,
  language: "ja-JP",
  openaiApiKey: "",
  talkSpeed: 1,
  setMic: (mic) => set({ mic }),
  setLanguage: (language) => set({ language }),
  setOpenaiApiKey: (openaiApiKey) => set({ openaiApiKey }),
  setTalkSpeed: (talkSpeed) => set({ talkSpeed }),
  saveLocalStorageKey: (openaiApiKey) => {
    localStorage.setItem("openaiApiKey", openaiApiKey);
  },
  getLocalStorageKey: () => {
    return localStorage.getItem("openaiApiKey") || "";
  },
}));


/**
 * カラーリング設定
 */
type ColorStore = {
  color: string;
  foreColor: string;
  setColor: (color: string) => void;
  setForeColor: (foreColor: string) => void;
};
const useColorStore = create<ColorStore>((set) => ({
  color: "#2beded",
  foreColor: "#2beded22",
  setColor: (color) => set({ color }),
  setForeColor: (foreColor) => set({ foreColor }),
}));

/**
 * Messageリスト
 */
export type MessageProps = {
  id: string;
  message: string;
  username?: string;
  avatar?: string;
  messagedAt: Date;
};
type MessageStore = {
  messages: MessageProps[];
  addMessage: (message: MessageProps) => void;
  removeMessage: (id: string) => void;
  removeAllMessages: () => void;
};
const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  removeMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id),
    })),
  removeAllMessages: () => set({ messages: [] }),
}));

export { useUserStore, useColorStore, useMessageStore };
