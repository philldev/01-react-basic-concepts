import { FlowChart, Rect } from "@/components/flow-chart";
import { SlideSubheading } from "@/components/ui/slide-subheading";

export default function Trigger1() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-10 mb-20">
        <SlideSubheading>Trigger a render in a component</SlideSubheading>
      </div>

      <FlowChart
        nodes={{
          component: (
            <Rect color="light" className="w-full" size="lg">
              User Event
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
          compare: (
            <Rect color="light" className="w-full" size="lg">
              state != newState
            </Rect>
          ),

          newTree: (
            <Rect color="light" className="w-full" size="lg">
              New Render Tree
            </Rect>
          ),
          effects: (
            <Rect color="light" className="w-full" size="lg">
              runEffects()
            </Rect>
          ),
        }}
        connections={[
          ["component", "setState", "bottom_to_top"],
          ["setState", "compare", "bottom_to_top"],
          ["compare", "rerender", "right_to_bottom"],
          ["state", "component", "bottom_to_left"],
          ["rerender", "newTree", "right_to_left"],
          ["rerender", "effects", "right_to_left"],
        ]}
        className="w-full"
        children={(nodes) => (
          <div className="grid grid-cols-4 relative gap-x-32 gap-y-20 w-full">
            <div className="col-start-1">{nodes.component}</div>
            <div className="col-start-1 row-start-2">{nodes.setState}</div>
            <div className="col-start-2 row-start-2">{nodes.rerender}</div>
            <div className="col-start-3 row-start-2">{nodes.newState}</div>
            <div className="col-start-3 row-start-3">{nodes.effects}</div>
            <div className="col-start-4 row-start-2">{nodes.newTree}</div>
            <div className="col-start-1 row-start-3">{nodes.compare}</div>
          </div>
        )}
      />
    </div>
  );
}
