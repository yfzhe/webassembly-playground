import "./app";

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
