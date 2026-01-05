const wasm = await WebAssembly.instantiateStreaming(fetch("main.wasm"), {});
const { fib } = wasm.instance.exports;

document.body.innerHTML = `
  <form id="form">
    <label for="number">Input a number:</label>
    <input type="number" min="0" name="number" id="number" />
    <button type="submit">Calculate</button>
  </form>
  <div id="output"></div>`;

const form = document.getElementById("form");
const output = document.getElementById("output");

form.onsubmit = (evt) => {
  evt.preventDefault();

  const number = form.elements["number"].value;
  output.textContent = "Calculating...";

  setTimeout(() => {
    const start = performance.now();
    const result = fib(number);
    const end = performance.now();
    const ms = (end - start).toFixed(0);

    output.textContent = `fibonacci(${number}) is ${result}. Used ${ms}ms.`;
  }, 0);
};
