const fn2workerURL = (fn: Function) => {
  const functionString = `
  self.addEventListener("message", async e => {
    let value = (${fn.toString()})()
    if(Promise.resolve(value) == value){
      value = await value
    }
    self.postMessage(value);
  });
  `;

  const blob = new Blob([functionString], {
    type: "application/javascript; charset=utf-8"
  });
  return URL.createObjectURL(blob);
};

const returnError = (message: string) => {
  return {
    worker: null,
    error: new Error(message)
  };
};

interface IWorkerJSType {
  worker: Promise<any>;
  error: Error | null;
}

const workerJS = (fn: Function | undefined): IWorkerJSType => {
  if (typeof Worker === "undefined") {
    return returnError("Your Browser does not support worker");
  } else {
    if (fn) {
      const url = fn2workerURL(fn);
      if (url) {
        return {
          worker: new Promise(resolve => {
            const worker = new Worker(url);
            worker.addEventListener("message", event => {
              resolve(event.data);
            });
            worker.postMessage(null);
          }),
          error: null
        };
      }
      return returnError("Couldn´t generate Blob-URL");
    }
    return returnError("There was no function provided");
  }
};

export default workerJS;
