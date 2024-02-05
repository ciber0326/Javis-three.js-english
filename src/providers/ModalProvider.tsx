import React, { useContext } from "react";

import { Global } from "@emotion/react";
import { type AppTheme, createAppTheme, Animator } from "@arwes/react";
import { useColorStore, useModalStore } from "../store";

const t: AppTheme = createAppTheme({
  settings: {
    hues: {
      primary: 200,
      secondary: 80,
    },
    fontFamilies: {
      title: 'Copperplate, Copper, "Comic Sans"',
      body: "Tahoma, Techno, Trebuchet",
    },
  },
});

type ModalProps = {
  open: boolean;
  children?: React.ReactNode;
  title?: string;
  confirmText: string;
  cancelText: string;
};
const Modal = ({
  open,
  children,
  title,
  confirmText,
  cancelText,
}: ModalProps) => {
  const { color } = useColorStore();
  const { hiddenModal } = useModalStore();

  return (
    <Animator merge combine manager="stagger">
      <div
        className={`w-full h-full fixed top-0 left-0 z-50 ${
          open ? "block" : "hidden"
        }`}
        onClick={() => {
          hiddenModal();
        }}
      >
        <div className="w-full h-full top-0 left-0 z-50 flex justify-center items-center">
          <main
            style={{
              border: `1px solid ${t.colors.primary.deco(5)}`,
              padding: t.space([4, 8]),
              maxWidth: 400,
              borderRadius: t.space(4),
              background: `linear-gradient(
            to bottom right,
            ${t.colors.primary.ol(2)},
            ${t.colors.primary.ol(4)}
          )`,
            }}
          >
            <div className="text-white text-xl font-bold">{title}</div>
            <div className="mt-4">{children}</div>
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-gray-700 rounded-lg mr-2">
                {cancelText}
              </button>
              <button
                className="px-4 py-2 bg-gray-700 rounded-lg"
                style={{
                  background: color,
                  color: "#fff",
                }}
              >
                {confirmText}
              </button>
            </div>
          </main>
        </div>
      </div>
    </Animator>
  );
};

type AlertModalProps = {
  title: string;
  confirmText: string;
  cancelText: string;
  content: React.ReactNode;
};
const ModalContext = React.createContext({
  alertModal: (props: AlertModalProps) => {},
});

/**
 * Provider作成
 */
export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const { modal } = useModalStore();
  const [content, setContent] = React.useState<React.ReactNode>("");
  const [title, setTitle] = React.useState("");
  const [confirmText, setConfirmText] = React.useState("");
  const [cancelText, setCancelText] = React.useState("");

  const alertModal = ({
    title,
    confirmText,
    cancelText,
    content,
  }: AlertModalProps) => {
    setContent(content);
    setTitle(title);
    setConfirmText(confirmText);
    setCancelText(cancelText);
  };

  return (
    <ModalContext.Provider
      value={{
        alertModal,
      }}
    >
      {children}
      <Modal
        open={modal}
        title={title}
        confirmText={confirmText}
        cancelText={cancelText}
      >
        {content}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalContext);
};
