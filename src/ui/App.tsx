import { lazy, Suspense, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";

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

import type { EditorRef } from "./Editor";
import Examples from "./Examples";
import Features from "./Features";
import Preview from "./Preview";
import UtilPanel from "./UtilPanel";
import "../style.css";

const GITHUB_REPO_URL = "https://github.com/yfzhe/webassembly-playground";

const Editor = lazy(() => import("./Editor"));

function App() {
  const files = useAtomValue(filesAtom);
  const features = useAtomValue(featuresAtom);
  const setPreviewId = useSetAtom(previewIdAtom);
  const setConsoleLogs = useSetAtom(consoleLogsAtom);
  const setCompileLogs = useSetAtom(compileLogsAtom);
  const setUtilPanelTab = useSetAtom(utilPanelTabAtom);

  const codeBlocksRef = useRef(new Map<string, EditorRef>());

  const preview = () => {
    setPreviewId((id) => id + 1);
  };

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

  const renderLoading = () => {
    return <div className="main-loading">Loading...</div>;
  };

  const renderNavBar = () => {
    return (
      <nav className="navbar">
        <ul className="nav">
          <li>
            <Examples />
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
      <div key={filename} className="block">
        <div className="block-header">{filename}</div>
        <Editor
          initialContent={content}
          ref={(node) => {
            if (node) {
              codeBlocksRef.current.set(filename, node);
            } else {
              codeBlocksRef.current.delete(filename);
            }
          }}
        />
      </div>
    );
  };

  return (
    <>
      <header className="site-header">
        <h1 className="title">WebAssembly Playground</h1>
        <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </header>
      <main className="app-main">
        <Suspense fallback={renderLoading()}>
          {renderNavBar()}
          <div className="editors">{files.map(renderFileCodeBlock)}</div>
          <Preview />
          <UtilPanel />
        </Suspense>
      </main>
    </>
  );
}

export default App;
