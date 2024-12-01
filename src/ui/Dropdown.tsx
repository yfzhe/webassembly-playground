import { useState, type ReactNode } from "react";
import cx from "classnames";

type DropdownProps = {
  entry: ReactNode;
  menu: ReactNode;
  autoClose?: boolean;
};

const Dropdown = ({ entry, menu, autoClose }: DropdownProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const toggle = () => setOpen(!open);

  const handleClick = () => {
    if (autoClose) {
      setOpen(false);
    }
  };

  return (
    <div className={cx("dropdown", { open })}>
      <div className="dropdown-entry" onClick={toggle}>
        {entry}
      </div>
      {open && (
        <div className="dropdown-menu" onClick={handleClick}>
          {menu}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
