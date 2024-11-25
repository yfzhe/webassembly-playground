import { useRef, useState } from "react";
import { GitHub } from "react-feather";

import type { File } from "../types";
import { compile } from "../service/lib";
import CodeBlock, { type CodeBlockRef } from "./CodeBlock";
import examples from "../examples/index.json";
import "../style.css";

type Project = {
  files: File[];
};

const GITHUB_REPO_URL = "https://github.com/yfzhe/webassembly-playground";

function App() {
  const [project, setProject] = useState<Project>(examples[0]!);
  const codeBlocksRef = useRef(new Map<string, CodeBlockRef>());

  // This `previewId` state is an self-incremental integer.
  // We use an iframe for preview, and `previewId` is used as the key for the
  // iframe element. When a new preview session is excuated, `previewId` is
  // incremented by 1, where a new iframe element will be rendered.
  // The initial value of `previewId` is 0, which means there is no preview session.
  const [previewId, setPreviewId] = useState<number>(0);

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
    setPreviewId((id) => id + 1);
  };

  const handleSelectExample = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = evt.target;
    const example = examples.find((ex) => ex.title === value);
    if (example) {
      setProject(example);
    }
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
      <nav className="navbar">
        <ul className="nav">
          <li className="example-selector">
            <select onChange={handleSelectExample}>
              {examples.map((example) => {
                const { title } = example;
                return (
                  <option key={title} value={title}>
                    {title}
                  </option>
                );
              })}
            </select>
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
      <main>
        <div className="code">
          {project.files.map((file) => {
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
          })}
        </div>
        <div className="result">
          {Boolean(previewId > 0) && (
            <iframe
              key={previewId}
              className="preview"
              src="./preview/index.html"
            />
          )}
        </div>
      </main>
    </>
  );
}

export default App;
