import { compile } from "./service/lib";
import examples from "./examples/examples";
import "./style.css";

const example = examples[0]!;

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

const taWat = document.createElement("textarea");
const taJs = document.createElement("textarea");
taWat.value = example.wat;
taJs.value = example.js;
codePanel.append(
  createBlock("WAT", taWat),
  createBlock("JavaScript", taJs)
);

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
  iframe.src = "./preview.html";

  previewBlock.append(iframe);
}

resultPanel.append(
  previewBlock,
  createBlock("Compile Log", logD)
);

button.onclick = async () => {
  const worker = navigator.serviceWorker.controller;

  if (worker) {
    const log = await compile(worker, [
      {
        filename: "main.wat",
        content: taWat.value,
      },
      {
        filename: "preview.js",
        content: taJs.value,
      }
    ]);

    preview();
    logD.innerText = log;
  }
};
