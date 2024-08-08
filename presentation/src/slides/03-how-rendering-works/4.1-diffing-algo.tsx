import { Step, useDeck } from "@/components/deck";
import { FlowChart, Rect, RectProps } from "@/components/flow-chart";
import { Grid, GridItem } from "@/components/ui/grid";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideSubheading } from "@/components/ui/slide-subheading";
import { SlideText } from "@/components/ui/slide-text";
import { useOnMount } from "@/hooks/use-onmount";
import { useState } from "react";

const TreeNodes = {
  main: (props?: RectProps) => <Rect size="xs" {...props} children="<main/>" />,
  ul: (props?: RectProps) => <Rect size="xs" {...props} children="<ul/>" />,
  li: (props?: RectProps) => <Rect size="xs" {...props} children="<li/>" />,
  div: (props?: RectProps) => <Rect size="xs" {...props} children="<div/>" />,
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
        <Step order={7}>
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

// TODO: add grid Component

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
      children={(nodes) => {
        return (
          <div className="flex flex-col gap-4">
            <Rect color="orange" className="w-full">
              Old tree
            </Rect>
            <Grid className="grid-cols-2 gap-4 gap-x-2 w-max">
              <GridItem col={1} row={1}>
                {nodes.main}
              </GridItem>
              <GridItem col={2} row={2}>
                {nodes.ul}
              </GridItem>
              <GridItem col={3} row={3} className="flex flex-col gap-2">
                {nodes.li1}
                {nodes.li2}
              </GridItem>
            </Grid>
          </div>
        );
      }}
    />
  );
}

function DomChanges() {
  const [count, setCount] = useState(0);

  const { deckSteps, slideIndex } = useDeck();

  useOnMount(() => {
    deckSteps.addStep(slideIndex, {
      order: 8,
      show: () => {
        setCount(1);
      },
      id: `dom-changes-${1}`,
    });

    deckSteps.addStep(slideIndex, {
      order: 9,
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
          <Grid className="grid-cols-2 gap-4 gap-x-2 w-max">
            <GridItem col={1} row={1}>
              {nodes.main}
            </GridItem>
            <GridItem col={2} row={2}>
              {nodes.ul}
            </GridItem>
            <GridItem col={3} row={3} className="flex flex-col gap-2">
              {nodes.li1}
              {nodes.li2}
            </GridItem>
            {count > 0 && (
              <>
                <GridItem col={2} row={4}>
                  {nodes.div}
                </GridItem>
                <GridItem col={3} row={5} className="flex flex-col gap-2">
                  {nodes.new_li1}
                  {nodes.new_li2}
                </GridItem>
              </>
            )}
          </Grid>
        </div>
      )}
    />
  );
}

function Compare() {
  const [focus1, setFocus1] = useState<string>();
  const [focus2, setFocus2] = useState<string>();
  const [changed, setChanged] = useState(false);

  const { deckSteps, slideIndex } = useDeck();

  useOnMount(() => {
    deckSteps.addStep(slideIndex, {
      order: 5,
      show: () => {
        setFocus1("main");
        setFocus2("main_2");
      },
      id: `focus-${1}`,
    });

    deckSteps.addStep(slideIndex, {
      order: 6,
      show: () => {
        setFocus1("div");
        setFocus2("ul");
      },
      id: `focus-${2}`,
    });

    deckSteps.addStep(slideIndex, {
      order: 6,
      show: () => {
        setChanged(true);
      },
      id: `focus-${3}`,
    });
  });

  return (
    <FlowChart
      className="flex-1 w-full"
      nodes={{
        main: TreeNodes.main({ focus: focus1 === "main" }),
        div: TreeNodes.div({
          color: changed ? "yellow" : undefined,
          focus: focus1 === "div",
        }),
        div_li1: TreeNodes.li(),
        div_li2: TreeNodes.li(),
        main_2: TreeNodes.main({ focus: focus2 === "main_2" }),
        ul: TreeNodes.ul({
          color: changed ? "yellow" : undefined,
          focus: focus2 === "ul",
        }),
        ul_li1: TreeNodes.li(),
        ul_li2: TreeNodes.li(),
      }}
      connections={[
        ["main", "ul", "bottom_to_left"],
        ["ul", "ul_li1", "bottom_to_left"],
        ["ul", "ul_li2", "bottom_to_left"],
        ["main_2", "div", "bottom_to_left"],
        ["div", "div_li1", "bottom_to_left"],
        ["div", "div_li2", "bottom_to_left"],
      ]}
      children={(nodes) => (
        <div className="flex w-full flex-col items-center gap-4">
          <Rect className="w-full">compare(oldTree, newTree)</Rect>
          <Grid className="grid grid-cols-2 gap-4 gap-x-2 w-max">
            <GridItem col={1} row={1}>
              {nodes.main}
            </GridItem>
            <GridItem col={2} row={2}>
              {nodes.ul}
            </GridItem>
            <GridItem col={3} row={3} className="flex flex-col gap-2">
              {nodes.ul_li1}
              {nodes.ul_li2}
            </GridItem>

            <GridItem col={1} row={4}>
              {nodes.main_2}
            </GridItem>
            <GridItem col={2} row={5}>
              {nodes.div}
            </GridItem>
            <GridItem col={3} row={6} className="flex flex-col gap-2">
              {nodes.div_li1}
              {nodes.div_li2}
            </GridItem>
          </Grid>
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
          <Grid className="grid grid-cols-2 gap-4 gap-x-2 w-max">
            <GridItem col={1} row={1}>
              {nodes.main}
            </GridItem>
            <GridItem col={2} row={2}>
              {nodes.div}
            </GridItem>
            <GridItem col={3} row={3} className="flex flex-col gap-2">
              {nodes.li1}
              {nodes.li2}
            </GridItem>
          </Grid>
        </div>
      )}
    />
  );
}
