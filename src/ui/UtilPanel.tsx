import { useAtomValue } from "jotai";
import { Console } from "console-feed";

import { consoleLogsAtom } from "../state";

// TODO: better name?

function UtilPanel() {
  const consoleLogs = useAtomValue(consoleLogsAtom);

  return (
    <div className="util-panels">
      <div className="tabs">
        <div className="tab">Console</div>
      </div>
      <div className="console-log">
        <Console logs={consoleLogs} />
      </div>
    </div>
  );
}

export default UtilPanel;
