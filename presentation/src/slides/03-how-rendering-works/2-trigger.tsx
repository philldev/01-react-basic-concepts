import { SlideHeading } from "@/components/ui/slide-heading";
import Content from "./2-trigger.code.md";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import { Code } from "@/components/code";
import { SlideText } from "@/components/ui/slide-text";
import { FlowChart, Rect } from "@/components/flow-chart";

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

export default function Trigger() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-10 mb-20">
        <SlideHeading className="flex-1">Trigger a render 🚀</SlideHeading>
      </div>
      <div className="grid grid-cols-2 flex-1 gap-10">
        <div className="flex flex-col gap-4">
          <SlideText>Calling root.render()</SlideText>
          <div className="flex flex-col gap-8 p-3 flex-1">
            <Code
              lineNumbers={false}
              styled={false}
              code={codes[0]}
              className="text-lg"
            />
            <FlowChart
              nodes={{
                app: (
                  <Rect color="yellow" size="sm">
                    App
                  </Rect>
                ),

                div: (
                  <Rect color="yellow" size="sm">
                    div
                  </Rect>
                ),

                h1: (
                  <Rect color="yellow" size="sm">
                    h1
                  </Rect>
                ),
                counter: (
                  <Rect color="yellow" size="sm">
                    Counter
                  </Rect>
                ),

                p: (
                  <Rect color="yellow" size="sm">
                    p
                  </Rect>
                ),
                button: (
                  <Rect color="yellow" size="sm">
                    button
                  </Rect>
                ),
              }}
              connections={[
                ["app", "div", "bottom_to_left"],
                ["div", "h1", "bottom_to_left"],
                ["div", "counter", "bottom_to_left"],
                ["counter", "p", "bottom_to_left"],
                ["counter", "button", "bottom_to_left"],
              ]}
              children={(nodes) => (
                <div className="grid grid-cols-4 gap-4 p-4">
                  <div className="col-start-1">{nodes.app}</div>
                  <div className="row-start-2 col-start-2">{nodes.div}</div>
                  <div className="row-start-3 col-start-3">{nodes.h1}</div>
                  <div className="row-start-4 col-start-3">{nodes.counter}</div>
                  <div className="row-start-5 col-start-4">{nodes.p}</div>
                  <div className="row-start-6 col-start-4">{nodes.button}</div>
                </div>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <SlideText>Component State Changes</SlideText>
          <div className="p-3 flex-col flex gap-10 flex-1">
            <Code
              lineNumbers={false}
              styled={false}
              code={codes[1]}
              className="text-lg"
            />

            <FlowChart
              nodes={{
                app: <Rect size="sm">App</Rect>,

                div: <Rect size="sm">div</Rect>,

                h1: <Rect size="sm">h1</Rect>,
                counter: (
                  <Rect color="yellow" size="sm">
                    Counter
                  </Rect>
                ),

                p: (
                  <Rect color="yellow" size="sm">
                    p
                  </Rect>
                ),
                button: (
                  <Rect color="yellow" size="sm">
                    button
                  </Rect>
                ),
              }}
              connections={[
                ["app", "div", "bottom_to_left"],
                ["div", "h1", "bottom_to_left"],
                ["div", "counter", "bottom_to_left"],
                ["counter", "p", "bottom_to_left"],
                ["counter", "button", "bottom_to_left"],
              ]}
              children={(nodes) => (
                <div className="grid grid-cols-4 gap-4 p-4">
                  <div className="col-start-1">{nodes.app}</div>
                  <div className="row-start-2 col-start-2">{nodes.div}</div>
                  <div className="row-start-3 col-start-3">{nodes.h1}</div>
                  <div className="row-start-4 col-start-3">{nodes.counter}</div>
                  <div className="row-start-5 col-start-4">{nodes.p}</div>
                  <div className="row-start-6 col-start-4">{nodes.button}</div>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
