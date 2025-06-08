import { lazy, Suspense, useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";

import type { File } from "../types";
import {
  featuresAtom,
  filesAtom,
  loadProjectFromUrlAtom,
  runAtom,
  shareAtom,
} from "../state";
import { getLanguageByFileName } from "../lib/file";

import Examples from "./Examples";
import Features from "./Features";
import Preview from "./Preview";
import ToastContainer, { useToast } from "./Toast";
import UtilPanel from "./UtilPanel";
import "../style.css";

const GITHUB_REPO_URL = "https://github.com/yfzhe/webassembly-playground";

const Editor = lazy(() => import("../editor"));

function App() {
  const [files, setFiles] = useAtom(filesAtom);
  const run = useSetAtom(runAtom);
  const share = useSetAtom(shareAtom);
  const loadProjectFromUrl = useSetAtom(loadProjectFromUrlAtom);

  const toast = useToast();

  const updateFileContent = (filename: string, content: string) => {
    const newFiles = files.reduce<Array<File>>((acc, cur) => {
      const file = cur.filename === filename ? { ...cur, content } : cur;
      acc.push(file);
      return acc;
    }, []);
    setFiles(newFiles);
  };

  const handleShare = async () => {
    await share();
    toast("Link copied to clipboard.");
  };

  useEffect(() => {
    loadProjectFromUrl();
  }, []);

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
          <li>
            <div className="nav-item" onClick={handleShare}>
              Share
            </div>
          </li>
        </ul>
      </nav>
    );
  };

  const renderFileCodeBlock = (file: File) => {
    const { filename, content } = file;
    return (
      <div key={filename} className="code-block">
        <div className="code-block-header">{filename}</div>
        <Editor
          value={content}
          language={getLanguageByFileName(filename)}
          onChange={(value) => updateFileContent(filename, value)}
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
        <Suspense fallback={<div className="main-loading">Loading...</div>}>
          {renderNavBar()}
          <div className="editors">{files.map(renderFileCodeBlock)}</div>
          <Preview />
          <UtilPanel />
        </Suspense>
      </main>
      <ToastContainer />
    </>
  );
}

export default App;
