import { useCallback, useRef, useState, type ComponentProps } from "react";
import { GitHub } from "react-feather";

import type { File } from "../types";
import { compile } from "../service/lib";
import CodeBlock, { type CodeBlockRef } from "./CodeBlock";
import examples from "../examples/index.json";
import "../style.css";
import Preview from "./Preview";
import { Console, Decode } from "console-feed";
import type { Message } from "console-feed/lib/definitions/Console";

type ConsoleMessage = ComponentProps<typeof Console>["logs"][number];

type Project = {
  files: File[];
};

const GITHUB_REPO_URL = "https://github.com/yfzhe/webassembly-playground";

function App() {
  const [project, setProject] = useState<Project>(examples[0]!);
  const codeBlocksRef = useRef(new Map<string, CodeBlockRef>());
  const [consoleLogs, setConsoleLogs] = useState<Array<ConsoleMessage>>([]);

  // This `previewId` state is an self-incremental integer.
  // We use an iframe for preview, and `previewId` is used as the key for the
  // iframe element. When a new preview session is excuated, `previewId` is
  // incremented by 1, where a new iframe element will be rendered.
  // The initial value of `previewId` is 0, which means there is no preview session.
  const [previewId, _setPreviewId] = useState<number>(0);
  const preview = () => _setPreviewId((id) => id + 1);

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

  const appendConsoleLog = useCallback(
    // @ts-expect-error  why there are two `Message` types in the same package...
    (log: Message) => setConsoleLogs((logs) => [...logs, Decode(log)]),
    [],
  );

  const handleSelectExample = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = evt.target;
    const example = examples.find((ex) => ex.title === value);
    if (example) {
      setProject(example);
    }
  };

  const renderNavBar = () => {
    return (
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
        <div className="editors">{project.files.map(renderFileCodeBlock)}</div>
        <div className="preview">
          <Preview previewId={previewId} onConsoleLog={appendConsoleLog} />
        </div>
        <div className="util-panels">
          <div className="tabs">
            <div className="tab">Console</div>
          </div>
          <div className="console-log">
            <Console logs={consoleLogs} />
          </div>
        </div>
        <div></div>
      </main>
    </>
  );
}

export default App;
