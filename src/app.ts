import * as monaco from "monaco-editor";

import { compile } from "./service/lib";
import examples from "./examples/index.json";
import type { File } from "./types";
import "./style.css";

document.body.innerHTML = `
<header>
  <h1 class="title">WebAssembly Playground</h1>
  <nav>
    <select id="select-example"></select>
    <button id="run">run</button>
  </nav>
</header>
<main>
  <div class="code"></div>
  <div class="result"></div>
</main>
`;

const codePanel = document.querySelector("div.code")!;
const resultPanel = document.querySelector("div.result")!;

let editors: Record<string, monaco.editor.IStandaloneCodeEditor> = {};

function createBlock(title: string, content: HTMLElement) {
  const block = document.createElement("div");
  block.className = "block";

  const header = document.createElement("div");
  header.className = "block-header";
  header.innerText = title;

  block.append(header, content);
  return block;
}

function setupExample(example: (typeof examples)[number]) {
  codePanel.replaceChildren();
  editors = {};

  for (const file of example.files) {
    const { filename, content } = file;

    const container = document.createElement("div");
    const editor = monaco.editor.create(container, {
      value: content,
      automaticLayout: true,
      minimap: { enabled: false },
    });

    codePanel.append(createBlock(filename, container));
    editors[filename] = editor;
  }
}

const previewBlock = createBlock("Preview", document.createElement("iframe"));
resultPanel.append(previewBlock);

function preview() {
  const previous = previewBlock.querySelector("iframe");
  if (previous) {
    previewBlock.removeChild(previous);
  }

  const iframe = document.createElement("iframe");
  iframe.className = "preview";
  iframe.src = "./preview/index.html";

  previewBlock.append(iframe);
}

const exampleSelector = document.getElementById(
  "select-example",
) as HTMLSelectElement;

for (const example of examples) {
  exampleSelector.append(new Option(example.title, example.title));
}

exampleSelector.onchange = (evt) => {
  const { value } = evt.target as HTMLSelectElement;
  const example = examples.find((ex) => ex.title === value)!;
  setupExample(example);
};

setupExample(examples[0]!);

const button = document.querySelector("button#run") as HTMLButtonElement;
button.onclick = async () => {
  const sw = navigator.serviceWorker.controller;
  if (!sw) return;

  const files = Object.entries(editors).map(
    ([filename, editor]): File => ({
      filename,
      content: editor.getValue(),
    }),
  );
  await compile(sw, files);
  preview();
};
