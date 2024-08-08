import { Step, useDeck } from "@/components/deck";
import { FlowChart, Rect, RectProps } from "@/components/flow-chart";
import { Grid, GridItem } from "@/components/ui/grid";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";
import { useOnMount } from "@/hooks/use-onmount";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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

export default function Commit() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-10 mb-6">
        <SlideHeading className="flex-1">Commit 🎨</SlideHeading>
        <SlideText className="flex-1">
          Commit is the process of applying the changes to the DOM.
        </SlideText>
      </div>

      <div className="flex gap-20 flex-1">
        <CommitFlow />
        <Step order={7}>
          <CommitFlowRerenders />
        </Step>
      </div>
    </div>
  );
}

function CommitFlow() {
  const [index, setIndex] = useState(-1);
  const len = 6;

  const { deckSteps, slideIndex } = useDeck();

  useOnMount(() => {
    for (let i = 0; i < len; i++) {
      deckSteps.addStep(slideIndex, {
        id: `commit-${i}`,
        show: () => {
          setIndex(i);
        },
      });
    }
  });
  const changes = [
    <Rect size="xs" color="green" children="<main>" />,
    <Rect size="xs" color="green" children="<ul>" />,
    <Rect size="xs" color="green" children="<li>item 1</li>" />,
    <Rect size="xs" color="green" children="<li>item 2</li>" />,
    <Rect size="xs" color="green" children="<li>item 3</li>" />,
    <Rect size="xs" color="green" children="<li>item 4</li>" />,
  ];

  const changesInfo = [
    "root.appendChild(main)",
    "main.appendChild(ul)",
    "ul.appendChild(li)",
    "ul.appendChild(li)",
    "ul.appendChild(li)",
    "ul.appendChild(li)",
  ];

  return (
    <div className="flex-1 h-full flex-col flex gap-4">
      <Rect className="w-full">Initial Render</Rect>
      <div className="flex gap-6 flex-1">
        <div className="flex flex-1 flex-col gap-4">
          <p className="text-muted-foreground font-semibold text-sm">
            DOM Changes
          </p>
          <div className="flex flex-col gap-4 w-full">
            {changes.map((change, i) => (
              <div key={i} className="relative p-2">
                {i === index && (
                  <motion.div
                    layoutId="selected_1"
                    className="inset-0 w-full h-full bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 absolute rounded-lg"
                  />
                )}
                {change}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-[2] flex flex-col gap-4">
          <p className="text-muted-foreground font-semibold text-sm">
            DOM Tree
          </p>
          <FlowChart
            nodes={{
              root: TreeNodes.div({}, "<div id='root'>"),
              main: TreeNodes.main({ color: "green" }, "<main>"),
              ul: TreeNodes.ul({ color: "green" }, "<ul>"),
              li1: TreeNodes.li({ color: "green" }, "<li>item 1</li>"),
              li2: TreeNodes.li({ color: "green" }, "<li>item 2</li>"),
              li3: TreeNodes.li({ color: "green" }, "<li>item 3</li>"),
              li4: TreeNodes.li({ color: "green" }, "<li>item 4</li>"),
            }}
            connections={[
              ["root", "main", "bottom_to_left"],
              ["main", "ul", "bottom_to_left"],
              ["ul", "li1", "bottom_to_left"],
              ["ul", "li2", "bottom_to_left"],
              ["ul", "li3", "bottom_to_left"],
              ["ul", "li4", "bottom_to_left"],
            ]}
            children={(nodes) => (
              <Grid className="gap-4 gap-x-2">
                <GridItem col={1} row={1} children={nodes.root} />
                {index >= 0 ? (
                  <GridItem col={2} row={2} children={nodes.main} />
                ) : null}
                {index >= 1 ? (
                  <GridItem col={3} row={3} children={nodes.ul} />
                ) : null}
                {index >= 2 ? (
                  <GridItem col={4} row={4} children={nodes.li1} />
                ) : null}
                {index >= 3 ? (
                  <GridItem col={4} row={5} children={nodes.li2} />
                ) : null}
                {index >= 4 ? (
                  <GridItem col={4} row={6} children={nodes.li3} />
                ) : null}
                {index >= 5 ? (
                  <GridItem col={4} row={7} children={nodes.li4} />
                ) : null}
              </Grid>
            )}
          />
        </div>
      </div>

      <div className="p-2 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 rounded-lg flex gap-10">
        <p className="text-sm text-yellow-400 font-medium">Changes info :</p>
        <p className="text-sm text-white font-mono">{changesInfo[index]}</p>
      </div>
    </div>
  );
}

function CommitFlowRerenders() {
  const [index, setIndex] = useState(-1);
  const len = 6;

  const { deckSteps, slideIndex } = useDeck();

  useOnMount(() => {
    for (let i = 0; i < len; i++) {
      deckSteps.addStep(slideIndex, {
        id: `commit-rerender-${i}`,
        show: () => {
          setIndex(i);
        },
        order: 8 + i,
      });
    }
  });
  const changes = [
    <Rect size="xs" color="yellow" children="<main class='article'>" />,
    <Rect size="xs" color="red" children="<ul>" />,
    <Rect size="xs" color="green" children="<section>" />,
    <Rect size="xs" color="green" children="<h1>" />,
    <Rect size="xs" color="green" children="<img>" />,
    <Rect size="xs" color="green" children="<p>" />,
  ];

  const changesInfo = [
    "el.setAttribute('class', 'article')",
    "parent.removeChild(el)",
    "main.appendChild(section)",
    "section.appendChild(h1)",
    "section.appendChild(img)",
    "section.appendChild(p)",
  ];

  return (
    <div className="flex-1 flex-col h-full flex gap-4">
      <Rect className="w-full">Rerenders</Rect>
      <div className="flex gap-6 flex-1">
        <div className="flex flex-1 flex-col gap-4">
          <p className="text-muted-foreground font-semibold text-sm">
            DOM Changes
          </p>
          <div className="flex flex-col gap-4 w-full">
            {changes.map((change, i) => (
              <div key={i} className="relative p-2">
                {i === index && (
                  <motion.div
                    layoutId="selected"
                    className="inset-0 w-full h-full bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 absolute rounded-lg"
                  />
                )}
                {change}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-[2] flex flex-col gap-4">
          <p className="text-muted-foreground font-semibold text-sm">
            DOM Tree
          </p>
          <FlowChart
            nodes={{
              root: TreeNodes.div({}, "<div id='root'>"),
              main: TreeNodes.main(
                {
                  color: index >= 0 ? "yellow" : "transparent",
                  className: "w-[170px]",
                },
                index >= 0 ? "<main class='article'>" : "<main>",
              ),
              ul: TreeNodes.ul(
                {
                  color: index >= 1 ? "red" : "transparent",
                },
                "<ul>",
              ),
              li1: TreeNodes.li({}, "<li>item 1</li>"),
              li2: TreeNodes.li({}, "<li>item 2</li>"),
              li3: TreeNodes.li({}, "<li>item 3</li>"),
              li4: TreeNodes.li({}, "<li>item 4</li>"),
              section: TreeNodes.div({ color: "green" }, "<section>"),
              h1: TreeNodes.div({ color: "green" }, "<h1>"),
              img: TreeNodes.div({ color: "green" }, "<img>"),
              p: TreeNodes.div({ color: "green" }, "<p>"),
            }}
            connections={[
              ["root", "main", "bottom_to_left"],
              index >= 2
                ? ["main", "section", "bottom_to_left"]
                : ["main", "ul", "bottom_to_left"],
              ["ul", "li1", "bottom_to_left"],
              ["ul", "li2", "bottom_to_left"],
              ["ul", "li3", "bottom_to_left"],
              ["ul", "li4", "bottom_to_left"],
              ["section", "h1", "bottom_to_left"],
              ["section", "img", "bottom_to_left"],
              ["section", "p", "bottom_to_left"],
            ]}
            children={(nodes) => (
              <Grid className="gap-4 gap-x-2">
                <GridItem col={1} row={1} children={nodes.root} />
                <GridItem col={2} row={2} children={nodes.main} />
                <GridItem col={3} row={3} children={nodes.ul} />
                <GridItem
                  col={3}
                  row={1}
                  children={<div className="w-[75px]" />}
                />
                <GridItem col={4} row={4} children={nodes.li1} />
                <GridItem col={4} row={5} children={nodes.li2} />
                <GridItem col={4} row={6} children={nodes.li3} />
                <GridItem col={4} row={7} children={nodes.li4} />
                {index >= 2 ? (
                  <>
                    <GridItem col={3} row={8} children={nodes.section} />
                    {index >= 3 ? (
                      <GridItem col={4} row={9} children={nodes.h1} />
                    ) : null}
                    {index >= 4 ? (
                      <GridItem col={4} row={10} children={nodes.img} />
                    ) : null}
                    {index >= 5 ? (
                      <GridItem col={4} row={11} children={nodes.p} />
                    ) : null}
                  </>
                ) : null}
              </Grid>
            )}
          />
        </div>
      </div>
      <div className="p-2 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 rounded-lg flex gap-10">
        <p className="text-sm text-yellow-400 font-medium">Changes info :</p>
        <p className="text-sm text-white font-mono">{changesInfo[index]}</p>
      </div>
    </div>
  );
}
