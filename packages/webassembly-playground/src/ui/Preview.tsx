import { memo, useCallback, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Decode, Hook, Unhook } from "console-feed";
import type { HookedConsole } from "console-feed/lib/definitions/Console";

import { consoleLogsAtom, previewIdAtom } from "../state";

function Preview() {
  const previewId = useAtomValue(previewIdAtom);
  const setConsoleLogs = useSetAtom(consoleLogsAtom);

  const hookedConsoleRef = useRef<HookedConsole | null>(null);

  const iframeCallbackRef = useCallback((iframe: HTMLIFrameElement | null) => {
    // TODO: use callbackref return value once React updated to 19, and we don't need hookedConsoleRef anymore
    if (hookedConsoleRef.current) {
      Unhook(hookedConsoleRef.current);
      hookedConsoleRef.current = null;
    }

    if (iframe) {
      const appendConsoleLogs =
        // @ts-expect-error  why there are two `Message` types in the same package...
        (log) => setConsoleLogs((logs) => [...logs, Decode(log)]);

      hookedConsoleRef.current = Hook(
        iframe.contentWindow!.window.console,
        appendConsoleLogs,
      );
    }
  }, []);

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
