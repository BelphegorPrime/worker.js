interface IWorkerJSType {
  worker: Worker;
  data: Promise<any>;
  error: Error | null;
}

const functionToWorkerURL = (fn: Function): string => {
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

const main = (url: string) => {
  const worker = new Worker(url);
  return {
    worker,
    data: new Promise(resolve => {
      worker.addEventListener("message", event => {
        resolve(event.data);
      });
      worker.postMessage(null);
    }),
    error: null
  };
};

const workerJS = (fn: Function | undefined): IWorkerJSType => {
  const returnError = (message: string) => {
    const error = new Error(message);
    return {
      worker: null,
      data: Promise.reject(error),
      error
    };
  };

  if (typeof Worker === "undefined") {
    return returnError("Your Browser does not support worker");
  }
  if (fn) {
    return main(functionToWorkerURL(fn));
  }
  return returnError("There was no function provided");
};

export default workerJS;
