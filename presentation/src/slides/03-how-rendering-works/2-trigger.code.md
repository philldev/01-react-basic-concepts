## !!steps code-1

```js ! example-1
import ReactDOM from "react-dom/client";

const rootEl = document.getElementById("root");

const root = ReactDOM.createRoot(rootEl);

// !focus
root.render(<App />);
```

## !!steps code-2

```js ! example-1
function Counter() {
  const [count, setCount] = useCount(0);

  // !focus
  setCount(count + 1);
}
```
