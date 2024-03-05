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
type level = "easy" | "normal" | "hard";
type UserStore = {
  mic: boolean;
  language: language;
  openaiApiKey: string;
  talkSpeed: number;
  level: level;
  system: string;
  setMic: (mic: boolean) => void;
  setLanguage: (language: language) => void;
  setOpenaiApiKey: (openaiApiKey: string) => void;
  setTalkSpeed: (talkSpeed: number) => void;
  saveLocalStorageKey: (openaiApiKey: string) => void;
  getLocalStorageKey: () => string;
};
const useUserStore = create<UserStore>((set) => ({
  mic: false,
  language: "en-US",
  openaiApiKey: "",
  talkSpeed: 1,
  level: "normal",
  system: `
   これから私たちは英会話のシミュレーションを行います。
   あなたの名前はJARVISです。
   毎回返答として必ず以下のJSON形式で返してください。
   {
    "jarvis": "<ここにあなたの英会話の返答>",
    "jp": "<ここにあなたの返答の日本語訳>",
    "words": [
      "<ここにあなたの返答に使った単語>",
      "<ここにあなたの返答に使った単語>",
      "<ここにあなたの返答に使った単語>"
    ],
    "words_jp": [
      "<ここにあなたの返答に使った単語の日本語訳>",
      "<ここにあなたの返答に使った単語の日本語訳>",
      "<ここにあなたの返答に使った単語の日本語訳>"
    ],
   }
   注意点としてwordsおよびwords_jpは3つまでとしてください。
  `,
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
 * 共通モーダルのON/OFF設定
 */
type ModalStore = {
  modal: boolean;
  setModal: (modal: boolean) => void;
  openModal: () => void;
  hiddenModal: () => void;
};
const useModalStore = create<ModalStore>((set) => ({
  modal: false,
  setModal: (modal) => set({ modal }),
  openModal: () => set({ modal: true }),
  hiddenModal: () => set({ modal: false }),
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
  role: "user" | "assistant";
  message: string;
  username?: string;
  avatar?: string;
  messagedAt: Date;
  jp?: string;
  words?: string[];
  words_jp?: string[];
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

export { useUserStore, useModalStore, useColorStore, useMessageStore };
