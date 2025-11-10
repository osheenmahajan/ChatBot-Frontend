import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // ✅ TailwindCSS
import { BrowserRouter } from 'react-router-dom';

import { ChatProvider } from "./context/ChatContext"; // ✅ Import this

export const server = "http://localhost:5000";

console.log("Rendering main.jsx");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <App />
      </ChatProvider>
    </BrowserRouter>
  </React.StrictMode>
);
