import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import Content from "./04.2-render.code.md";
import { Code } from "@/components/code";
import { ComponentProps, ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { FlowChart, FlowChartConnection } from "@/components/flow-chart";
import FlowChart2 from "@/components/flow-chart-2";

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

const code1 = steps[0].code;
const code2 = steps[1].code;

export default function Render() {
  return (
    <div className="flex flex-col h-full items center justify-center">
      <h1 className="text-8xl font-medium mb-8">Step 2: Render ⚙️</h1>
      <div className="text-2xl leading-relaxed text-foreground/80 mb-20">
        "Rendering" is React calling your components{" "}
        <pre className="inline">`Component(props)`</pre> and compute the ui tree
        that will be displayed on the screen.
      </div>

      <div className="flex gap-44">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="text-4xl font-medium">On the initial render</div>
            <div className="text-2xl text-muted-foreground">
              React calls the root component
            </div>
          </div>
          <div className="flex gap-10">
            <Code code={code1} lineNumbers={false} />
          </div>

          <FlowChart2
            nodes={{
              app: <ChartBox color="yellow" children="<App/>" />,
              heading: <ChartBox color="yellow" children="<Heading/>" />,
              counter: <ChartBox color="yellow" children="<Counter/>" />,
              h1: <ChartBox color="yellow" children="<h1/>" />,
              p: <ChartBox color="yellow" children="<p/>" />,
              button: <ChartBox color="yellow" children="<button/>" />,
            }}
            connections={[
              ["app", "heading", "right_to_left"],
              ["app", "counter", "right_to_left"],
              ["heading", "h1", "right_to_left"],
              ["counter", "p", "right_to_left"],
              ["counter", "button", "right_to_left"],
            ]}
            className="grid place-items-start grid-cols-3 gap-4 w-full"
          >
            {(nodes) => (
              <>
                <div className="col-start-1 col-end-2 row-start-1 row-end-2">
                  {nodes.app}
                </div>
                <div className="col-start-2 col-end-3 row-start-1 row-end-2">
                  {nodes.heading}
                </div>
                <div className="col-start-2 col-end-3 row-start-2 row-end-3">
                  {nodes.counter}
                </div>
                <div className="col-start-3 col-end-4 row-start-1 row-end-2 flex flex-col gap-2">
                  {nodes.h1}
                </div>
                <div className="col-start-3 col-end-4 row-start-2 row-end-3 flex flex-col items-start gap-4">
                  {nodes.p}
                  {nodes.button}
                </div>
              </>
            )}
          </FlowChart2>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="text-4xl font-medium">For subsequent renders,</div>
            <div className="text-2xl text-muted-foreground">
              React will call the function component whose state update
              triggered the render.
            </div>
          </div>

          <div className="flex gap-10">
            <Code code={code2} lineNumbers={false} />
          </div>

          <FlowChart2
            nodes={{
              app: <ChartBox children="<App/>" />,
              heading: <ChartBox children="<Heading/>" />,
              counter: <ChartBox color="yellow" children="<Counter/>" />,
              h1: <ChartBox children="<h1/>" />,
              p: <ChartBox color="yellow" children="<p/>" />,
              button: <ChartBox color="yellow" children="<button/>" />,
            }}
            connections={[
              ["app", "heading", "right_to_left"],
              ["app", "counter", "right_to_left"],
              ["heading", "h1", "right_to_left"],
              ["counter", "p", "right_to_left"],
              ["counter", "button", "right_to_left"],
            ]}
            className="grid place-items-start grid-cols-3 gap-4 w-full"
          >
            {(nodes) => (
              <>
                <div className="col-start-1 col-end-2 row-start-1 row-end-2">
                  {nodes.app}
                </div>
                <div className="col-start-2 col-end-3 row-start-1 row-end-2">
                  {nodes.heading}
                </div>
                <div className="col-start-2 col-end-3 row-start-2 row-end-3">
                  {nodes.counter}
                </div>
                <div className="col-start-3 col-end-4 row-start-1 row-end-2 flex flex-col gap-2">
                  {nodes.h1}
                </div>
                <div className="col-start-3 col-end-4 row-start-2 row-end-3 flex flex-col items-start gap-4">
                  {nodes.p}
                  {nodes.button}
                </div>
              </>
            )}
          </FlowChart2>
        </div>
      </div>
    </div>
  );
}

const chartBoxCva = cva(
  "border border-tranparent rounded-lg font-mono min-w-[75px] text-center",
  {
    variants: {
      color: {
        transparent: "border-border bg-background text-foreground",
        red: "border-red-500 bg-red-500/20 text-foreground",
        green: "border-green-500 bg-green-500/20 text-foreground",
        blue: "border-blue-500 bg-blue-500/20 text-foreground",
        yellow: "border-yellow-500 bg-yellow-500/20 text-foreground",
      },
      size: {
        sm: "p-2 text-sm",
        default: "p-3",
        lg: "p-6 text-2xl",
      },
    },
    defaultVariants: {
      color: "transparent",
      size: "default",
    },
  },
);

function ChartBox({
  className,
  children,
  color,
  size,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof chartBoxCva>) {
  return (
    <div className={cn(chartBoxCva({ color, size, className }))} {...props}>
      {children}
    </div>
  );
}
