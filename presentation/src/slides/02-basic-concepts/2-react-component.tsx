import z from "zod";
import {
  parseRoot,
  Block,
  HighlightedCodeBlock,
  getBlocks,
} from "codehike/blocks";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";
import Content from "./2-react-component.code.md";
import { Code } from "@/components/code";
import { ReactElement } from "react";
import { Step } from "@/components/deck";
console.log(getBlocks(Content));

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

let codes = steps.map((s) => s.code);

export default function ReactComponent() {
  return (
    <div className="flex flex-col h-full">
      <SlideHeading className="mb-10">React Component</SlideHeading>
      <SlideText className="mb-20">
        React Component is a function that returns a React elements.
      </SlideText>

      <div className="flex flex-col gap-12">
        <Code
          styled={false}
          code={codes[0]}
          lineNumbers={false}
          className="text-2xl"
        />
        <div className="grid grid-cols-2 gap-10">
          <Step>
            <Code
              styled={false}
              code={codes[1]}
              lineNumbers={false}
              className="text-2xl"
            />
          </Step>
        </div>
      </div>
    </div>
  );
}
