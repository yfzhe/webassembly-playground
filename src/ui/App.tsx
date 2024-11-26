import { useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { GitHub } from "react-feather";

import type { File } from "../types";
import { compile } from "../service/lib";
import { filesAtom, previewIdAtom } from "../state";

import CodeBlock, { type CodeBlockRef } from "./CodeBlock";
import Examples from "./Examples";
import Preview from "./Preview";
import UtilPanel from "./UtilPanel";
import "../style.css";

const GITHUB_REPO_URL = "https://github.com/yfzhe/webassembly-playground";

function App() {
  const files = useAtomValue(filesAtom);
  const preview = useSetAtom(previewIdAtom);

  const codeBlocksRef = useRef(new Map<string, CodeBlockRef>());

  const run = async () => {
    const sw = navigator.serviceWorker.controller;
    if (!sw) return;

    const files = Array.from(codeBlocksRef.current.entries()).map(
      ([filename, ref]): File => ({
        filename,
        content: ref.getEditor()!.getValue(),
      }),
    );

    const logs = await compile(sw, files);
    // TODO: should I clear consoleLogs before starting a new preview session?
    preview();
  };

  const renderNavBar = () => {
    return (
      <nav className="navbar">
        <ul className="nav">
          <li className="example-selector">
            <Examples />
          </li>
        </ul>
        <ul>
          <li>
            <button id="run" onClick={run}>
              Run
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  const renderFileCodeBlock = (file: File) => {
    const { filename, content } = file;
    return (
      <CodeBlock
        key={filename}
        filename={filename}
        initialContent={content}
        ref={(node) => {
          if (node) {
            codeBlocksRef.current.set(filename, node);
          } else {
            codeBlocksRef.current.delete(filename);
          }
        }}
      />
    );
  };

  return (
    <>
      <header className="site-header">
        <h1 className="title">WebAssembly Playground</h1>
        <div>
          <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
            <GitHub />
          </a>
        </div>
      </header>
      {renderNavBar()}
      <main className="main">
        <div className="editors">{files.map(renderFileCodeBlock)}</div>
        <Preview />
        <UtilPanel />
      </main>
    </>
  );
}

export default App;
