export function extname(filename: string): string {
  return /.+(\.[^.]*)$/.exec(filename)?.[1] ?? "";
}

export function getLanguageByFileName(filename?: string) {
  const ext = extname(filename ?? "");
  switch (ext) {
    case ".wat":
      return "wat";
    case ".js":
      return "javascript";
    default:
      return "plaintext";
  }
}

export function getMimeType(filename: string): string {
  const ext = extname(filename);
  switch (ext) {
    case ".wasm":
      return "application/wasm";
    case ".js":
      return "application/javascript; charset=utf-8";
    default:
      return "text/plain";
  }
}
