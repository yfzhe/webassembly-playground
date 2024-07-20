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
  <div class="splitter"></div>
  <div class="result"></div>
</main>
`;

const codePanel = document.querySelector("div.code")!;
const splitter = document.querySelector("div.splitter")!;
const resultPanel = document.querySelector("div.result")!;

function createBlock(title: string, content: HTMLElement) {
  const block = document.createElement("div");
  block.className = "block";

  const header = document.createElement("div");
  header.className = "block-header";
  header.innerText = title;

  block.append(header, content);
  return block;
}

function setupEditors(example: (typeof examples)[number]) {
  codePanel.replaceChildren();

  for (const file of example.files) {
    const { filename, content } = file;
    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.dataset.filename = filename;
    codePanel.append(createBlock(filename, textarea));
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
  setupEditors(example);
};

setupEditors(examples[0]!);

const button = document.querySelector("button#run") as HTMLButtonElement;
button.onclick = async () => {
  const sw = navigator.serviceWorker.controller;

  if (sw) {
    const textareas = document.querySelectorAll(".code textarea");
    const files = (Array.prototype.map<File>).call(
      textareas,
      (textarea: HTMLTextAreaElement) => ({
        filename: textarea.dataset.filename!,
        content: textarea.value,
      }),
    );
    await compile(sw, files);
    preview();
  }
};
