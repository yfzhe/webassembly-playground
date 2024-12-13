export function assert(value: unknown): asserts value {}

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
