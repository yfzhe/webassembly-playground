import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { editor as monacoEditor } from "monaco-editor";

export type CodeBlockProps = {
  filename: string;
  initialContent?: string;
};

export type CodeBlockRef = {
  getEditor(): monacoEditor.IStandaloneCodeEditor | null;
};

const CodeBlock = forwardRef<CodeBlockRef, CodeBlockProps>(
  ({ filename, initialContent = "" }, ref) => {
    const editorRef = useRef<monacoEditor.IStandaloneCodeEditor | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getEditor: () => editorRef.current,
    }));

    useEffect(() => {
      const editor = monacoEditor.create(containerRef.current!, {
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
