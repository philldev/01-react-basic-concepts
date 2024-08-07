import { SlideHeading } from "@/components/ui/slide-heading";
import Content from "./2-trigger.code.md";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import { Code } from "@/components/code";
import { SlideText } from "@/components/ui/slide-text";
import { FlowChart, Rect } from "@/components/flow-chart";
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

const codes = steps.map(({ code }) => code);

export default function Trigger0() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-10 mb-20">
        <SlideSubheading>Initial Render</SlideSubheading>
      </div>

      <FlowChart
        nodes={{
          component: (
            <Rect color="light" className="w-full" size="lg">
              root.render()
            </Rect>
          ),
          state: (
            <Rect color="light" className="w-full" size="lg">
              state
            </Rect>
          ),
          setState: (
            <Rect color="light" className="w-full" size="lg">
              setState()
            </Rect>
          ),
          newState: (
            <Rect color="light" className="w-full" size="lg">
              newState
            </Rect>
          ),
          rerender: (
            <Rect color="light" className="w-full" size="lg">
              Component(props)
            </Rect>
          ),
          initializeState: (
            <Rect color="light" className="w-full" size="lg">
              initState()
            </Rect>
          ),

          newTree: (
            <Rect color="light" className="w-full" size="lg">
              Render Tree
            </Rect>
          ),
          effects: (
            <Rect color="light" className="w-full" size="lg">
              runEffects()
            </Rect>
          ),
        }}
        connections={[
          ["component", "rerender", "bottom_to_left"],
          ["newState", "rerender", "right_to_bottom"],
          ["state", "component", "bottom_to_left"],
          ["rerender", "newTree", "right_to_left"],
          ["rerender", "effects", "right_to_left"],
        ]}
        className="w-full"
        children={(nodes) => (
          <div className="grid grid-cols-4 relative gap-x-32 gap-y-20 w-full">
            <div className="col-start-1">{nodes.component}</div>
            <div className="col-start-2 row-start-2">{nodes.rerender}</div>
            <div className="col-start-3 row-start-2">
              {nodes.initializeState}
            </div>
            <div className="col-start-3 row-start-3">{nodes.effects}</div>
            <div className="col-start-4 row-start-2">{nodes.newTree}</div>
          </div>
        )}
      />
    </div>
  );
}
