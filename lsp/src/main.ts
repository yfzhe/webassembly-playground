import {
  BrowserMessageReader,
  BrowserMessageWriter,
  createConnection,
} from "vscode-languageserver/browser";
import { LanguageServer } from "../pkg/lsp";

export function startLanguageServer() {
  const messageReader = new BrowserMessageReader(
    self as DedicatedWorkerGlobalScope,
  );
  const messageWriter = new BrowserMessageWriter(
    self as DedicatedWorkerGlobalScope,
  );
  const connection = createConnection(messageReader, messageWriter);
  const languageServer = new LanguageServer();

  connection.onInitialize((params) => languageServer.initialize(params));
  connection.onDidOpenTextDocument((params) => {
    languageServer.commit(params.textDocument.uri, params.textDocument.text);
  });
  connection.onDidChangeTextDocument((params) => {
    languageServer.commit(
      params.textDocument.uri,
      params.contentChanges[0]!.text,
    );
  });
  connection.onHover((params) => languageServer.hover(params));

  connection.listen();

  return connection;
}
