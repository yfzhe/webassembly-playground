import { forwardRef } from "react";

const Preview = forwardRef<HTMLIFrameElement>((props, ref) => {
  return <iframe className="preview" ref={ref} src="./preview.html"></iframe>
})

export default Preview
