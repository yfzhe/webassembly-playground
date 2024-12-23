import { memo, useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Decode, Hook, Unhook } from "console-feed";
import type { HookedConsole } from "console-feed/lib/definitions/Console";

import { consoleLogsAtom, previewIdAtom } from "../state";

function Preview() {
  const previewId = useAtomValue(previewIdAtom);
  const setConsoleLogs = useSetAtom(consoleLogsAtom);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    let hooked: HookedConsole | undefined;

    const appendConsoleLogs =
      // @ts-expect-error  why there are two `Message` types in the same package...
      (log) => setConsoleLogs((logs) => [...logs, Decode(log)]);

    if (iframe) {
      hooked = Hook(iframe.contentWindow!.window.console, appendConsoleLogs);
    }

    return () => {
      if (hooked) {
        Unhook(hooked);
      }
    };
  }, [previewId]);

  return (
    <div className="preview">
      {!!previewId && (
        <iframe key={previewId} ref={iframeRef} src="./preview/index.html" />
      )}
    </div>
  );
}

export default memo(Preview);
