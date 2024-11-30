import type { File } from "../types";

export enum MessageType {
  Compile = "Compile",
}

export type Message = {
  type: MessageType.Compile;
  files: Array<File>;
};

export type CompileLog = {
  filename: string;
  result: "ok" | "err";
  log: string;
};

function postMessageToWorker<R>(
  sw: ServiceWorker,
  message: Message,
): Promise<R> {
  return new Promise((resolve) => {
    const ch = new MessageChannel();
    ch.port1.onmessage = (evt) => resolve(evt.data as R);
    sw.postMessage(message, [ch.port2]);
  });
}

export async function compile(
  sw: ServiceWorker,
  files: Array<File>,
): Promise<Array<CompileLog>> {
  return postMessageToWorker<Array<CompileLog>>(sw, {
    type: MessageType.Compile,
    files,
  });
}
