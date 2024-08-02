import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import Content from "./02.5.2-react-state.code.md";
import { Code, findRange } from "@/components/code";
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
export default function StateInReact() {
  const [annotiations, setAnnotations] = useState<CodeAnnotation[]>([]);

  useAddStep(async () => {
    const range1 = findRange(
      steps[0].code.code,
      `const [count, setCount] = useState(0);`,
    );

    const range2 = findRange(
      steps[0].code.code,
      `import { useState } from "react";`,
    );

    if (!range1 || !range2) return;

    setAnnotations([
      {
        query: "",
        name: "focus",
        ...range1,
      },
      {
        query: "",
        name: "focus",
        ...range2,
      },
    ]);
  }, 0);

  useAddStep(async () => {
    const range = findRange(
      steps[0].code.code,
      `const increment = () => setCount((prev) => prev + 1);`,
    );

    if (!range) return;

    setAnnotations([
      {
        query: "",
        name: "focus",
        ...range,
      },
    ]);
  }, 1);

  useAddStep(async () => {
    const range1 = findRange(steps[0].code.code, `<p>Count: {count}</p>`);

    const range2 = findRange(steps[0].code.code, `onClick={increment}`);

    if (!range1 || !range2) return;

    setAnnotations([
      {
        query: "",
        name: "focus",
        ...range1,
      },
      {
        query: "",
        name: "focus",
        ...range2,
      },
    ]);
  }, 2);

  useAddStep(async () => {
    setAnnotations([]);
  }, 3);

  return (
    <div className="flex justify-center flex-col h-full">
      <div className="text-2xl text-foreground/80 mb-4">
        React State Example
      </div>
      <Code
        code={{
          ...steps[0].code,
          annotations: annotiations,
        }}
        styled={false}
        lineNumbers={false}
        className="text-2xl"
      />
    </div>
  );
}
