export function assert(value: unknown): asserts value {}

export function getLanguageByFileName(filename?: string) {
  const ext = filename?.split(".").pop();
  switch (ext) {
    case "wat":
      return "wat";
    case "js":
      return "javascript";
    default:
      return "plaintext";
  }
}
