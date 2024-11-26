import { Hook, Unhook } from "console-feed";
import type { HookedConsole } from "console-feed/lib/definitions/Console";
import { memo, useEffect, useRef } from "react";

export type PreviewProps = {
  previewId: number;
  onConsoleLog: Parameters<typeof Hook>[1];
};

function Preview({ previewId, onConsoleLog }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    let hooked: HookedConsole | undefined;

    if (iframe) {
      iframe.addEventListener("load", () => {
        hooked = Hook(iframe.contentWindow!.window.console, onConsoleLog);
      });
    }

    return () => {
      if (hooked) {
        Unhook(hooked);
      }
    };
  }, [previewId]);

  if (previewId <= 0) return null;

  return <iframe key={previewId} ref={iframeRef} src="./preview/index.html" />;
}

export default memo(Preview);
