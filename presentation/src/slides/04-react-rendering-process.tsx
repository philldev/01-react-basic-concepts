import { FlowChart, FlowChartConnection } from "@/components/flow-chart";

const connections: FlowChartConnection[] = [
  {
    start: "trigger",
    end: "render",
    startPosition: "bottom",
    endPosition: "left",
  },
  {
    start: "render",
    end: "commit",
    startPosition: "right",
    endPosition: "top",
  },
];

export default function ReactRenderingProcess() {
  return (
    <div className="flex flex-col items center h-full justify-center">
      <h1 className="text-8xl font-medium mb-20">How React rendering works?</h1>
      <p className="text-2xl leading-relaxed text-foreground/80 mb-8">
        Rendering is a process thats run before the UI gets displayed on the
        screen. <br /> This process has three steps:
      </p>

      <FlowChart connections={connections} className="w-full font-mono">
        <div className="flex flex-col text-6xl leading-relaxed mb-20">
          <div className="w-max" id="trigger">
            Trigger 🚀
          </div>
          <div id="render" className="self-center w-max px-10">
            Render ⚙️
          </div>
          <div id="commit" className="self-end w-max">
            Commit 🖼️
          </div>
        </div>
      </FlowChart>
    </div>
  );
}
