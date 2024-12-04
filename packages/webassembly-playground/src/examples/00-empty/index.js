const wasm = await WebAssembly.instantiateStreaming(fetch("main.wasm"), {});
const {} = wasm.instance.exports;

// write your code here
