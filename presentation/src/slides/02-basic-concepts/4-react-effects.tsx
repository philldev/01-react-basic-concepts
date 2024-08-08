import { FlowChart, Rect } from "@/components/flow-chart";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import { Code } from "@/components/code";
import { Step } from "@/components/deck";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";
import Content from "./4-react-effects.code.md";

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

export default function ReactEffects() {
  return (
    <div className="flex flex-col h-full">
      <SlideHeading className="mb-8">React Effects</SlideHeading>
      <SlideText className="mb-20">
        React Effects are functions that run after every render. They are useful
        for performing side effects, such as fetching data from an API.
      </SlideText>

      <FlowChart
        className="flex gap-40 mb-20"
        nodes={{
          component: (
            <Rect size="lg" className="text-left">
              Rerender
            </Rect>
          ),

          rerender: (
            <Rect size="lg" className="text-left">
              effect()
            </Rect>
          ),
        }}
        connections={[["component", "rerender", "right_to_left"]]}
      >
        {(nodes) => {
          return (
            <>
              {nodes.component}
              {nodes.rerender}
            </>
          );
        }}
      </FlowChart>

      <Step order={0}>
        <Examples />
      </Step>
    </div>
  );
}

function Examples() {
  return (
    <div>
      <div className="flex gap-10 text-xl">
        {steps.map((step, index) => (
          <Step
            key={index}
            order={index + 1}
            variants={{
              initial: { opacity: 0.5 },
              show: { opacity: 1 },
            }}
            onNext={async (controls) => {
              await controls.start("initial");
            }}
          >
            <Code
              key={index}
              code={step.code}
              styled={false}
              lineNumbers={false}
            />
          </Step>
        ))}
      </div>
    </div>
  );
}
