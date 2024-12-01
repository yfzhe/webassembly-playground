import { useSetAtom } from "jotai";

import type { Example } from "../types";
import { featuresAtom, filesAtom } from "../state";
import Dropdown from "./Dropdown";
import examples from "../examples/index.json";

function Examples() {
  const setFiles = useSetAtom(filesAtom);
  const setFeatures = useSetAtom(featuresAtom);

  const selectExample = (example: Example) => () => {
    setFiles(example.files);

    if (example.features) {
      setFeatures(example.features);
    }
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

export default Examples;
