import type { ReactNode } from "react";

type BlockProps = {
  title: string,
  children: ReactNode,
}

const Block = ({ title, children }: BlockProps) => {
  return (
    <div className="block">
      <div className="block-header">{title}</div>
      {children}
    </div>
  )
}

export default Block
