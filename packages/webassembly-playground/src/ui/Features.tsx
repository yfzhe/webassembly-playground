import { useAtom } from "jotai";

import { WASM_FEATURES_LIST, type WasmFeature } from "../features";
import { featuresAtom } from "../state";
import Dropdown from "./Dropdown";

const Features = () => {
  const [features, setFeatures] = useAtom(featuresAtom);

  const handleToggle =
    (flag: WasmFeature) => (evt: React.ChangeEvent<HTMLInputElement>) => {
      setFeatures({ ...features, [flag]: evt.target.checked });
    };

  const renderMenu = () => {
    return WASM_FEATURES_LIST.map(({ name, flag }) => {
      const checked = features[flag] ?? false;

      return (
        <div key={flag} className="dropdown-menu-item wasm-feature">
          <label htmlFor={flag}>{name}</label>
          <input
            type="checkbox"
            id={flag}
            checked={checked}
            onChange={handleToggle(flag)}
          />
        </div>
      );
    });
  };

  return (
    <Dropdown
      entry={<div className="nav-item">WebAssembly Features</div>}
      menu={renderMenu()}
    />
  );
};

export default Features;
