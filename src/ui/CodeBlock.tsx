import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as monaco from "monaco-editor";

export type CodeBlockProps = {
  filename: string;
  initialContent?: string;
};

export type CodeBlockRef = {
  getEditor(): monaco.editor.IStandaloneCodeEditor;
};

const CodeBlock = forwardRef<CodeBlockRef, CodeBlockProps>(
  ({ filename, initialContent = "" }, ref) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getEditor: () => editorRef.current!,
    }));

    useEffect(() => {
      const editor = monaco.editor.create(containerRef.current!, {
        value: initialContent,
        automaticLayout: true,
        minimap: { enabled: false },
      });
      editorRef.current = editor;

      return () => {
        editor.dispose();
      };
    }, [filename, initialContent]);

    return (
      <div className="block">
        <div className="block-header">{filename}</div>
        <div ref={containerRef} />
      </div>
    );
  },
);

export default CodeBlock;
