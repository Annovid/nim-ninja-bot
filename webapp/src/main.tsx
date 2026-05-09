import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initTelegram } from "./lib/telegram";
import { App } from "./App";
import "./styles.css";

initTelegram();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
