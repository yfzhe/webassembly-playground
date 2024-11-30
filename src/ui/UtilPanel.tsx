import { useAtom, useAtomValue } from "jotai";
import { Console } from "console-feed";

import {
  compileLogsAtom,
  consoleLogsAtom,
  utilPanelTabAtom,
  type UtilPanelTab,
} from "../state";

const TAB_TITLES = {
  console: "Console",
  compile_log: "Compile Log",
};

// TODO: better name?
function UtilPanel() {
  const [curTab, setCurTab] = useAtom(utilPanelTabAtom);
  const consoleLogs = useAtomValue(consoleLogsAtom);
  const compileLogs = useAtomValue(compileLogsAtom);

  const renderTab = (tab: UtilPanelTab) => {
    return (
      <div key={tab} className="tab" onClick={() => setCurTab(tab)}>
        {TAB_TITLES[tab]}
      </div>
    );
  };

  const renderContent = () => {
    switch (curTab) {
      case "console": {
        return (
          <div className="console-log">
            <Console logs={consoleLogs} />
          </div>
        );
      }

      case "compile_log": {
        // TODO: support displaying logs for multiple wat files.
        const log = compileLogs[0];

        return (
          <div className="compile-log">
            {log && (
              <pre>
                <code>{log.log}</code>
              </pre>
            )}
          </div>
        );
      }
    }
  };

  return (
    <div className="util-panel">
      <div className="tabs">
        {(Object.keys(TAB_TITLES) as Array<UtilPanelTab>).map(renderTab)}
      </div>
      {renderContent()}
    </div>
  );
}

export default UtilPanel;
