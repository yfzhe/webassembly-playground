import type { File } from "../types";

export enum MessageType {
  Compile = "COMPILE",
}

function postMessageToWorker(sw: ServiceWorker, data: unknown): Promise<any> {
  return new Promise((resolve) => {
    const ch = new MessageChannel();
    ch.port1.onmessage = (evt) => resolve(evt.data);
    sw.postMessage(data, [ch.port2]);
  });
}

export type Log = {
  filename: string;
  log: string;
};

export function compile(
  sw: ServiceWorker,
  files: Array<File>,
): Promise<Array<Log>> {
  return postMessageToWorker(sw, {
    type: MessageType.Compile,
    files,
  });
}
