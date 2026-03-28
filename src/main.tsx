
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  console.log("Main.tsx: starting render");
  try {
    createRoot(document.getElementById("root")!).render(<App />);
    console.log("Main.tsx: render called");
  } catch (e) {
    console.error("Main.tsx: render failed", e);
    document.body.innerHTML = `<div style="padding: 20px; color: red;"><h1>Application Error</h1><pre>${e instanceof Error ? e.stack : String(e)}</pre></div>`;
  }
  
