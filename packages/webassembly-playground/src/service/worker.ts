// About service worker and typescript, see:
// - https://joshuatz.com/posts/2021/strongly-typed-service-workers/
// - https://github.com/Microsoft/TypeScript/issues/14877#issuecomment-340279293

/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import initWabt from "wabt";
import { MessageType, type CompileLog, type Message } from "./lib";
import type { File } from "../types";
import type { WasmFeatures } from "../features";
import { extname, getMimeType } from "../lib/file";

// This type is not exported, so define it by our own.
type WabtModule = Awaited<ReturnType<typeof initWabt>>;

let _wabt: WabtModule | undefined;
async function getWabt() {
  if (!_wabt) {
    const wabt = await initWabt();
    _wabt = wabt;
  }
  return _wabt;
}

const fileStorage: Map<string, string | Uint8Array> = new Map();

self.addEventListener("install", (evt) => {
  self.skipWaiting();
  evt.waitUntil(getWabt());
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

async function compile(files: Array<File>, features: WasmFeatures) {
  const wabt = await getWabt();
  let logs: Array<CompileLog> = [];
  fileStorage.clear();

  for (const file of files) {
    const { filename, content } = file;
    const ext = extname(filename);

    switch (ext) {
      case ".wat": {
        try {
          const module = wabt.parseWat(filename, content, features);
          module.validate();
          const result = module.toBinary({ log: true });

          const wasmFilename = filename.replace(/\.wat$/, ".wasm");
          fileStorage.set(wasmFilename, result.buffer);

          logs.push({ filename, result: "ok", log: result.log });
        } catch (e) {
          logs.push({ filename, result: "err", log: (e as Error).message });
        }
        break;
      }

      case ".js": {
        fileStorage.set(filename, content);
        break;
      }
    }
  }

  return logs;
}

self.addEventListener("message", async (evt) => {
  const message = evt.data as Message;

  let result: unknown;

  switch (message.type) {
    case MessageType.Compile: {
      result = await compile(message.files, message.features);
      break;
    }
  }

  evt.ports[0]?.postMessage(result);
});

self.addEventListener("fetch", (evt) => {
  const url = new URL(evt.request.url);

  if (url.origin === self.origin) {
    const match = /\/preview\/(.+)$/.exec(url.pathname);
    if (!match) return;

    const filename = match[1] as string;
    const content = fileStorage.get(filename);
    if (content) {
      const headers = new Headers();
      headers.append("Content-Type", getMimeType(filename));
      evt.respondWith(new Response(content, { headers }));
    }
  }
});
