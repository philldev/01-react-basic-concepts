import { FlowChart, FlowChartNodes, Rect } from "@/components/flow-chart";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import Content from "./5-render-tree.code.md";
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

const tree = [
  ["App"] as const,
  ["div"] as const,
  ["h1", "Members"] as const,
  ["ul"] as const,
  ["li", "li", "li", "li", "li"] as const,
] as const;

const nodes: FlowChartNodes = {};

tree.forEach((row, rIndex) => {
  row.forEach((item, iIndex) => {
    nodes[`${rIndex}-${iIndex}`] = <Rect color="blue">{item}</Rect>;
  });
});

export default function RenderTree() {
  return (
    <div className="flex flex-col h-full">
      <SlideHeading className="mb-8">Render Tree</SlideHeading>
      <div className="flex gap-10 mb-20">
        <SlideText className="flex-1">
          The render tree is a tree-like structure that represents the output of
          React's rendering.
        </SlideText>
      </div>

      <div className="flex gap-20">
        <div className="">
          <Code
            code={steps[0].code}
            styled={false}
            lineNumbers={false}
            className="text-lg"
          />
        </div>
        <FlowChart
          nodes={nodes}
          className="font-mono flex flex-col gap-10"
          connections={[
            ["0-0", "1-0", "bottom_to_top"],
            ["1-0", "2-0", "bottom_to_top"],
            ["1-0", "2-1", "bottom_to_top"],
            ["2-1", "3-0", "bottom_to_top"],
            ["3-0", "4-0", "bottom_to_top"],
            ["3-0", "4-1", "bottom_to_top"],
            ["3-0", "4-2", "bottom_to_top"],
            ["3-0", "4-3", "bottom_to_top"],
            ["3-0", "4-4", "bottom_to_top"],
          ]}
        >
          {(nodes) =>
            tree.map((row, rIndex) => (
              <div key={rIndex} className="flex justify-start gap-4">
                {row.map((_, iIndex) => (
                  <div className="flex-1 flex justify-center" key={iIndex}>
                    {nodes[`${rIndex}-${iIndex}`]}
                  </div>
                ))}
              </div>
            ))
          }
        </FlowChart>
      </div>
    </div>
  );
}
