import { useAtom, useAtomValue } from "jotai";
import cx from "clsx";
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
      <div
        key={tab}
        className={cx("util-panel-tab", { active: tab === curTab })}
        onClick={() => setCurTab(tab)}
      >
        {TAB_TITLES[tab]}
      </div>
    );
  };

  const renderContent = () => {
    switch (curTab) {
      case "console": {
        return <Console logs={consoleLogs} />;
      }

      case "compile_log": {
        // TODO: support displaying logs for multiple wat files.
        const log = compileLogs[0];

        return (
          <pre className="compile-log">
            <code>{log?.log}</code>
          </pre>
        );
      }
    }
  };

  return (
    <div className="util-panel">
      <div className="util-panel-tabs">
        {(Object.keys(TAB_TITLES) as Array<UtilPanelTab>).map(renderTab)}
      </div>
      <div className="util-panel-content">{renderContent()}</div>
    </div>
  );
}

export default UtilPanel;
