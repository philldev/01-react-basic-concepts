import { Step } from "@/components/deck";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideSubheading } from "@/components/ui/slide-subheading";

import Content from "./4.6-diffing-algo.code.md";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
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

const code = codes[0];
const code2 = codes[1];
const code3 = codes[2];

export default function DiffingAlgo6() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-12">
        <SlideSubheading className="text-foreground/80">
          Diffing Algorithm
        </SlideSubheading>
        <SlideHeading className="mb-10">
          Rules for Using React Keys ⚠️
        </SlideHeading>
        <div className="flex flex-col gap-4 w-max">
          <Code code={code} className="" containerClassName="w-full" />
          <Code code={code2} className="" containerClassName="w-full" />
          <Code code={code3} className="" containerClassName="w-full" />
        </div>
      </div>
    </div>
  );
}
