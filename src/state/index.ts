import { atom } from "jotai";
import type { Message as ConsoleMessage } from "console-feed/lib/definitions/Component";

import type { CompileLog } from "../service/lib";
import type { File } from "../types";
import examples from "../examples/index.json";

// Use the example "add" as default
export const filesAtom = atom<Array<File>>(examples[1]!.files);

export const consoleLogsAtom = atom<Array<ConsoleMessage>>([]);

export const compileLogsAtom = atom<Array<CompileLog>>([]);

// This `previewId` state is an self-incremental integer.
// We use an iframe for preview, and `previewId` is used as the key for the
// iframe element. When a new preview session is created, `previewId` is
// incremented by 1, where a new iframe element will be rendered.
// The initial value of `previewId` is 0, which means there is no preview session.
const _previewId = atom<number>(0);
// Create a read-write atom to encapsulate this self-incrementation.
export const previewIdAtom = atom(
  (get) => get(_previewId),
  (get, set) => set(_previewId, get(_previewId) + 1),
);

export type UtilPanelTab = "console" | "compile_log";

export const utilPanelTabAtom = atom<UtilPanelTab>("console");
