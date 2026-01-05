import { atom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import type { Message as ConsoleMessage } from "console-feed/lib/definitions/Component";

import { compile, type CompileLog } from "../service/lib";
import {
  projectSchema,
  type Example,
  type File,
  type WasmFeatures,
} from "../types";
import { WASM_FEATURES_LIST } from "../features";
import examples from "../examples.json";

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

// `previewId` is a uuid or null.
// We use an iframe for preview, and `previewId` is used as the key for the
// iframe element. When a new preview session is created, `previewId` is
// updated with a new uuid, then a new iframe element will be rendered.
// The null value of `previewId` means there is no preview session.
const _previewIdAtom = atom<string | null>(null);

export const previewIdAtom = atom((get) => get(_previewIdAtom));

export const runAtom = atom(null, async (get, set) => {
  const files = get(filesAtom);
  const features = get(featuresAtom);

  const logs = await compile(files, features);
  set(compileLogsAtom, logs);

  if (logs.some((log) => log.result === "err")) {
    set(utilPanelTabAtom, "compile_log");
  } else {
    set(consoleLogsAtom, []);
    set(utilPanelTabAtom, "console");
    set(_previewIdAtom, uuidv4());
  }
});

export const selectExampleAtom = atom(null, (_get, set, example: Example) => {
  set(filesAtom, example.files);
  if (example.features) {
    set(featuresAtom, example.features);
  }
  set(_previewIdAtom, null);
  set(consoleLogsAtom, []);
  set(compileLogsAtom, []);
});

export type UtilPanelTab = "console" | "compile_log";

export const utilPanelTabAtom = atom<UtilPanelTab>("console");

export const shareAtom = atom(null, async (get, _set) => {
  const files = get(filesAtom);
  const features = get(featuresAtom);

  const data = JSON.stringify({ files, features });
  const compressed = compressToEncodedURIComponent(data);

  const url = new URL(location.href);
  url.hash = compressed;
  await navigator.clipboard.writeText(url.href);
});

export const loadProjectFromUrlAtom = atom(null, (_get, set) => {
  const { hash } = location;
  if (!hash) return;

  try {
    const json = decompressFromEncodedURIComponent(hash.substring(1));
    const data = JSON.parse(json);
    const project = projectSchema.parse(data);

    const { files, features } = project;
    set(filesAtom, files);
    set(featuresAtom, features);
  } catch (e) {
    // failed to load project from url
  } finally {
    const url = new URL(location.href);
    url.hash = "";
    history.replaceState(null, "", url);
  }
});
