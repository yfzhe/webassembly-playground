import { useEffect, useRef, useState, type ReactNode } from "react";
import cx from "classnames";

type DropdownProps = {
  entry: ReactNode;
  menu: ReactNode;
  autoClose?: boolean;
};

const Dropdown = ({ entry, menu, autoClose }: DropdownProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen(!open);

  const handleClick = () => {
    if (autoClose) {
      setOpen(false);
    }
  };

  useEffect(() => {
    const close = (evt: MouseEvent) => {
      if (!dropdownRef.current!.contains(evt.target as HTMLElement)) {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("click", close);
    }

    return () => {
      window.removeEventListener("click", close);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className={cx("dropdown", { open })}>
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
