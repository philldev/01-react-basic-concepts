import BrowserUI from "@/components/browser-ui";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";
import { SVGProps, useEffect, useState } from "react";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import Content from "./1-demo-example.code.md";
import { z } from "zod";
import { Code } from "@/components/code";

const { steps } = parseRoot(
  Content,
  Block.extend({
    steps: z.array(
      Block.extend({
        code: HighlightedCodeBlock.extend({
          style: z.object({}),
        }),
      }),
    ),
  }),
);

const codes = steps.map(({ code }) => code);

const code1 = codes[0];
const code2 = codes[1];

export default function DemoExample() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-10 mb-6">
        <SlideHeading className="flex-1">Demo 🎨</SlideHeading>
        <SlideText className="flex-1">Example Blog Post Detail Page</SlideText>
      </div>
      <div className="flex gap-20 flex-1">
        <BrowserUI className="h-[500px] w-[350px]">
          <AppExample />
        </BrowserUI>
        <div className="flex gap-10 text-sm">
          <Code lineNumbers={false} styled={false} code={code1} />
          <Code lineNumbers={false} styled={false} code={code2} />
        </div>
      </div>
    </div>
  );
}

interface Post {
  title: string;
  img_url: string;
  content: string;
  author: string;
  likes: number;
}

function getPost() {
  return new Promise<Post>((resolve) => {
    setTimeout(() => {
      resolve({
        title: "Hello World",
        img_url: "https://picsum.photos/id/1003/200/300",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, ",
        author: "John Doe",
        likes: 100,
      });
    }, 1000);
  });
}

function AppExample() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPost().then((post) => {
      setPost(post);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingSpinner className="mx-auto pt-20 w-32 h-32" />;
  }

  return (
    <main className="bg-white h-full text-black p-4 flex flex-col gap-3 rounded-lg">
      <h1 className="text-2xl font-bold">{post?.title}</h1>
      <p>by {post?.author}</p>
      <img className="h-[200px] object-cover" src={post?.img_url} />
      <p>{post?.content}</p>
      <LikeButton likes={post?.likes} />
    </main>
  );
}

function LikeButton({ likes = 0 }: { likes?: number }) {
  const [liked, setLiked] = useState(false);
  const onLike = () => setLiked(!liked);
  return (
    <button onClick={onLike} className="flex gap-2 items-center">
      {liked ? (
        <HeartFill className="w-5 h-5" />
      ) : (
        <Heart className="w-5 h-5" />
      )}
      <span className="ml-2">{liked ? likes + 1 : likes}</span>
    </button>
  );
}

export function LoadingSpinner(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <g>
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".14"
        ></rect>
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".29"
          transform="rotate(30 12 12)"
        ></rect>
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".43"
          transform="rotate(60 12 12)"
        ></rect>
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".57"
          transform="rotate(90 12 12)"
        ></rect>
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".71"
          transform="rotate(120 12 12)"
        ></rect>
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".86"
          transform="rotate(150 12 12)"
        ></rect>
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          transform="rotate(180 12 12)"
        ></rect>
        <animateTransform
          attributeName="transform"
          calcMode="discrete"
          dur="0.75s"
          repeatCount="indefinite"
          type="rotate"
          values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
        ></animateTransform>
      </g>
    </svg>
  );
}

export function Heart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3m-4.4 15.55l-.1.1l-.1-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05"
      ></path>
    </svg>
  );
}

export function HeartFill(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"
      ></path>
    </svg>
  );
}
