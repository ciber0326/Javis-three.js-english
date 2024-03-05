import React from "react";

import "./App.css";
import { ArwesProvider } from "./providers/ArwesProvider";
import { ModalProvider } from "./providers/ModalProvider";
import { Header } from "./parts/Header";
import { ChatArea } from "./parts/ChatArea";
import { TalkProvider } from "./providers/TalkProvider";
import { Scene } from "./providers/scene";
import { Controls } from "./parts/Controls";

export const App = () => {
  return (
    <div className="App" id="jarvis">
      <ArwesProvider>
        <ModalProvider>
          <TalkProvider>
            <Header />
            <ChatArea />
            <Controls />
          </TalkProvider>
        </ModalProvider>
      </ArwesProvider>
      <Scene children={undefined} />
    </div>
  );
};
