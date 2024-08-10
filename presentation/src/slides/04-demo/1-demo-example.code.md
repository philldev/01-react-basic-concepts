## !!steps code-1

```js ! example-1
function Post() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPost().then((post) => {
      setPost(post);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingSpinner className="..." />;
  }

  return (
    <main className="...">
      <h1 className="...">{post?.title}</h1>
      <p>by {post?.author}</p>
      <img className="..." src={post?.img_url} />
      <p>{post?.content}</p>
      <LikeButton likes={post?.likes} />
    </main>
  );
}
```

## !!steps code-2

```js ! example-1
function LikeButton({ likes = 0 }) {
  const [liked, setLiked] = useState(false);
  const onLike = () => setLiked(!liked);
  return (
    <button onClick={onLike} className={liked ? "fill" : "outline"}>
      <span className="...">{liked ? likes + 1 : likes}</span>
    </button>
  );
}
```
