import { Code } from "@/components/code";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";
import Content from "./1-react-element.code.md";

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

const codes = steps.map((s) => s.code);

export default function ReactElement() {
  return (
    <div className="flex flex-col h-full">
      <SlideHeading className="mb-8">React Element</SlideHeading>
      <SlideText className="mb-20">
        React Element is a JavaScript object that represents a DOM element.
      </SlideText>
      <div className="flex gap-10">
        <div className="flex-1 flex-col gap-20 flex justify-center">
          {codes.map((code, index) => (
            <Code
              key={index}
              code={code}
              className="text-2xl"
              containerProps={{ className: "w-max" }}
              styled={false}
              lineNumbers={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
