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
  pullDiagnostics(model: monaco.editor.ITextModel): any;
};

export async function startLanguageServer(): Promise<LanguageServerWrapper> {
  await init();
  const languageServer = new LanguageServer();

  const declarationProvider = monaco.languages.registerDeclarationProvider(
    "wat",
    {
      provideDeclaration(model, position) {
        return p2m.asDefinitionResult(
          languageServer.gotoDeclaration(
            m2p.asTextDocumentPositionParams(model, position),
          ),
        );
      },
    },
  );
  const definitionProvider = monaco.languages.registerDefinitionProvider(
    "wat",
    {
      provideDefinition(model, position) {
        return p2m.asDefinitionResult(
          languageServer.gotoDefinition(
            m2p.asTextDocumentPositionParams(model, position),
          ),
        );
      },
    },
  );
  const documentSymbolProvider =
    monaco.languages.registerDocumentSymbolProvider("wat", {
      provideDocumentSymbols(model) {
        return p2m.asDocumentSymbols(
          languageServer.documentSymbol(m2p.asDocumentSymbolParams(model)),
        );
      },
    });
  const foldingRangeProvider = monaco.languages.registerFoldingRangeProvider(
    "wat",
    {
      provideFoldingRanges(model) {
        return p2m.asFoldingRanges(
          languageServer.foldingRange({
            textDocument: m2p.asTextDocumentIdentifier(model),
          }),
        );
      },
    },
  );
  const formattingProvider =
    monaco.languages.registerDocumentFormattingEditProvider("wat", {
      provideDocumentFormattingEdits(model, options) {
        return p2m.asTextEdits(
          languageServer.formatting(
            m2p.asDocumentFormattingParams(model, options),
          ),
        );
      },
    });
  const hoverProvider = monaco.languages.registerHoverProvider("wat", {
    provideHover(model, position) {
      return p2m.asHover(
        languageServer.hover(m2p.asTextDocumentPositionParams(model, position)),
      );
    },
  });
  const rangeFormattingProvider =
    monaco.languages.registerDocumentRangeFormattingEditProvider("wat", {
      provideDocumentRangeFormattingEdits(model, range, options) {
        return p2m.asTextEdits(
          languageServer.rangeFormatting(
            m2p.asDocumentRangeFormattingParams(model, range, options),
          ),
        );
      },
    });
  const referenceProvider = monaco.languages.registerReferenceProvider("wat", {
    provideReferences(model, position, context) {
      return p2m.asReferences(
        languageServer.findReferences(
          m2p.asReferenceParams(model, position, context),
        ),
      );
    },
  });
  const renameProvider = monaco.languages.registerRenameProvider("wat", {
    provideRenameEdits(model, position, newName) {
      return p2m.asWorkspaceEdit(
        languageServer.rename(m2p.asRenameParams(model, position, newName)),
      );
    },
  });
  const typeDefinitionProvider =
    monaco.languages.registerTypeDefinitionProvider("wat", {
      provideTypeDefinition(model, position) {
        return p2m.asDefinitionResult(
          languageServer.gotoTypeDefinition(
            m2p.asTextDocumentPositionParams(model, position),
          ),
        );
      },
    });

  return {
    commit(uri, content) {
      languageServer.commit(uri, content);
    },
    pullDiagnostics(model) {
      return languageServer.pullDiagnostics({
        textDocument: m2p.asTextDocumentIdentifier(model),
      });
    },
    dispose() {
      declarationProvider.dispose();
      definitionProvider.dispose();
      documentSymbolProvider.dispose();
      foldingRangeProvider.dispose();
      formattingProvider.dispose();
      hoverProvider.dispose();
      rangeFormattingProvider.dispose();
      referenceProvider.dispose();
      renameProvider.dispose();
      typeDefinitionProvider.dispose();
      languageServer.free();
    },
  };
}

const languageServerPromise = startLanguageServer();

monaco.editor.onDidCreateModel(async (model) => {
  if (model.getLanguageId() === "wat") {
    const languageServer = await languageServerPromise;
    languageServer.commit(model.uri.toString(), model.getValue());
    updateDiagnosticMarkers(languageServer, model);

    model.onDidChangeContent(() => {
      languageServer.commit(model.uri.toString(), model.getValue());
      updateDiagnosticMarkers(languageServer, model);
    });
  }
});

function updateDiagnosticMarkers(
  languageServer: LanguageServerWrapper,
  model: monaco.editor.ITextModel,
) {
  const diagnostics = languageServer.pullDiagnostics(model);
  monaco.editor.setModelMarkers(
    model,
    "wat",
    p2m.asDiagnostics(diagnostics.get("items")) ?? [],
  );
}
