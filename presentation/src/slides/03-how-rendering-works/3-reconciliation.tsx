import { FlowChart, Rect } from "@/components/flow-chart";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";

export default function Reconciliation() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-10 mb-20">
        <SlideHeading className="flex-1">Reconciliation 🔄</SlideHeading>
        <SlideText className="flex-1">
          React's reconciliation is the process of comparing the current state
          of the component tree with the desired state to determine the minimum
          number of changes needed to make the actual DOM match the virtual DOM.
        </SlideText>

        <SlideText className="flex-1">
          This process is recursive, meaning that it will compare the children
          of the current tree with the children of the desired tree, and so on.
        </SlideText>
      </div>

      <FlowChart
        nodes={{
          oldTree: (
            <Rect color="light" size="lg">
              Old Tree
            </Rect>
          ),
          newTree: (
            <Rect color="light" size="lg">
              New Tree
            </Rect>
          ),
          diff: (
            <Rect color="light" size="lg">
              Diffing
            </Rect>
          ),
          dom: (
            <Rect color="light" size="lg">
              DOM Changes
            </Rect>
          ),
        }}
        connections={[
          ["oldTree", "diff", "right_to_left"],
          ["newTree", "diff", "right_to_left"],
          ["diff", "dom", "right_to_left"],
        ]}
        children={(nodes) => (
          <div className="flex gap-40 items-center">
            <div className="flex flex-col gap-10">
              {nodes.oldTree}
              {nodes.newTree}
            </div>
            {nodes.diff}
            {nodes.dom}
          </div>
        )}
      />
    </div>
  );
}
