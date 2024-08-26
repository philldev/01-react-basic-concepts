import { FlowChart, Rect } from "@/components/flow-chart";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import { Code } from "@/components/code";
import { Step } from "@/components/deck";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";
import Content from "./4-react-effects.code.md";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, FileWarning } from "lucide-react";

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

const infos = [
  null,

  <Alert className="mt-10">
    <AlertDescription className="text-yellow-500">
      On Strict Mode React will mount the component twice, so the effect will
      run 2 times.
    </AlertDescription>
  </Alert>,

  <Alert className="mt-10">
    <AlertDescription className="text-yellow-500">
      If we provide an object as dependencies item the effect will always run
      because react compare the dependencies by its value using{" "}
      <code>Object.is()</code> not by its reference.
    </AlertDescription>
  </Alert>,
];

export default function ReactEffects() {
  return (
    <div className="flex flex-col h-full">
      <SlideHeading className="mb-8">React Effects</SlideHeading>
      <SlideText className="mb-20">
        React Effects are side effect functions that run after every render.
        They are useful for performing side effects, such as fetching data from
        an API.
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
              initial: { opacity: 0.1 },
              show: { opacity: 1 },
            }}
            onNext={async (controls) => {
              await controls.start("initial");
            }}
            className="flex-1"
          >
            <Code
              key={index}
              code={step.code}
              styled={false}
              lineNumbers={false}
            />
            {infos[index]}
          </Step>
        ))}
      </div>
    </div>
  );
}
