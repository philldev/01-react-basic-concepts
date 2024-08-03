import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import Content from "./04.1-trigger.code.md";
import { Code } from "@/components/code";
import Step from "@/components/step";
import { motion, useAnimationControls } from "framer-motion";
import { useAddStep } from "@/components/presentation";
import { useState } from "react";
import BrowserUI from "@/components/browser-ui";
import { Button } from "@/components/ui/button";

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
const code3 = steps[2].code;
const code4 = steps[3].code;

export default function Trigger() {
  const controls1 = useAnimationControls();
  const controls2 = useAnimationControls();

  useAddStep(async () => {
    const hide1 = controls1.start(
      {
        height: 0,
        opacity: 0,
      },
      {
        duration: 0.5,
        ease: "easeInOut",
      },
    );

    const show2 = controls2.start(
      {
        height: "auto",
        opacity: 1,
      },
      {
        duration: 0.5,
        ease: "easeInOut",
      },
    );

    await Promise.all([hide1, show2]);
  }, 3);

  const [showValidCode, setShowValidCode] = useState(false);
  const [batchUpdateCode, setBatchUpdateCode] = useState(code3);

  const [count, setCount] = useState(0);

  const handleClick = () => {
    if (showValidCode) {
      setCount((n) => n + 1);
      setCount((n) => n + 1);
      setCount((n) => n + 1);
    } else {
      setCount(count + 1);
      setCount(count + 1);
      setCount(count + 1);
    }
  };

  useAddStep(async () => {
    setBatchUpdateCode(code4);
    setShowValidCode(true);
    setCount(0);
  }, 4);

  return (
    <div className="flex flex-col h-full items center justify-center">
      <h1 className="text-8xl font-medium mb-8">Step 1: Trigger 🚀</h1>

      <div className="text-2xl leading-relaxed text-foreground/80 mb-20">
        There are two ways to trigger a render in React
      </div>

      <motion.div animate={controls1} className="flex gap-10">
        <Step index={0} className="flex-1 flex flex-col gap-4">
          <div className="text-4xl font-medium">Initial Render</div>
          <Code code={code1} lineNumbers={false} />
        </Step>
        <Step index={1} className="flex-1 flex flex-col gap-4">
          <div className="text-4xl font-medium">State Changes</div>
          <Code code={code2} lineNumbers={false} />
        </Step>
      </motion.div>

      <motion.div
        animate={controls2}
        initial={{ height: 0, opacity: 0 }}
        className="flex flex-col gap-10 z-10"
      >
        <div className="text-4xl font-medium">Batch Updates</div>
        <div className="flex gap-10">
          <Code
            code={batchUpdateCode}
            containerProps={{ className: "flex-1" }}
          />
          <BrowserUI className="flex-1">
            <div className="flex-1 text-2xl flex flex-col gap-4 justify-center items-center h-full">
              <p>Count: {count}</p>
              <div>
                <Button size="lg" onClick={handleClick}>
                  +3
                </Button>
              </div>
            </div>
          </BrowserUI>
        </div>
      </motion.div>
    </div>
  );
}
