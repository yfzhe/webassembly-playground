import { useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { GitHub } from "react-feather";

import type { File } from "../types";
import { compile } from "../service/lib";
import {
  compileLogsAtom,
  consoleLogsAtom,
  featuresAtom,
  filesAtom,
  previewIdAtom,
  utilPanelTabAtom,
} from "../state";

import CodeBlock, { type CodeBlockRef } from "./CodeBlock";
import ExampleSelector from "./ExampleSelector";
import Preview from "./Preview";
import UtilPanel from "./UtilPanel";
import "../style.css";
import Features from "./Features";

const GITHUB_REPO_URL = "https://github.com/yfzhe/webassembly-playground";

function App() {
  const files = useAtomValue(filesAtom);
  const features = useAtomValue(featuresAtom);
  const preview = useSetAtom(previewIdAtom);
  const setConsoleLogs = useSetAtom(consoleLogsAtom);
  const setCompileLogs = useSetAtom(compileLogsAtom);
  const setUtilPanelTab = useSetAtom(utilPanelTabAtom);

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

    const logs = await compile(sw, files, features);
    setCompileLogs(logs);

    if (logs.some((log) => log.result === "err")) {
      setUtilPanelTab("compile_log");
    } else {
      setConsoleLogs([]);
      setUtilPanelTab("console");
      preview();
    }
  };

  const renderNavBar = () => {
    return (
      <nav className="navbar">
        <ul className="nav">
          <li>
            <ExampleSelector />
          </li>
          <li>
            <Features />
          </li>
          <li>
            <div className="nav-item" onClick={run}>
              Run
            </div>
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
        <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
          <GitHub />
        </a>
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
