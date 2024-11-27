import { useSetAtom } from "jotai";

import { filesAtom } from "../state";
import examples from "../examples/index.json";

function Examples() {
  const setFiles = useSetAtom(filesAtom);

  const handleSelect = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = evt.target;
    const example = examples.find((ex) => ex.title === value);
    if (example) {
      setFiles(example.files);
    }
  };

  return (
    <select onChange={handleSelect}>
      {examples.map((example) => {
        const { title } = example;
        return (
          <option key={title} value={title}>
            {title}
          </option>
        );
      })}
    </select>
  );
}

export default Examples;
