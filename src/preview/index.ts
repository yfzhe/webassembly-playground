window.addEventListener("message", (evt) => {
  // TODO: check origin
  const { js, blobUrl } = evt.data;
  const script = document.createElement("script");
  script.type = "module";
  script.innerText = `const wasmUrl = "${blobUrl}"; ${js}`
  document.body.append(script);
})
