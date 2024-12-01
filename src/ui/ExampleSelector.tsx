import { useSetAtom } from "jotai";

import type { Example } from "../types";
import { filesAtom } from "../state";
import Dropdown from "./Dropdown";
import examples from "../examples/index.json";

function ExampleSelector() {
  const setFiles = useSetAtom(filesAtom);

  const selectExample = (example: Example) => () => {
    setFiles(example.files);
  };

  return (
    <Dropdown
      autoClose
      entry={<div className="nav-item">Examples</div>}
      menu={examples.map((example) => {
        const { title } = example;
        return (
          <div
            key={title}
            className="dropdown-menu-item example-option"
            onClick={selectExample(example)}
          >
            {title}
          </div>
        );
      })}
    />
  );
}

export default ExampleSelector;
