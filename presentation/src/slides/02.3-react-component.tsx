import z from "zod";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import Content from "./02.3-react-component.code.md";
import { Code } from "@/components/code";
import { FlowChart } from "@/components/flow-chart";
import { useEffect, useState } from "react";
import { useAddStep } from "@/components/presentation";
import { highlight } from "codehike/code";

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

export default function ReactComponent() {
  const [compCode, setCompCode] = useState(
    steps.find((step) => step.title === "example-component-1")!.code,
  );
  const [callCompCode, setCallCompCode] = useState(
    steps.find((step) => step.title === "use-component-1")!.code,
  );
  const [compReturnsCode, setCompReturnsCode] = useState(
    steps.find((step) => step.title === "component-returns-1")!.code,
  );

  useAddStep(async () => {
    setCompCode(
      steps.find((step) => step.title === "example-component-2")!.code,
    );
    setCompReturnsCode(
      steps.find((step) => step.title === "component-returns-2")!.code,
    );
  }, 0);

  useAddStep(async () => {
    setCompCode(
      steps.find((step) => step.title === "example-component-3")!.code,
    );
    setCallCompCode(
      steps.find((step) => step.title === "use-component-2")!.code,
    );
    setCompReturnsCode(
      steps.find((step) => step.title === "component-returns-3")!.code,
    );
  }, 1);

  return (
    <div className="flex justify-center flex-col h-full">
      <h1 className="w-full text-8xl font-medium mb-8">React Component</h1>
      <p className="text-3xl leading-relaxed mb-10 text-foreground/75">
        React component is a function that returns React elements.
      </p>

      <FlowChart
        className="w-full"
        connections={[
          {
            start: "1",
            end: "2",
            startPosition: "bottom",
            endPosition: "top",
          },
          {
            start: "2",
            end: "3",
            startPosition: "right",
            endPosition: "left",
          },
        ]}
      >
        <div className="flex w-full gap-[300px]">
          <div className="flex flex-col flex-1 gap-[100px]">
            <Code
              containerProps={{
                id: "1",
                className: "w-full",
              }}
              lineNumbers={false}
              code={compCode}
            />
            <Code
              containerProps={{
                id: "2",
                className: "w-full",
              }}
              lineNumbers={false}
              code={callCompCode}
            />
          </div>

          <div className="flex-1">
            <Code
              className="h-full"
              containerProps={{
                id: "3",
              }}
              lineNumbers={false}
              code={compReturnsCode}
            />
          </div>
        </div>
      </FlowChart>
    </div>
  );
}
