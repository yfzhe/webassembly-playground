import { atom } from "jotai";
import type { Message as ConsoleMessage } from "console-feed/lib/definitions/Component";

import type { CompileLog } from "../service/lib";
import { type Example, type File } from "../types";
import { WASM_FEATURES_LIST, type WasmFeatures } from "../features";
import examples from "../examples/index.json";

// Use the example "add" as default
export const filesAtom = atom<Array<File>>(examples[1]!.files);

const defaultFeatures: WasmFeatures = Object.fromEntries(
  WASM_FEATURES_LIST.filter((feat) => feat.isDefault).map((feat) => [
    feat.flag,
    true,
  ]),
);
export const featuresAtom = atom<WasmFeatures>(defaultFeatures);

export const consoleLogsAtom = atom<Array<ConsoleMessage>>([]);

export const compileLogsAtom = atom<Array<CompileLog>>([]);

// This `previewId` state is an self-incremental integer.
// We use an iframe for preview, and `previewId` is used as the key for the
// iframe element. When a new preview session is created, `previewId` is
// incremented by 1, where a new iframe element will be rendered.
// The initial value of `previewId` is 0, which means there is no preview session.
export const previewIdAtom = atom<number>(0);

export const selectExampleAtom = atom(null, (_get, set, example: Example) => {
  set(filesAtom, example.files);
  if (example.features) {
    set(featuresAtom, example.features);
  }
  set(previewIdAtom, 0);
  set(consoleLogsAtom, []);
  set(compileLogsAtom, []);
});

export type UtilPanelTab = "console" | "compile_log";

export const utilPanelTabAtom = atom<UtilPanelTab>("console");
