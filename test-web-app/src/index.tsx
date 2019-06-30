import workerJS from "@belphegorsprime/worker.js";
import React from "react";
import ReactDOM from "react-dom";

function App() {
  const fn = () => {
    return fetch("https://pokeapi.co/api/v2/pokemon/1/").then(resp =>
      resp.json()
    );
  };
  const { worker, data, error } = workerJS(fn);
  if (!error) {
    console.log(worker);
    data.then((v: any) => console.log(v));
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
