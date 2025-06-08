// Learned alot from https://github.com/suren-atoyan/monaco-react

import {
  forwardRef,
  use,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import * as monaco from "monaco-editor";

import startLangserverPromise from "./langserver";

export type EditorProps = {
  value: string;
  language?: string;
  onChange: (value: string) => void;
};

export type EditorRef = {
  getEditor(): monaco.editor.IStandaloneCodeEditor | null;
};

// TODO: remove `forwardRef` once figuring out how to type the direct `ref`.
const Editor = forwardRef<EditorRef, EditorProps>(
  ({ value, language, onChange }, ref) => {
    use(startLangserverPromise);

    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const preventOnChangeEventRef = useRef<boolean>(false);

    useImperativeHandle(ref, () => ({
      getEditor: () => editorRef.current,
    }));

    const editorRefCallback = useCallback<React.RefCallback<HTMLDivElement>>(
      (editorDom) => {
        editorRef.current?.dispose();
        editorRef.current = null;

        if (editorDom) {
          const editor = monaco.editor.create(editorDom, {
            value,
            language,
            automaticLayout: true,
            tabSize: 2,
            minimap: { enabled: false },
          });
          editorRef.current = editor;
        }

        return () => {
          editorRef.current?.dispose();
          editorRef.current = null;
        };
      },
      [],
    );

    useEffect(() => {
      const editor = editorRef.current;
      if (!editor) return;

      if (editor.getValue() !== value) {
        preventOnChangeEventRef.current = true;

        editor.executeEdits(null, [
          {
            forceMoveMarkers: true,
            range: editor.getModel()!.getFullModelRange(),
            text: value,
          },
        ]);
        editor.pushUndoStop();

        preventOnChangeEventRef.current = false;
      }
    }, [value]);

    useEffect(() => {
      const editor = editorRef.current;
      if (!editor || !onChange) return;

      const subscription = editor.onDidChangeModelContent(() => {
        if (!preventOnChangeEventRef.current) {
          onChange(editor.getValue());
        }
      });

      return () => {
        subscription.dispose();
      };
    }, [onChange]);

    useEffect(() => {
      const editor = editorRef.current;
      if (!editor || !language) return;

      const model = editor.getModel();
      if (model && model.getLanguageId() !== language) {
        monaco.editor.setModelLanguage(model, language);
      }
    }, [language]);

    return <div ref={editorRefCallback} />;
  },
);

export default Editor;
