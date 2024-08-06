import BrowserUI from "@/components/browser-ui";
import { Code, findRange } from "@/components/code";
import { useDeck } from "@/components/deck";
import { FlowChart, Rect } from "@/components/flow-chart";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";
import { useOnMount } from "@/hooks/use-onmount";
import { cn } from "@/lib/utils";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { CodeAnnotation } from "codehike/code";
import { useState, useEffect } from "react";
import { z } from "zod";
import Content from "./02.4--react-state.code.md";

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

export default function ReactState() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let interval = setInterval(() => {
      setDark((prev) => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const [annotiations, setAnnotations] = useState<CodeAnnotation[]>([]);

  const { deckSteps, slideIndex } = useDeck();

  useOnMount(() => {
    const ranges = [
      [
        `const [count, setCount] = useState(0);`,
        `import { useState } from "react";`,
      ],
      [
        `const increment = () => setCount((prev) => prev + 1);`,
        `onClick={increment}`,
      ],
      [`<p>Count: {count}</p>`, `<p>Count: {count}</p>`],
      [],
    ];

    ranges.forEach((range, index) => {
      deckSteps.addStep(slideIndex, {
        id: `code-annotation-${index}`,
        order: index,
        show: () => {
          setAnnotations(
            range.map((range) => {
              return {
                query: "",
                name: "focus",
                ...findRange(steps[0].code.code, range)!,
              };
            }),
          );
        },
      });
    });
  });

  return (
    <div className="flex justify-center flex-col h-full">
      <SlideHeading className="mb-8">State</SlideHeading>
      <SlideText className="mb-20">
        State is a variable that hold some information and may change over the
        lifetime of a component.
      </SlideText>
      <FlowChart
        nodes={{
          theme: (
            <Rect size="lg" className="min-w-[300px]">
              <pre>theme = {dark ? '"dark"' : '"light"'}</pre>
            </Rect>
          ),
          rerenders: (
            <Rect size="lg">
              <pre>Rerenders</pre>
            </Rect>
          ),
          ui: (
            <BrowserUI
              className={cn(
                "flex-1 data-[dark]:bg-black bg-white h-[200px] transition-colors duration-1000",
                dark ? "text-white bg-black" : "text-black bg-white",
              )}
            >
              <h1 className="text-6xl">Hello world!</h1>
            </BrowserUI>
          ),
        }}
        className="flex text-2xl justify-between w-full items-start gap-40 max-h-[500px] mb-10"
        connections={[
          ["theme", "rerenders", "right_to_left"],
          ["rerenders", "ui", "right_to_left"],
        ]}
      >
        {(nodes) => (
          <>
            {nodes.theme}
            {nodes.rerenders}
            {nodes.ui}
          </>
        )}
      </FlowChart>
      <Code
        code={{
          ...steps[0].code,
          annotations: annotiations,
        }}
        styled={false}
        lineNumbers={false}
        className="text-xl"
      />
    </div>
  );
}
