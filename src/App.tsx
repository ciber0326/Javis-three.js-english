import React from "react";

import "./App.css";
import { ArwesProvider } from "./providers/ArwesProvider";
import { ModalProvider } from "./providers/ModalProvider";
import { Header } from "./parts/Header";
import { ChatArea } from "./parts/ChatArea";
import { TalkProvider } from "./providers/TalkProvider";

export const App = () => {
  return (
    <div className="App">
      <ArwesProvider>
        <ModalProvider>
          <TalkProvider>
            <Header />
            <ChatArea />
          </TalkProvider>
        </ModalProvider>
      </ArwesProvider>
    </div>
  );
};
