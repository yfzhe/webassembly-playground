import { extname } from "../util";

describe("extname", () => {
  test("basic", () => {
    expect(extname("index.html")).toBe(".html");
  });
  test("contains multiple dots", () => {
    expect(extname("index.coffee.md")).toBe(".md");
  });
  test("ends with dot", () => {
    expect(extname("index.")).toBe(".");
  });
  test("contains no dots", () => {
    expect(extname("index")).toBe("");
  });
  test("starts with dot", () => {
    expect(extname(".index")).toBe("");
  });
  test("starts with dot, but contains multiple dots", () => {
    expect(extname(".index.md")).toBe(".md");
  });
});
