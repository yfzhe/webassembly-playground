export enum MessageType {
  Compile = "COMPILE",
}

function postMessageToWorker(sw: ServiceWorker, data: unknown): Promise<any> {
  return new Promise(resolve => {
    const ch = new MessageChannel();
    ch.port1.onmessage = evt => resolve(evt.data);
    sw.postMessage(data, [ch.port2]);
  });
}

// FIXME
export function compile(sw: ServiceWorker, files: any): Promise<string> {
  return postMessageToWorker(sw, {
    type: MessageType.Compile,
    files,
  })
}
