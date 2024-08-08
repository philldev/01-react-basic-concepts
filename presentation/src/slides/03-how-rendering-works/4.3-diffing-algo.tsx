import { Step, useDeck } from "@/components/deck";
import { FlowChart, Rect, RectProps } from "@/components/flow-chart";
import { Grid, GridItem } from "@/components/ui/grid";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideSubheading } from "@/components/ui/slide-subheading";
import { SlideText } from "@/components/ui/slide-text";
import { useOnMount } from "@/hooks/use-onmount";
import { cn } from "@/lib/utils";
import { useState } from "react";

const TreeNodeRect = ({ className, size = "xs", ...props }: RectProps) => (
  <Rect
    {...props}
    size={size}
    className={cn("w-full justify-left", className)}
  />
);

const TreeNodes = {
  main: (props?: RectProps, text?: string) => (
    <TreeNodeRect {...props} children={text ?? "<main>"} />
  ),
  ul: (props?: RectProps, text?: string) => (
    <TreeNodeRect {...props} children={text ?? "<ul>"} />
  ),
  li: (props?: RectProps, text?: string) => (
    <TreeNodeRect {...props} children={text ?? "<li>"} />
  ),
  div: (props?: RectProps, text?: string) => (
    <TreeNodeRect {...props} children={text ?? "<div>"} />
  ),
  button: (props?: RectProps, text?: string) => (
    <TreeNodeRect {...props} children={text ?? "<button>"} />
  ),
  text: (props?: RectProps, text?: string) => (
    <TreeNodeRect {...props} children={text ?? "<text>"} />
  ),
};

export default function DiffingAlgo3() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-20">
        <SlideSubheading className="text-foreground/80">
          Diffing Algorithm
        </SlideSubheading>
        <SlideHeading className="mb-10">3. List of elements</SlideHeading>
        <SlideText className="text-muted-foreground">
          React will compare each item one by one at the same time and set and
          update if there is a difference.
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
        <Step order={10}>
          <DomChanges />
        </Step>
      </div>

      <Step order={30} className="flex gap-4">
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

const oldTreeNodes = {
  ul: TreeNodes.ul(),
  li_1: TreeNodes.li({}, "<li>item 1</li>"),
  li_2: TreeNodes.li({}, "<li>item 2</li>"),
  li_3: TreeNodes.li({}, "<li>item 3</li>"),
  li_4: TreeNodes.li({}, "<li>item 4</li>"),
};

function OldTree() {
  return (
    <FlowChart
      className="flex-1"
      nodes={oldTreeNodes}
      connections={[
        ["ul", "li_1", "bottom_to_left"],
        ["ul", "li_2", "bottom_to_left"],
        ["ul", "li_3", "bottom_to_left"],
        ["ul", "li_4", "bottom_to_left"],
      ]}
      children={(nodes) => {
        return (
          <div className="flex flex-col gap-4">
            <Rect color="orange" className="w-full">
              Old tree
            </Rect>
            <Grid className="gap-4 gap-x-2 w-max">
              <GridItem col={1} row={1} children={nodes.ul} />
              <GridItem col={2} row={2} className="flex flex-col gap-2">
                {nodes.li_1}
                {nodes.li_2}
                {nodes.li_3}
                {nodes.li_4}
              </GridItem>
            </Grid>
          </div>
        );
      }}
    />
  );
}

function DomChanges() {
  const { deckSteps, slideIndex } = useDeck();

  const [index, setIndex] = useState(0);
  const len = 4;

  useOnMount(() => {
    for (let i = 0; i < len; i++) {
      deckSteps.addStep(slideIndex, {
        order: i + 11,
        show: () => {
          setIndex(i + 1);
        },
        id: `dom-changes-${i}`,
      });
    }
  });

  return (
    <FlowChart
      className="flex-1"
      nodes={{
        ul: TreeNodes.ul(),
        li1: TreeNodes.li(
          {
            className: "w-[135px]",
          },
          "<li>item 1</li>",
        ),
        li2: TreeNodes.li(
          {
            className: "w-[135px]",
          },
          "<li>item 2</li>",
        ),
        li3: TreeNodes.li(
          {
            className: "w-[135px]",
            color: index >= 1 ? "yellow" : "transparent",
          },
          index >= 1 ? "<li>new item</li>" : "<li>item 3</li>",
        ),
        li4: TreeNodes.li(
          {
            className: "w-[135px]",
            color: index >= 2 ? "yellow" : "transparent",
          },
          index >= 2 ? "<li>item 3</li>" : "<li>item 4</li>",
        ),
        li5: TreeNodes.li(
          {
            className: "w-[135px]",
            color: "green",
          },
          "<li>item 4</li>",
        ),
      }}
      connections={[
        ["ul", "li1", "bottom_to_left"],
        ["ul", "li2", "bottom_to_left"],
        ["ul", "li3", "bottom_to_left"],
        ["ul", "li4", "bottom_to_left"],
        ["ul", "li5", "bottom_to_left"],
      ]}
      children={(nodes) => (
        <div className="flex flex-col gap-4">
          <Rect color="blue" className="w-full">
            Dom Changes
          </Rect>
          <Grid className="gap-4 gap-x-2">
            <GridItem col={1} row={1} children={nodes.ul} />
            <GridItem col={2} row={2} className="flex flex-col gap-2">
              {nodes.li1}
              {nodes.li2}
              {nodes.li3}
              {nodes.li4}
              {index >= 3 ? nodes.li5 : null}
            </GridItem>
          </Grid>
        </div>
      )}
    />
  );
}

const newTreeNodes = {
  ul: TreeNodes.ul(),
  li_1: TreeNodes.li({}, "<li>item 1</li>"),
  li_2: TreeNodes.li({}, "<li>item 2</li>"),
  new_li: TreeNodes.li({}, "<li>new item</li>"),
  li_3: TreeNodes.li({}, "<li>item 3</li>"),
  li_4: TreeNodes.li({}, "<li>item 4</li>"),
};

function Compare() {
  const { deckSteps, slideIndex } = useDeck();

  const [index, setIndex] = useState(0);
  const len = 5;

  useOnMount(() => {
    for (let i = 0; i <= len; i++) {
      deckSteps.addStep(slideIndex, {
        order: i + 5,
        show: () => {
          setIndex(i + 1);
        },
        id: `compare-${i}`,
      });
    }
  });

  return (
    <FlowChart
      className="flex-1 w-full"
      nodes={{
        old_ul: TreeNodes.ul(),
        old_li_1: TreeNodes.li(
          {
            focus: index === 1,
          },
          "<li>item 1</li>",
        ),
        old_li_2: TreeNodes.li(
          {
            focus: index === 2,
          },
          "<li>item 2</li>",
        ),
        old_li_3: TreeNodes.li(
          {
            focus: index === 3,
            color: index >= 3 ? "yellow" : "transparent",
          },
          "<li>item 3</li>",
        ),
        old_li_4: TreeNodes.li(
          {
            focus: index === 4,
            color: index >= 4 ? "yellow" : "transparent",
          },
          "<li>item 4</li>",
        ),
        old_null: TreeNodes.text(
          {
            focus: index === 5,
            color: index >= 5 ? "green" : "transparent",
          },
          "null",
        ),
        new_ul: TreeNodes.ul(),
        new_li_1: TreeNodes.li(
          {
            focus: index === 1,
          },
          "<li>item 1</li>",
        ),
        new_li_2: TreeNodes.li(
          {
            focus: index === 2,
          },
          "<li>item 2</li>",
        ),
        new_new_li: TreeNodes.li(
          {
            focus: index === 3,
            color: index >= 3 ? "yellow" : "transparent",
          },
          "<li>new item</li>",
        ),
        new_li_3: TreeNodes.li(
          {
            focus: index === 4,
            color: index >= 4 ? "yellow" : "transparent",
          },
          "<li>item 3</li>",
        ),
        new_li_4: TreeNodes.li(
          {
            focus: index === 5,
            color: index >= 5 ? "green" : "transparent",
          },
          "<li>item 4</li>",
        ),
      }}
      connections={[
        ["old_ul", "old_li_1", "bottom_to_left"],
        ["old_ul", "old_li_2", "bottom_to_left"],
        ["old_ul", "old_li_3", "bottom_to_left"],
        ["old_ul", "old_li_4", "bottom_to_left"],
        ["old_ul", "old_null", "bottom_to_left"],
        ["new_ul", "new_li_1", "bottom_to_left"],
        ["new_ul", "new_li_2", "bottom_to_left"],
        ["new_ul", "new_new_li", "bottom_to_left"],
        ["new_ul", "new_li_3", "bottom_to_left"],
        ["new_ul", "new_li_4", "bottom_to_left"],
      ]}
      children={(nodes) => (
        <div className="flex w-full flex-col items-center gap-4">
          <Rect className="w-full">compare(oldTree, newTree)</Rect>
          <Grid className="grid gap-4 gap-x-2 w-max">
            <GridItem col={1} row={1} children={nodes.old_ul} />
            <GridItem col={2} row={2} className="flex flex-col gap-2">
              {nodes.old_li_1}
              {nodes.old_li_2}
              {nodes.old_li_3}
              {nodes.old_li_4}
              {nodes.old_null}
            </GridItem>
            <GridItem col={1} row={3} children={nodes.new_ul} />
            <GridItem col={2} row={4} className="flex flex-col gap-2">
              {nodes.new_li_1}
              {nodes.new_li_2}
              {nodes.new_new_li}
              {nodes.new_li_3}
              {nodes.new_li_4}
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
      nodes={newTreeNodes}
      connections={[
        ["ul", "li_1", "bottom_to_left"],
        ["ul", "li_2", "bottom_to_left"],
        ["ul", "new_li", "bottom_to_left"],
        ["ul", "li_3", "bottom_to_left"],
        ["ul", "li_4", "bottom_to_left"],
      ]}
      children={(nodes) => (
        <div className="flex flex-col gap-4">
          <Rect color="purple" className="w-full">
            New tree
          </Rect>
          <Grid className="grid gap-4 gap-x-2 w-max">
            <GridItem col={1} row={1}>
              {nodes.ul}
            </GridItem>
            <GridItem
              col={2}
              row={2}
              className="flex flex-col gap-2 items-stretch"
            >
              {nodes.li_1}
              {nodes.li_2}
              {nodes.new_li}
              {nodes.li_3}
              {nodes.li_4}
            </GridItem>
          </Grid>
        </div>
      )}
    />
  );
}
