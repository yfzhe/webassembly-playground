import { useCallback, useRef, useState } from "react";

import examples from "./examples/examples";
import Block from './Block';
import Preview from "./Preview";
import "./style.css";

const wabt = await import("wabt")
  .then(({ default: initWabt }) => initWabt())

function App() {
  const taWasm = useRef<HTMLTextAreaElement>(null);
  const taJs = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  const [log, setLog] = useState<string | null>(null);

  const run = useCallback(() => {
    try {
      const module = wabt.parseWat("file.wat", taWasm.current!.value, {});
      module.validate();
      const { buffer, log } = module.toBinary({ log: true });
      setLog(log);

      const blob = new Blob([buffer], { type: "application/wasm" });
      const blobUrl = URL.createObjectURL(blob);
      const js = taJs.current!.value;
      previewRef.current!
        .contentWindow
        ?.postMessage({ js, blobUrl }, { targetOrigin: "*" /* FIXME */ });
    } catch (e) {
      setLog((e as Error).message);
    }
  }, [])

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
            <Preview ref={previewRef} />
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
