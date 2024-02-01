import React from "react";

import "./App.css";
import { ArwesProvider } from "./providers/ArwesProvider";
import { Header } from "./parts/Header";
import { ChatArea } from "./parts/ChatArea";
import { TalkProvider } from "./providers/TalkProvider";

export const App = () => {
  return (
    <div className="App">
      <ArwesProvider>
        <TalkProvider>
          <Header />
          <ChatArea />
        </TalkProvider>
      </ArwesProvider>
    </div>
  );
};
