import { useCallback, useRef, useState } from "react";

import { compile } from "./service/lib";
import examples from "./examples/examples";
import Block from './Block';
import Preview from "./Preview";
import "./style.css";

function App() {
  const taWasm = useRef<HTMLTextAreaElement>(null);
  const taJs = useRef<HTMLTextAreaElement>(null);

  const [previewId, setPreviewId] = useState<number>(0);

  const [log, setLog] = useState<string | null>(null);

  const run = useCallback(async () => {
    const worker = navigator.serviceWorker.controller;

    if (worker) {
      const log = await compile(worker, [
        {
          filename: "main.wat",
          content: taWasm.current!.value,
        },
        {
          filename: "preview.js",
          content: taJs.current!.value,
        }
      ]);

      setLog(log);
      setPreviewId((id) => id + 1);
    }
  }, []);

  const example = examples[0]!;

  return (
    <div className="app">
      <header>
        <h1 className="title">WebAssembly Playground</h1>
        <button onClick={run}>run</button>
      </header>
      <main>
        <div className="code">
          <Block title="WAT">
            <textarea ref={taWasm} defaultValue={example.wat} />
          </Block>
          <Block title="JavaScript">
            <textarea ref={taJs} defaultValue={example.js} />
          </Block>
        </div>
        <div className="splitter" />
        <div className="result">
          <Block title="Preview">
            <Preview key={previewId} />
          </Block>
          <Block title="Compile Log">
            <pre className="log">{log}</pre>
          </Block>
        </div>
      </main>
    </div>
  )
}

export default App;
