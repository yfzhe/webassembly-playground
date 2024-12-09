import { forwardRef, use, useEffect, useImperativeHandle, useRef } from "react";
import * as monaco from "monaco-editor";

import startLangserverPromise from "./langserver";

export type EditorProps = {
  initialContent?: string;
  language?: string;
};

export type EditorRef = {
  getEditor(): monaco.editor.IStandaloneCodeEditor | null;
};

// TODO: remove `forwardRef` once figuring out how to type the direct `ref`.
const Editor = forwardRef<EditorRef, EditorProps>(
  ({ initialContent, language }, ref) => {
    use(startLangserverPromise);

    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getEditor: () => editorRef.current,
    }));

    useEffect(() => {
      const editor = monaco.editor.create(containerRef.current!, {
        value: initialContent,
        language,
        automaticLayout: true,
        tabSize: 2,
        minimap: { enabled: false },
      });
      editorRef.current = editor;

      return () => {
        editor.dispose();
      };
    }, [initialContent]);

    useEffect(() => {
      const editor = editorRef.current;
      if (!editor || !language) return;

      const model = editor.getModel();
      if (model && model.getLanguageId() !== language) {
        monaco.editor.setModelLanguage(model, language);
      }
    }, [language]);

    return <div ref={containerRef} />;
  },
);

export default Editor;
