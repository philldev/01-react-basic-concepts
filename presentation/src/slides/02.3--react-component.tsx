import z from "zod";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import Content from "./02.3--react-component.code.md";
import { Code } from "@/components/code";
import { FlowChart } from "@/components/flow-chart";
import { useState } from "react";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";
import { useOnMount } from "@/hooks/use-onmount";
import { useDeck } from "@/components/deck";
import { SlideSubheading } from "@/components/ui/slide-subheading";

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

  const { deckSteps, slideIndex } = useDeck();

  useOnMount(() => {
    deckSteps.addStep(slideIndex, {
      show: () => {
        setCompCode(
          steps.find((step) => step.title === "example-component-2")!.code,
        );
        setCompReturnsCode(
          steps.find((step) => step.title === "component-returns-2")!.code,
        );
      },
      id: `code-annotation-1`,
    });

    deckSteps.addStep(slideIndex, {
      show: () => {
        setCompCode(
          steps.find((step) => step.title === "example-component-3")!.code,
        );
        setCallCompCode(
          steps.find((step) => step.title === "use-component-2")!.code,
        );
        setCompReturnsCode(
          steps.find((step) => step.title === "component-returns-3")!.code,
        );
      },
      id: `code-annotation-2`,
    });
  });

  return (
    <div className="flex justify-center flex-col h-full">
      <SlideHeading className="mb-8">React Component</SlideHeading>
      <SlideText className="mb-20">
        React component is a function that returns React elements.
      </SlideText>

      <FlowChart
        nodes={{
          comp: (
            <Code
              containerProps={{
                className: "w-full",
              }}
              lineNumbers={false}
              code={compCode}
            />
          ),
          callComp: (
            <Code
              containerProps={{
                className: "w-full",
              }}
              lineNumbers={false}
              code={callCompCode}
            />
          ),
          compReturns: (
            <Code
              containerProps={{
                className: "w-full",
              }}
              lineNumbers={false}
              code={compReturnsCode}
            />
          ),
        }}
        connections={[
          ["comp", "callComp", "bottom_to_top"],
          ["callComp", "compReturns", "right_to_left"],
        ]}
        className="w-full flex gap-44 items-stretch"
      >
        {(nodes) => (
          <>
            <div className="flex flex-col flex-1 gap-20">
              <div className="flex flex-col gap-4">
                <SlideSubheading>Component Input</SlideSubheading>
                {nodes.comp}
              </div>
              {nodes.callComp}
            </div>
            <div className="flex flex-1 h-full flex-col justify-center gap-4">
              <SlideSubheading>Elements Output</SlideSubheading>
              <div className="flex-1">{nodes.compReturns}</div>
            </div>
          </>
        )}
      </FlowChart>
    </div>
  );
}
