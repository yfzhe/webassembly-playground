import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import * as monaco from "monaco-editor";

export type EditorProps = {
  initialContent?: string;
};

export type EditorRef = {
  getEditor(): monaco.editor.IStandaloneCodeEditor | null;
};

const Editor = forwardRef<EditorRef, EditorProps>(({ initialContent }, ref) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useImperativeHandle(ref, () => ({
    getEditor: () => editorRef.current,
  }));

  const editorDomCallbackRef = useCallback(
    (editorDom: HTMLDivElement | null) => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }

      if (editorDom) {
        const editor = monaco.editor.create(editorDom, {
          value: initialContent,
          automaticLayout: true,
          tabSize: 2,
          minimap: { enabled: false },
        });
        editorRef.current = editor;
      }
    },
    [initialContent],
  );

  return <div ref={editorDomCallbackRef} />;
});

export default Editor;
