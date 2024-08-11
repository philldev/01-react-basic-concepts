import { FlowChart, FlowChartNodes, Rect } from "@/components/flow-chart";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import Content from "./5-render-tree.code.md";
import { Code } from "@/components/code";
import { GridItem, Grid } from "@/components/ui/grid";

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

const treeNode = (text: string) => (
  <Rect size="xs" className="w-max">
    {text}
  </Rect>
);

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
          <Code code={steps[0].code} styled={false} lineNumbers={false} />
        </div>
        <FlowChart
          config={{
            connectionOffset: {
              start: "start",
            },
          }}
          nodes={{
            app: treeNode("<App />"),
            div: treeNode("<div />"),
            h1: treeNode("<h1 />"),
            members: treeNode("<Members />"),
            ul: treeNode("<ul />"),
            li_0: treeNode("<li />"),
            li_1: treeNode("<li />"),
            li_2: treeNode("<li />"),
            li_3: treeNode("<li />"),
            li_4: treeNode("<li />"),
            li_5: treeNode("<li />"),
          }}
          connections={[
            ["app", "div", "bottom_to_left"],
            ["div", "h1", "bottom_to_left"],
            ["div", "members", "bottom_to_left"],
            ["members", "ul", "bottom_to_left"],
            ["ul", "li_0", "bottom_to_left"],
            ["ul", "li_1", "bottom_to_left"],
            ["ul", "li_2", "bottom_to_left"],
            ["ul", "li_3", "bottom_to_left"],
            ["ul", "li_4", "bottom_to_left"],
            ["ul", "li_5", "bottom_to_left"],
          ]}
        >
          {(nodes) => (
            <Grid className="gap-4 gap-x-2">
              <GridItem col={1} row={1} children={nodes.app} />
              <GridItem col={2} row={2} children={nodes.div} />
              <GridItem col={3} row={3} children={nodes.h1} />
              <GridItem col={4} row={4} children={nodes.members} />
              <GridItem col={5} row={5} children={nodes.ul} />
              <GridItem col={6} row={6} children={nodes.li_0} />
              <GridItem col={6} row={7} children={nodes.li_1} />
              <GridItem col={6} row={8} children={nodes.li_2} />
              <GridItem col={6} row={9} children={nodes.li_3} />
              <GridItem col={6} row={10} children={nodes.li_4} />
              <GridItem col={6} row={11} children={nodes.li_5} />
            </Grid>
          )}
        </FlowChart>
      </div>
    </div>
  );
}
