import { compile } from "./service/lib";
import examples from "./examples/index.json";
import "./style.css";

const example = examples[0]!;
const { files } = example;

function createBlock(title: string, content: HTMLElement) {
  const block = document.createElement("div");
  block.className = "block";

  const header = document.createElement("div");
  header.className = "block-header";
  header.innerText = title;

  block.append(header, content);
  return block;
}

const button = document.querySelector("button#run") as HTMLButtonElement;
const main = document.querySelector("main")!;

const codePanel = document.createElement("div");
codePanel.className = "code";
const splitter = document.createElement("div");
splitter.className = "splitter";
const resultPanel = document.createElement("div");
resultPanel.className = "result";

main.append(codePanel, splitter, resultPanel);

for (const file of files) {
  const { filename, content } = file;
  const textarea = document.createElement("textarea");
  textarea.value = content;
  codePanel.append(createBlock(filename, textarea));
}

const previewBlock = createBlock("preview", document.createElement("iframe"));
const logD = document.createElement("pre");
logD.className = "log";

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

resultPanel.append(previewBlock, createBlock("Compile Log", logD));

button.onclick = async () => {
  const worker = navigator.serviceWorker.controller;

  if (worker) {
    const textareas = document.querySelectorAll(".code textarea");
    const newFiles = [];
    for (let i = 0; i < files.length; i++) {
      newFiles.push({
        filename: files[i]!.filename,
        content: (textareas[i] as HTMLTextAreaElement).value,
      });
    }
    const log = await compile(worker, newFiles);

    preview();
    logD.innerText = log;
  }
};
