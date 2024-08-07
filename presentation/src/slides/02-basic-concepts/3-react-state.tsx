import { Code } from "@/components/code";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import Content from "./3-react-state.code.md";

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

export default function ReactState() {
  return (
    <div className="flex flex-col h-full">
      <SlideHeading className="mb-10">State</SlideHeading>
      <SlideText className="mb-20">
        State is a variable that hold some information and may change over the
        lifetime of a component.
      </SlideText>
      <Code
        code={steps[0].code}
        styled={false}
        lineNumbers={false}
        className="text-xl"
      />
    </div>
  );
}
