## !!steps effects-1

```js ! example-1
function Component() {
  useEffect(() => {
    console.log("run every render");
  });
}
```

## !!steps effects-2

```js ! example-2
function Component() {
  useEffect(() => {
    console.log("run on mount");
  }, []);
}
```

## !!steps effects-3

```js ! example-3
function Component() {
  useEffect(() => {
    console.log("run when x or y changes");
  }, [x, y]);
}
```
