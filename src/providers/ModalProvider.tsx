import React, { useContext } from "react";

import {
  type AppTheme,
  createAppTheme,
  Animator,
  Text,
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
  okFunc?: () => void;
  cancelFunc?: () => void;
};
const Modal = ({
  open,
  children,
  title,
  confirmText="OK",
  cancelText="Cancel",
  okFunc,
  cancelFunc,
}: ModalProps) => {
  const { color, foreColor } = useColorStore();
  const { hiddenModal } = useModalStore();

  return (
    <>
      <style>{`
              .modal .arwes-react-frames-framesvg [data-name=bg] {
                color: #2C2C0688;
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
            className="modal relative w-full md:w-1/2 top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
          >
            <div className="relative">
              <FrameSVGKranox
                padding={4}
                strokeWidth={2}
                squareSize={12}
                smallLineLength={12}
                largeLineLength={48}
              ></FrameSVGKranox>

              <div className="px-12 pt-6 w-full">
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
                  onClick={() => {
                    hiddenModal();
                    okFunc && okFunc();
                  }}
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
                  onClick={() => {
                    hiddenModal();
                    cancelFunc && cancelFunc();
                  }}
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
  okFunc?: () => void;
  cancelFunc?: () => void;
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
  // refで実装
  const _okFunc = React.useRef<() => void>();
  const _cancelFunc = React.useRef<() => void>();

  const alertModal = ({
    title,
    confirmText,
    cancelText,
    content,
    okFunc,
    cancelFunc,
  }: AlertModalProps) => {
    _okFunc.current = okFunc;
    _cancelFunc.current = cancelFunc;
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
        okFunc={_okFunc.current}
        cancelFunc={_cancelFunc.current}
      >
        {content}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalContext);
};
