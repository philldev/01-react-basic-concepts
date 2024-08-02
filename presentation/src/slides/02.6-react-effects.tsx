import { FlowChart } from "@/components/flow-chart";
import Content from "./02.6-react-effects.code.md";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import { Code } from "@/components/code";
import Step from "@/components/step";

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
    <div className="flex justify-center flex-col h-full">
      <h1 className="w-full text-8xl font-medium mb-8">React Effects</h1>
      <p className="text-2xl text-foreground/80 mb-20">
        React Effects are functions that run after every render. They are useful
        for performing side effects, such as fetching data from an API.
      </p>

      <FlowChart
        connections={[
          {
            start: "1",
            end: "2",
            startPosition: "right",
            endPosition: "left",
          },
        ]}
        className="flex gap-40 mb-20"
      >
        <div id="1" className="border border-border p-6 rounded-lg ">
          <pre className="text-muted-foreground mb-2">Component</pre>
          <pre className="text-lg">useEffect(effect)</pre>
        </div>

        <div id="2" className="border border-border p-6 rounded-lg ">
          <pre className="text-muted-foreground mb-2">Rerender</pre>
          <pre className="text-lg">effect()</pre>
        </div>
      </FlowChart>

      <Step index={0}>
        <Examples />
      </Step>
    </div>
  );
}

function Examples() {
  return (
    <div>
      <div className="text-2xl text-foreground/80 mb-4">Examples</div>
      <div className="flex gap-10 text-xl">
        {steps.map((step, index) => (
          <Step
            key={index}
            index={index + 1}
            variants={{
              initial: { opacity: 0.5 },
              show: { opacity: 1 },
            }}
            onNext={async (controls) => {
              console.log("onNext");
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
