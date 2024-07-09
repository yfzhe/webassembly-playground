const wat =
  `(module
  (func (export "add") (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.add))`

const js =
  `const wasm = await WebAssembly.instantiateStreaming(fetch("add.wasm"), {});
const { add } = wasm.instance.exports;
for (let i = 0; i < 10; i++) {
  console.log(add(i, i));
}`

export default [
  {
    title: "add",
    files: [
      {
        filename: "add.wat",
        content: wat,
      },
      {
        filename: "index.js",
        content: js,
      }
    ],
  }
]
