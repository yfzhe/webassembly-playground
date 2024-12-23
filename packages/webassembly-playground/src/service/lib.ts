import type { WasmFeatures } from "../features";
import type { File } from "../types";

export enum MessageType {
  Compile = "Compile",
}

export type Message = {
  type: MessageType.Compile;
  files: Array<File>;
  features: WasmFeatures;
};

export type CompileLog = {
  filename: string;
  result: "ok" | "err";
  log: string;
};

async function postMessageToServiceWorker<R>(message: Message): Promise<R> {
  const sw = navigator.serviceWorker.controller;
  if (!sw) {
    throw new Error("Service worker is not ready");
  }

  return new Promise((resolve) => {
    const ch = new MessageChannel();
    ch.port1.onmessage = (evt) => resolve(evt.data as R);
    sw.postMessage(message, [ch.port2]);
  });
}

export async function compile(
  files: Array<File>,
  features: WasmFeatures,
): Promise<Array<CompileLog>> {
  return postMessageToServiceWorker<Array<CompileLog>>({
    type: MessageType.Compile,
    files,
    features,
  });
}
