import { FlowChart } from "@/components/flow-chart";
import Content from "./02.6-react-effects.code.md";
import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import Step from "@/components/step";

export default function RenderTree() {
  return (
    <div className="flex justify-center flex-col h-full">
      <h1 className="w-full text-8xl font-medium mb-8">Render Tree</h1>
      <p className="text-2xl text-foreground/80 mb-20">
        The render tree is a tree-like structure that represents the output of
        React's render function. It is a hierarchical representation of the
        components that are rendered on the screen.
      </p>
      <Step index={0}>
        <img src="https://react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fpreserving_state_dom_tree.dark.png&w=1920&q=75" />
      </Step>
    </div>
  );
}
