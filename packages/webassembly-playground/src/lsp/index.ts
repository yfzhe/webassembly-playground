import * as monaco from "monaco-editor";
import {
  MonacoToProtocolConverter,
  ProtocolToMonacoConverter,
} from "@codingame/monaco-languageclient";
import init, { LanguageServer } from "../../../../lsp/pkg/lsp";

monaco.languages.register({ id: "wat", extensions: [".wat"] });

const m2p = new MonacoToProtocolConverter(monaco);
const p2m = new ProtocolToMonacoConverter(monaco);

export type LanguageServerWrapper = monaco.IDisposable & {
  commit(uri: string, content: string): void;
};

export async function startLanguageServer(): Promise<LanguageServerWrapper> {
  await init();
  const languageServer = new LanguageServer();

  const hoverProvider = monaco.languages.registerHoverProvider("wat", {
    provideHover(model, position) {
      return p2m.asHover(
        languageServer.hover(m2p.asTextDocumentPositionParams(model, position)),
      );
    },
  });

  return {
    commit(uri, content) {
      languageServer.commit(uri, content);
    },
    dispose() {
      hoverProvider.dispose();
      languageServer.free();
    },
  };
}

const languageServerPromise = startLanguageServer();

monaco.editor.onDidCreateModel(async (model) => {
  if (model.getLanguageId() === "wat") {
    const languageServer = await languageServerPromise;
    languageServer.commit(model.uri.toString(), model.getValue());
    model.onDidChangeContent(() => {
      languageServer.commit(model.uri.toString(), model.getValue());
    });
  }
});
