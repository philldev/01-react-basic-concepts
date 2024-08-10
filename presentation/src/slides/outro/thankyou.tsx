import { SlideSubheading } from "@/components/ui/slide-subheading";
import { SlideText } from "@/components/ui/slide-text";
import { SlideTitle } from "@/components/ui/slide-title";

export default function ThankYou() {
  return (
    <div className="flex flex-col h-full relative">
      <SlideTitle className="mb-20">Thank you! 👋🏻</SlideTitle>
      <SlideText className="text-xl mb-10">
        We hope you enjoyed this session and learned something new. If you have
        any questions or feedback, please don't hesitate.
      </SlideText>

      <SlideSubheading className="mb-4">
        Resources and further reading
      </SlideSubheading>
      <ul className="list-disc text-sm list-inside gap-1 flex flex-col p-4 bg-gray-900 border border-border rounded-lg">
        <li>
          <a href="https://react.dev/">React</a>
        </li>
        <li>
          <a href="https://www.dhiwise.com/post/react-element-vs-component-leveraging-react-core-constructs">
            React Element Vs. Component: A Comprehensive Guide
          </a>
        </li>
        <li>
          <a href="https://react.dev/learn/state-a-components-memory">
            State: A Component's Memory – React
          </a>
        </li>
        <li>
          <a href="https://react.dev/reference/rules/components-and-hooks-must-be-pure">
            Components and Hooks must be pure – React
          </a>
        </li>
        <li>
          <a href="https://react.dev/learn/understanding-your-ui-as-a-tree">
            Understanding Your UI as a Tree – React
          </a>
        </li>
        <li>
          <a href="https://react.dev/learn/writing-markup-with-jsx">
            Writing Markup with JSX – React
          </a>
        </li>
        <li>
          <a href="https://react.dev/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events">
            Synchronizing with Effects – React
          </a>
        </li>
        <li>
          <a href="https://blog.atulr.com/react-custom-renderer-1/">
            ⚛️👆 Part 1/3 - Beginners guide to Custom React Renderers. How to
            build your own renderer from scratch? | Blog
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/watch?v=CGpMlWVcHok">
            Building a Custom React Renderer | Sophie Alpert - YouTube
          </a>
        </li>
        <li>
          <a href="https://react.dev/learn/state-as-a-snapshot">
            State as a Snapshot – React
          </a>
        </li>
        <li>
          <a href="https://react.dev/learn/queueing-a-series-of-state-updates">
            Queueing a Series of State Updates – React
          </a>
        </li>
        <li>
          <a href="https://legacy.reactjs.org/docs/reconciliation.html">
            Reconciliation – React
          </a>
        </li>
        <li>
          <a href="https://react.dev/learn/render-and-commit">
            Render and Commit – React
          </a>
        </li>
        <li>
          <a href="https://react.dev/learn/rendering-lists#rules-of-keys">
            Rendering Lists – React
          </a>
        </li>
        <li>
          <a href="https://robinpokorny.com/blog/index-as-a-key-is-an-anti-pattern/">
            Index as a key is an anti-pattern | Robin Pokorny
          </a>
        </li>
        <li>
          <a href="https://javascript.plainenglish.io/scheduling-in-react-16-x-a6108db99208">
            Scheduling in React 16.x. The logic standing behind React 16.x… | by
            adasq | JavaScript in Plain English
          </a>
        </li>
        <li>
          <a href="https://spiess.dev/blog/scheduling-in-react">
            Scheduling in React | Philipp Spiess
          </a>
        </li>
      </ul>
    </div>
  );
}
