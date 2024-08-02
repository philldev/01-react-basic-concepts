import Content from "./02.7.2-render-tree.code.md";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import { Code } from "@/components/code";
import { FlowChart, FlowChartConnection } from "@/components/flow-chart";
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

const tree = [
  ["App"],
  ["div"],
  ["h1", "Members"],
  ["ul"],
  new Array(5).fill(["li"]),
];

const connectionsString: {
  start: string;
  end: string;
}[] = [
  {
    start: "0-0",
    end: "1-0",
  },
  {
    start: "1-0",
    end: "2-0",
  },
  {
    start: "1-0",
    end: "2-1",
  },

  {
    start: "2-1",
    end: "3-0",
  },
  ...new Array(5).fill(0).map((_, index) => ({
    start: `3-0`,
    end: `4-${index}`,
  })),
];

const connections: FlowChartConnection[] = connectionsString.map(
  ({ start, end }) => ({
    start,
    end,
    startPosition: "bottom",
    endPosition: "top",
  }),
);

export default function RenderTreeExample() {
  return (
    <div className="flex justify-center flex-col h-full">
      <div className="flex items-center">
        <Step index={0} className="flex-1">
          <Code
            code={steps[0].code}
            styled={false}
            lineNumbers={false}
            className="text-xl"
          />
        </Step>

        <Step index={1} className="flex-1">
          <FlowChart
            connections={connections}
            className="font-mono flex flex-col gap-14 w-full"
          >
            {tree.map((row, rIndex) => (
              <div key={rIndex} className="flex justify-center gap-4">
                {row.map((item, iIndex) => (
                  <div className="flex-1 flex justify-center" key={iIndex}>
                    <div
                      id={`${rIndex}-${iIndex}`}
                      className="border font-bold border-gray-500 px-5 py-3"
                    >
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </FlowChart>
        </Step>
      </div>
    </div>
  );
}
