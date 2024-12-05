import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as monaco from "monaco-editor";
import { startLanguageServer, type LanguageServerWrapper } from "../lsp";

export type EditorProps = {
  initialContent?: string;
  filename?: string;
};

export type EditorRef = {
  getEditor(): monaco.editor.IStandaloneCodeEditor | null;
};

const Editor = forwardRef<EditorRef, EditorProps>(
  ({ initialContent, filename }, ref) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getEditor: () => editorRef.current,
    }));

    useEffect(() => {
      const language = getLanguageByFileName(filename);
      const editor = monaco.editor.create(containerRef.current!, {
        value: initialContent,
        language,
        automaticLayout: true,
        tabSize: 2,
        minimap: { enabled: false },
      });
      editorRef.current = editor;
      let languageServer: LanguageServerWrapper | undefined;
      if (language === "wat") {
        (async () => {
          languageServer = await startLanguageServer();
          const model = editor.getModel();
          if (model) {
            languageServer.commit(model.uri.toString(), model.getValue());
          }

          editor.onDidChangeModelContent(() => {
            const model = editor.getModel();
            if (model) {
              languageServer?.commit(model.uri.toString(), model.getValue());
            }
          });
        })();
      }

      return () => {
        editor.dispose();
        languageServer?.dispose();
      };
    }, [initialContent]);

    return <div ref={containerRef} />;
  },
);

export default Editor;

function getLanguageByFileName(filename?: string) {
  const ext = filename?.split(".").pop();
  switch (ext) {
    case "wat":
      return "wat";
    default:
      return "plaintext";
  }
}
