import { FlowChart, FlowChartConnection } from "@/components/flow-chart";
import { Code, findRange } from "@/components/code";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import Content from "./02.1-react-element.code.mdx";
import { CodeAnnotation } from "codehike/code";
import { useState } from "react";
import { useAddStep } from "@/components/presentation";

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

const connections: FlowChartConnection[] = [
  {
    start: "rect1",
    end: "rect3",
    startPosition: "right",
    endPosition: "left",
  },
  {
    start: "rect2",
    end: "rect3",
    startPosition: "right",
    endPosition: "left",
  },

  {
    start: "rect3",
    end: "rect4",
    startPosition: "right",
    endPosition: "left",
  },
];

export default function ReactElement() {
  const [annotiations, setAnnotations] = useState<CodeAnnotation[][]>([
    [],
    [],
    [],
  ]);

  const getAnnotiations = (tokens: string[][]) => {
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
  };

  useAddStep(async () => {
    const tokens = [[`"h1"`], [`<h1`, `h1>`], [`type: "h1",`]];
    setAnnotations(getAnnotiations(tokens));
  }, 0);

  useAddStep(async () => {
    const tokens = [
      [`className: "greeting",`],
      [`className="greeting"`],
      [`className: "greeting",`],
    ];
    setAnnotations(getAnnotiations(tokens));
  }, 1);

  useAddStep(async () => {
    const tokens = [
      [`"Hello, world!"`],
      [`Hello, world!`],
      [`children: "Hello, world!",`],
    ];
    setAnnotations(getAnnotiations(tokens));
  }, 2);

  useAddStep(async () => {
    setAnnotations([[], [], []]);
  }, 3);

  steps[0].code.annotations = annotiations[0];
  steps[1].code.annotations = annotiations[1];
  steps[2].code.annotations = annotiations[2];

  console.log(annotiations);

  return (
    <div className="flex justify-center flex-col h-full">
      <h1 className="w-full text-8xl font-medium mb-8">React Element</h1>
      <p className="text-3xl leading-relaxed mb-20 text-foreground/75">
        React Element is a JavaScript object that represents a DOM element.
      </p>
      <FlowChart className="w-full" connections={connections}>
        <div className="flex items-center gap-[150px] w-full">
          <div className="flex flex-col gap-[80px]">
            <Code
              code={steps[0].code}
              containerProps={{ id: "rect1", className: "w-full" }}
            />

            <Code code={steps[1].code} containerProps={{ id: "rect2" }} />
          </div>

          <Code code={steps[2].code} containerProps={{ id: "rect3" }} />
          <FlowChart.Rect id="rect4">DOM Element</FlowChart.Rect>
        </div>
      </FlowChart>
    </div>
  );
}
