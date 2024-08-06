import { FlowChart, Rect } from "@/components/flow-chart";
import { Code, findRange } from "@/components/code";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import { CodeAnnotation } from "codehike/code";
import { useState } from "react";
import { useOnMount } from "@/hooks/use-onmount";
import { useDeck } from "@/components/deck";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";
import Content from "./02.1--react-element.code.md";

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

function getAnnotiations(tokens: string[][]) {
  const newAnnotiations: CodeAnnotation[][] = [];

  tokens.forEach((token, index) => {
    const code = steps[index].code.code;

    newAnnotiations.push([]);

    token.forEach((token) => {
      const range = findRange(code, token);

      if (!range) return;

      newAnnotiations[index].push({
        query: "",
        name: "focus",
        ...range,
      });
    });
  });

  return newAnnotiations;
}

export default function ReactElement() {
  const [annotiations, setAnnotations] = useState<CodeAnnotation[][]>([
    [],
    [],
    [],
  ]);

  const { deckSteps, slideIndex } = useDeck();

  useOnMount(() => {
    const tokens1 = [[`"h1"`], [`<h1`, `h1>`], [`type: "h1",`]];
    const tokens2 = [
      [`className: "greeting",`],
      [`className="greeting"`],
      [`className: "greeting",`],
    ];
    const tokens3 = [
      [`"Hello, world!"`],
      [`Hello, world!`],
      [`children: "Hello, world!",`],
    ];
    const tokens4 = [[], [], []];

    const tokensArr = [tokens1, tokens2, tokens3, tokens4] as const;

    tokensArr.forEach((tokens, index) => {
      deckSteps.addStep(slideIndex, {
        show: () => {
          setAnnotations(getAnnotiations(tokens));
        },
        id: `code-annotation-${index}`,
      });
    });
  });

  steps[0].code.annotations = annotiations[0];
  steps[1].code.annotations = annotiations[1];
  steps[2].code.annotations = annotiations[2];

  return (
    <div className="flex justify-center flex-col h-full">
      <SlideHeading className="mb-8">React Element</SlideHeading>
      <SlideText className="mb-20">
        React Element is a JavaScript object that represents a DOM element.
      </SlideText>
      <FlowChart
        nodes={{
          code1: (
            <Code
              code={steps[0].code}
              containerProps={{ className: "w-full" }}
            />
          ),
          code2: (
            <Code
              code={steps[1].code}
              containerProps={{ className: "w-max" }}
            />
          ),
          code3: (
            <Code
              code={steps[2].code}
              containerProps={{ className: "w-max" }}
            />
          ),
          domElement: (
            <Rect size="lg" color="blue">
              DOM Element
            </Rect>
          ),
        }}
        className="flex items-center gap-[150px] w-full"
        connections={[
          ["code1", "code2", "bottom_to_top"],
          ["code2", "code3", "right_to_left"],
          ["code3", "domElement", "right_to_left"],
        ]}
      >
        {(nodes) => (
          <>
            <div className="flex flex-col gap-[80px]">
              {nodes.code1}
              {nodes.code2}
            </div>
            {nodes.code3}
            {nodes.domElement}
          </>
        )}
      </FlowChart>
    </div>
  );
}
