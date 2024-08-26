import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideSubheading } from "@/components/ui/slide-subheading";
import appImg from "../../assets/key-perf/app-ss.png";
import { Code } from "@/components/code";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import Content from "./4.5.1-diffing-algo.code.md";

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

export default function DiffingAlgo5_1() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-12">
        <SlideSubheading className="text-foreground/80">
          Diffing Algorithm
        </SlideSubheading>
        <SlideHeading className="mb-10 text-muted-foreground">
          Comparing{" "}
          <span className="text-foreground">
            using unique ID and using index as key
          </span>{" "}
        </SlideHeading>
      </div>
      <div className="flex gap-4 items-center">
        <img src={appImg} className="h-[500px] -ml-6 -mb-6" alt="app" />
        <div>
          <Code code={code} className="" containerClassName="w-full" />
        </div>
      </div>
    </div>
  );
}
