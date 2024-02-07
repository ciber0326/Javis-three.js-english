import React from "react";
import { FrameSVGLines } from "@arwes/react";
import { useColorStore } from "../store";
import { useModal } from "../providers/ModalProvider";

export const Footer = () => {
  const { color, foreColor } = useColorStore();
  const { alertModal } = useModal();

  return (
    <div className="footer absolute bottom-0 left-0 h-16 w-full">
      <style>{`
            .footer .arwes-react-frames-framesvg [data-name=bg] {
              color: ${foreColor};
            }
            .footer .arwes-react-frames-framesvg [data-name=line] {
              color: ${color};
            }
          `}</style>
      <FrameSVGLines />
      <a onClick={() => alertModal(
        {
          title: "test",
          confirmText: "OK",
          cancelText: "Cancel",
          content: "test",
        }
        )}>Test</a>
    </div>
  );
};
