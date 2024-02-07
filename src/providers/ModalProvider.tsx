import React, { useContext, useEffect } from "react";

import { Global } from "@emotion/react";
import {
  type AppTheme,
  createAppTheme,
  Animator,
  Text,
  Animated,
  FrameSVGKranox,
} from "@arwes/react";
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
  confirmText?: string;
  cancelText?: string;
};
const Modal = ({
  open,
  children,
  title,
  confirmText="OK",
  cancelText="Cancel",
}: ModalProps) => {
  const { color, foreColor } = useColorStore();
  const { hiddenModal } = useModalStore();

  return (
    <>
      <style>{`
              .modal .arwes-react-frames-framesvg [data-name=bg] {
                color: #2C2C0640;
              }
              .modal .arwes-react-frames-framesvg [data-name=line] {
                color: #DFDF1F;
              }
            `}</style>
      <div
        className={`w-full h-full fixed top-0 left-0 z-50 ${
          open ? "block" : "hidden"
        }`}
        // modal-dialogに含まれていなければ閉じる
        onClick={(e) => {
          const modalDialog = document.getElementById("modal-dialog");
          if (modalDialog && !modalDialog.contains(e.target as Node)) {
            hiddenModal();
          }
        }}
      >
        <Animator active={open}>
          <div
            id="modal-dialog"
            className="modal relative w-1/2 top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
          >
            <div className="relative">
              <FrameSVGKranox
                padding={4}
                strokeWidth={2}
                squareSize={12}
                smallLineLength={12}
                largeLineLength={48}
              ></FrameSVGKranox>

              <div className="px-12 pt-6">
                {title &&
                  <Text as="h2" manager="decipher" easing="outSine" fixed>
                    {title}
                  </Text>
                }
                {children && typeof children === "string" ? (
                  <Text as="p" manager="decipher" easing="outSine" fixed>
                    {children}
                  </Text>
                ) : (
                  children
                )}
              </div>
              <div className="px-4 py-6 mr-6 flex flex-row-reverse">
                <button
                  className="px-4 py-2 mx-2"
                  style={{
                    background: foreColor,
                    color: color,
                    border: `1px solid ${color}`,
                  }}
                  onClick={() => hiddenModal()}
                >
                  {confirmText}
                </button>
                <button
                  className="px-4 py-2 mx-2"
                  style={{
                    background: "#2C2C0640",
                    color: "#DFDF1F",
                    border: `1px solid #DFDF1F`,
                  }}
                  onClick={() => hiddenModal()}
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </div>
        </Animator>
      </div>
    </>
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
  const { modal, openModal } = useModalStore();
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
    openModal();
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
