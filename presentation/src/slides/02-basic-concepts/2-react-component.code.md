## !!steps code-1

```js ! code-1
// Example component
function Greeting(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

## !!steps code-2

```js ! code-1
// use component
<Greeting name="World" />;

// component elements returns
{
  type: "h1",
  props: {
    children: "Hello World",
  }
}
```

## !!steps code-3

```js ! code-1
// use component
<Greeting name="Jon" />;

// component elements returns
{
  type: "h1",
  props: {
    children: "Hello Jon",
  }
}
```
