// About service worker and typescript, see:
// - https://joshuatz.com/posts/2021/strongly-typed-service-workers/
// - https://github.com/Microsoft/TypeScript/issues/14877#issuecomment-340279293

/// <reference lib="webworker" />
declare const self : ServiceWorkerGlobalScope;

import initWabt from "wabt";
import { MessageType } from "./lib";

let wabt: Awaited<ReturnType<typeof initWabt>>;

const cache: Map<string, string | Uint8Array> = new Map();

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    initWabt().then(_wabt => { wabt = _wabt; })
  );
});

self.addEventListener("activate", (evt) => {
  console.log('Service worker is ready!');
});

type CompileData = {
  type: MessageType.Compile,
  files: Array<{ filename: string, content: string }>,
}

const compile = (data: CompileData) => {
  const { files } = data;

  cache.clear();

  let logs: Array<string> = [];

  for (const file of files) {
    const { filename, content } = file;
    if (/\.wasm$/.test(filename)) {
      try {
        const module = wabt.parseWat(filename, content, {});
        module.validate();
        const result = module.toBinary({ log: true });
        cache.set(filename, result.buffer);
        logs.push(result.log);
      } catch (e) {
        logs.push((e as Error).message);
      }
    } else if (/\.js$/.test(filename)) {
      cache.set(filename, content);
    }
  }

  return logs.join("\n");
}

self.addEventListener("message", (evt) => {
  let result: unknown;

  switch (evt.data.type) {
    case MessageType.Compile: {
      result = compile(evt.data);
      break;
    }
  }

  evt.ports[0]?.postMessage(result);
});

self.addEventListener("fetch", (evt) => {
  const url = new URL(evt.request.url);

  if (url.origin === self.origin) {
    const content = cache.get(url.pathname.substring(1));
    if (content) {
      const [_, ext] = /\.(.+)$/.exec(url.pathname)!;
      const headers = new Headers();
      const contentType = (() => {
        switch (ext) {
          case "wasm": return "application/wasm";
          case "js": return "application/javascript; charset=utf-8";
          default: return "";
        }
      })();
      headers.append("Content-Type", contentType);
      evt.respondWith(new Response(content, { headers }));
    }
  }
});
