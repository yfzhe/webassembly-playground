import { createRoot } from "react-dom/client";
import App from "./App";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(
    new URL(
      /* webpackChunkName: "service-worker" */
      "./service/index.ts",
      import.meta.url
    ),
    { scope: "./" }
  )
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
