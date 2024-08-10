import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";

export default function Summary() {
  return (
    <div className="flex flex-col gap-10 h-full justify-center">
      <SlideHeading>Summary</SlideHeading>
      <div className="flex flex-col gap-4">
        <SlideText>
          In this session, we explored the fundamental concepts of{" "}
          <strong>React</strong> and how its rendering process works. We also
          examined a demo visualizing the React rendering process. Here are the
          key takeaways:
        </SlideText>
        <ul className="list-disc text-xl list-inside gap-4 flex flex-col p-4 bg-gray-900 border border-border rounded-lg">
          <li>
            <strong>React</strong> is a JavaScript library used for building
            user interfaces.
          </li>
          <li>
            A React <strong>Element</strong> is a JavaScript object that
            represents a DOM element, while a React <strong>Component</strong>{" "}
            is a JavaScript function that returns a React Element.
          </li>
          <li>
            The React rendering process involves three main steps:{" "}
            <strong>trigger</strong>, <strong>reconciliation</strong>, and{" "}
            <strong>commit</strong>.
          </li>
          <li>
            React uses a <strong>diffing algorithm</strong> to efficiently
            update the DOM.
          </li>
          <li>
            We can maintain the stability of child elements across renders by
            using the <strong>key</strong> prop.
          </li>
          <li>
            React <strong>batches</strong> updates to the DOM for better
            performance.
          </li>
        </ul>
      </div>
    </div>
  );
}
