import { FlowChart } from "@/components/flow-chart";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";

export default function ReactRendering() {
  return (
    <div className="flex flex-col items center h-full justify-center">
      <SlideHeading className="mb-40">How React rendering works?</SlideHeading>
      <SlideText className="mb-10">
        Rendering or Reconciliation is a process thats run before the UI gets
        displayed on the screen. <br /> This process has three steps:
      </SlideText>

      <FlowChart
        nodes={{
          trigger: (
            <div className="w-max" id="trigger">
              Trigger 🚀
            </div>
          ),
          render: <div className="self-center w-max px-10">Render ⚙️</div>,
          commit: <div className="self-end w-max">Commit 🖼️</div>,
        }}
        connections={[
          ["trigger", "render", "bottom_to_left"],
          ["render", "commit", "right_to_top"],
        ]}
        className="w-full font-mono"
      >
        {(nodes) => (
          <div className="flex flex-col text-6xl leading-relaxed mb-20">
            {nodes.trigger}
            {nodes.render}
            {nodes.commit}
          </div>
        )}
      </FlowChart>
    </div>
  );
}
