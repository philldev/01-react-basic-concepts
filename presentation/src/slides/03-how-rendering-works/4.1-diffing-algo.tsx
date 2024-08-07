import { Step, useDeck } from "@/components/deck";
import { FlowChart, Rect, RectProps } from "@/components/flow-chart";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideSubheading } from "@/components/ui/slide-subheading";
import { SlideText } from "@/components/ui/slide-text";
import { useOnMount } from "@/hooks/use-onmount";
import { useState } from "react";

const TreeNodes = {
  main: (props?: RectProps) => <Rect size="sm" {...props} children="<main/>" />,
  ul: (props?: RectProps) => <Rect size="sm" {...props} children="<ul/>" />,
  li: (props?: RectProps) => <Rect size="sm" {...props} children="<li/>" />,
  div: (props?: RectProps) => <Rect size="sm" {...props} children="<div/>" />,
  button: (props?: RectProps) => (
    <Rect size="sm" {...props} children="<button/>" />
  ),
};

export default function DiffingAlgo1() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-20">
        <SlideSubheading className="text-foreground/80">
          Diffing Algorithm
        </SlideSubheading>
        <SlideHeading className="mb-10">
          1. Element of different type
        </SlideHeading>
        <SlideText className="text-muted-foreground">
          Whenever the root elements have different type react unmount the old
          tree and create a new tree from scratch.
        </SlideText>
      </div>
      <Chart />
    </div>
  );
}

function Chart() {
  return (
    <div className="flex flex-col gap-8 flex-1">
      <div className="flex flex-1 gap-10">
        <Step order={1}>
          <OldTree />
        </Step>
        <Step order={2} className="flex-1">
          <Rect className="h-max w-full">rerender</Rect>
        </Step>
        <Step order={3}>
          <NewTree />
        </Step>
        <Step order={4} className="flex-1">
          <Compare />
        </Step>
        <Step order={5}>
          <DomChanges />
        </Step>
      </div>

      <Step order={10} className="flex gap-4">
        <Rect size="sm" color="yellow">
          Changed
        </Rect>
        <Rect size="sm" color="green">
          Mount
        </Rect>
        <Rect size="sm" color="red">
          Unmount
        </Rect>
      </Step>
    </div>
  );
}

function OldTree() {
  return (
    <FlowChart
      className="flex-1"
      nodes={{
        main: TreeNodes.main(),
        ul: TreeNodes.ul(),
        li1: TreeNodes.li(),
        li2: TreeNodes.li(),
      }}
      connections={[
        ["ul", "li1", "bottom_to_left"],
        ["ul", "li2", "bottom_to_left"],
        ["main", "ul", "bottom_to_left"],
      ]}
      children={(nodes) => (
        <div className="flex flex-col gap-4">
          <Rect color="orange" className="w-full">
            Old tree
          </Rect>
          <div className="grid grid-cols-2 gap-4 gap-x-2 w-max">
            <div className="col-span-1 row-span-1">{nodes.main}</div>
            <div className="col-start-2 row-start-2 col-span-1 row-span-1">
              {nodes.ul}
            </div>
            <div className="row-start-3 col-start-3 col-span-1 row-span-1 flex flex-col gap-2">
              {nodes.li1}
              {nodes.li2}
            </div>
          </div>
        </div>
      )}
    />
  );
}

function DomChanges() {
  const [count, setCount] = useState(0);

  const { deckSteps, slideIndex } = useDeck();

  useOnMount(() => {
    deckSteps.addStep(slideIndex, {
      order: 1 + 1 + 6,
      show: () => {
        setCount(1);
      },
      id: `dom-changes-${1}`,
    });

    deckSteps.addStep(slideIndex, {
      order: 1 + 1 + 6,
      show: () => {
        setCount(2);
      },
      id: `dom-changes-${2}`,
    });
  });

  const ulLiColors = count > 1 ? "red" : "transparent";
  const ulColor = count > 1 ? "red" : "yellow";

  const divColor = count > 1 ? "green" : "transparent";

  return (
    <FlowChart
      className="flex-1"
      nodes={{
        main: TreeNodes.main(),
        ul: TreeNodes.ul({ color: ulColor }),
        li1: TreeNodes.li({ color: ulLiColors }),
        li2: TreeNodes.li({ color: ulLiColors }),
        div: TreeNodes.div({ color: divColor }),
        new_li1: TreeNodes.li({ color: divColor }),
        new_li2: TreeNodes.li({ color: divColor }),
      }}
      connections={[
        ["ul", "li1", "bottom_to_left"],
        ["ul", "li2", "bottom_to_left"],
        count === 0
          ? ["main", "ul", "bottom_to_left"]
          : ["main", "div", "bottom_to_left"],
        ["div", "new_li1", "bottom_to_left"],
        ["div", "new_li2", "bottom_to_left"],
      ]}
      children={(nodes) => (
        <div className="flex flex-col gap-4">
          <Rect color="blue" className="w-full">
            Dom Changes
          </Rect>
          <div className="grid grid-cols-2 gap-4 gap-x-2 w-max">
            <div className="col-span-1 row-span-1">{nodes.main}</div>
            <div className="col-start-2 row-start-2 col-span-1 row-span-1">
              {nodes.ul}
            </div>
            <div className="row-start-3 col-start-3 col-span-1 row-span-1 flex flex-col gap-2">
              {nodes.li1}
              {nodes.li2}
            </div>
            {count > 0 && (
              <>
                <div className="col-start-2 row-start-4 col-span-1 row-span-1">
                  {nodes.div}
                </div>
                <div className="row-start-5 col-start-3 col-span-1 row-span-1 flex flex-col gap-2">
                  {nodes.new_li1}
                  {nodes.new_li2}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    />
  );
}

function Compare() {
  return (
    <FlowChart
      className="flex-1 w-full"
      nodes={{
        main: TreeNodes.main(),
        div: TreeNodes.div(),
        div_li1: TreeNodes.li(),
        div_li2: TreeNodes.li(),

        main_2: TreeNodes.main(),
        ul: TreeNodes.ul(),
        ul_li1: TreeNodes.li(),
        ul_li2: TreeNodes.li(),
      }}
      connections={[]}
      children={(nodes) => (
        <div className="flex w-full flex-col items-center gap-4">
          <Rect className="w-full">compare(oldTree, newTree)</Rect>
          <div className="grid grid-cols-2 gap-4 gap-x-2 w-max">
            <div className="col-span-1 row-span-1">{nodes.main}</div>
            <div className="col-start-2 row-start-2 col-span-1 row-span-1">
              {nodes.ul}
            </div>
            <div className="row-start-3 col-start-3 col-span-1 row-span-1 flex flex-col gap-2">
              {nodes.ul_li1}
              {nodes.ul_li2}
            </div>

            <div className="col-span-1 row-start-4 row-span-1">
              {nodes.main_2}
            </div>
            <div className="col-start-2 row-start-5 col-span-1 row-span-1">
              {nodes.div}
            </div>
            <div className="row-start-6 col-start-3 col-span-1 row-span-1 flex flex-col gap-2">
              {nodes.div_li1}
              {nodes.div_li2}
            </div>
          </div>
        </div>
      )}
    />
  );
}

function NewTree() {
  return (
    <FlowChart
      className="flex-1"
      nodes={{
        main: TreeNodes.main(),
        div: TreeNodes.div(),
        li1: TreeNodes.li(),
        li2: TreeNodes.li(),
      }}
      connections={[
        ["div", "li1", "bottom_to_left"],
        ["div", "li2", "bottom_to_left"],
        ["main", "div", "bottom_to_left"],
      ]}
      children={(nodes) => (
        <div className="flex flex-col gap-4">
          <Rect color="purple" className="w-full">
            New tree
          </Rect>
          <div className="grid grid-cols-2 gap-4 gap-x-2 w-max">
            <div className="col-span-1 row-span-1">{nodes.main}</div>
            <div className="col-start-2 row-start-2 col-span-1 row-span-1">
              {nodes.div}
            </div>
            <div className="row-start-3 col-start-3 col-span-1 row-span-1 flex flex-col gap-2">
              {nodes.li1}
              {nodes.li2}
            </div>
          </div>
        </div>
      )}
    />
  );
}
