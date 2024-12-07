const wasm = await WebAssembly.instantiateStreaming(fetch("main.wasm"), {});
const { add } = wasm.instance.exports;

for (let i = 0; i < 10; i++) {
  console.log(add(i, i));
}
