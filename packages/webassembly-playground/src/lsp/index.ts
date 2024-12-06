import * as monaco from "monaco-editor";
import {
  MonacoToProtocolConverter,
  ProtocolToMonacoConverter,
} from "@codingame/monaco-languageclient";
import init, { LanguageServer } from "../../../../lsp/pkg/lsp";

export type LanguageServerWrapper = monaco.IDisposable & {
  commit(uri: string, content: string): void;
  pullDiagnostics(model: monaco.editor.ITextModel): any;
};

export async function startLanguageServer(): Promise<LanguageServerWrapper> {
  const [monaco] = await Promise.all([import("monaco-editor"), init()]);
  const languageServer = new LanguageServer();

  monaco.languages.register({ id: "wat", extensions: [".wat"] });
  monaco.languages.setMonarchTokensProvider("wat", {
    brackets: [{ open: "(", close: ")", token: "delimiter.parenthesis" }],
    keywords: [
      "module",
      "func",
      "type",
      "param",
      "result",
      "local",
      "end",
      "if",
      "then",
      "else",
      "block",
      "loop",
      "data",
      "elem",
      "declare",
      "export",
      "global",
      "memory",
      "import",
      "start",
      "table",
      "item",
      "offset",
      "mut",
    ],
    typeKeywords: ["i32", "i64", "f32", "f64", "v128", "funcref", "externref"],
    tokenizer: {
      root: [
        [
          /[a-z_$][\w.$]*/,
          {
            cases: {
              "@typeKeywords": "type.identifier",
              "@keywords": "keyword",
              "@default": "operators",
            },
          },
        ],
        [/$[\w.$-_]+/, "variable.name"],
        { include: "@whitespace" },
        [/[()]/, "@brackets"],
        [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
        [/0[xX][0-9a-fA-F]+/, "number.hex"],
        [/\d+/, "number"],
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
      ],
      comment: [
        [/[^;)]+/, "comment"],
        [/;\)/, "comment", "@pop"],
        [/[;)]/, "comment"],
      ],
      string: [
        [/[^\\"]+/, "string"],
        [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
      ],
      whitespace: [
        [/[ \t\r\n]+/, "white"],
        [/\(;/, "comment", "@comment"],
        [/;;.*$/, "comment"],
      ],
    },
  });

  const m2p = new MonacoToProtocolConverter(monaco);
  const p2m = new ProtocolToMonacoConverter(monaco);

  const createModelListener = monaco.editor.onDidCreateModel(async (model) => {
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
  const completionProvider = monaco.languages.registerCompletionItemProvider(
    "wat",
    {
      triggerCharacters: ["$", "("],
      provideCompletionItems(model, position, context) {
        return p2m.asCompletionResult(
          languageServer.completion(
            m2p.asCompletionParams(model, position, context),
          ),
          undefined,
        );
      },
    },
  );
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
      createModelListener.dispose();
      completionProvider.dispose();
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
