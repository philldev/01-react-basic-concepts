import { FlowChart, Rect } from "@/components/flow-chart";
import { SlideSubheading } from "@/components/ui/slide-subheading";

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
          // effects: (
          //   <Rect color="light" className="w-full" size="lg">
          //     runEffects()
          //   </Rect>
          // ),
        }}
        connections={[
          ["component", "rerender", "bottom_to_left"],
          ["newState", "rerender", "right_to_bottom"],
          ["state", "component", "bottom_to_left"],
          ["rerender", "newTree", "right_to_left"],
          // ["rerender", "effects", "right_to_left"],
        ]}
        className="w-full flex-1"
        children={(nodes) => (
          <div className="grid grid-cols-4 relative gap-x-32 gap-y-20 w-full">
            <div className="col-start-1">{nodes.component}</div>
            <div className="col-start-2 row-start-2">{nodes.rerender}</div>
            <div className="col-start-3 row-start-2">
              {nodes.initializeState}
            </div>
            <div className="col-start-4 row-start-2">{nodes.newTree}</div>
          </div>
        )}
      />

      <a href="https://react.dev/learn/render-and-commit#initial-render">
        react.dev/learn/render-and-commit#initial-render
      </a>
    </div>
  );
}
