import { memo, useCallback, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Decode, Hook, Unhook } from "console-feed";
import type { HookedConsole } from "console-feed/lib/definitions/Console";

import { consoleLogsAtom, previewIdAtom } from "../state";

function Preview() {
  const previewId = useAtomValue(previewIdAtom);
  const setConsoleLogs = useSetAtom(consoleLogsAtom);

  const iframeCallbackRef = useCallback<React.RefCallback<HTMLIFrameElement>>(
    (iframe) => {
      let hookedConsole: HookedConsole;

      const appendConsoleLogs =
        // @ts-expect-error  why there are two `Message` types in the same package...
        (log) => setConsoleLogs((logs) => [...logs, Decode(log)]);

      if (iframe === null) {
        throw new Error("This should not happen with React 19!");
      }

      hookedConsole = Hook(
        iframe.contentWindow!.window.console,
        appendConsoleLogs,
      );

      return () => {
        Unhook(hookedConsole);
      };
    },
    [],
  );

  return (
    <div className="preview">
      {!!previewId && (
        <iframe
          key={previewId}
          ref={iframeCallbackRef}
          src="./preview/index.html"
        />
      )}
    </div>
  );
}

export default memo(Preview);
