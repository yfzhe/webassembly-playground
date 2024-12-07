import { useSetAtom } from "jotai";

import { selectExampleAtom } from "../state";
import examples from "../examples.json";
import Dropdown from "./Dropdown";

function Examples() {
  const selectExample = useSetAtom(selectExampleAtom);

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
            onClick={() => selectExample(example)}
          >
            {title}
          </div>
        );
      })}
    />
  );
}

export default Examples;
