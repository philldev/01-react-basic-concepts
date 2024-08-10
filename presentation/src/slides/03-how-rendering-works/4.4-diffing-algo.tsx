import { useDeck } from "@/components/deck";
import { Rect, RectProps } from "@/components/flow-chart";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideSubheading } from "@/components/ui/slide-subheading";
import { SlideText } from "@/components/ui/slide-text";
import { useOnMount } from "@/hooks/use-onmount";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const TreeNodeRect = ({ className, size = "xs", ...props }: RectProps) => (
  <Rect
    {...props}
    size={size}
    className={cn("w-max justify-left", className)}
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

export default function DiffingAlgo4() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-12">
        <SlideSubheading className="text-foreground/80">
          Diffing Algorithm
        </SlideSubheading>
        <SlideHeading className="mb-10">
          4. Dynamic List of elements
        </SlideHeading>
        <SlideText className="text-muted-foreground">
          By default, React will compare each item by its position in the list
          one by one at the same time, and set and update if there is a
          difference. However, if the items is dynamic, this algorithm will
          become inefficient.
        </SlideText>
      </div>

      <Chart />
    </div>
  );
}

function Chart() {
  const [index, setIndex] = useState(-1);

  const { slideIndex, deckSteps } = useDeck();

  useOnMount(() => {
    for (let i = 0; i < 10; i++) {
      deckSteps.addStep(slideIndex, {
        order: i,
        show: () => {
          setIndex(i);
        },
        id: `step-${i}`,
      });
    }
  });

  return (
    <div className="flex gap-20">
      <ComparingChart
        index={index}
        title="Appending at the end O(1)"
        newItemIndex={9}
      />
      <ComparingChart
        index={index}
        title="Insert middle O(n/2)"
        newItemIndex={4}
      />
      <ComparingChart
        index={index}
        title="Insert beginning O(n)"
        newItemIndex={0}
      />
    </div>
  );
}

function ComparingChart(props: {
  index: number;
  title: string;
  newItemIndex: number;
}) {
  const [changes, setChanges] = useState(0);

  useEffect(() => {
    if (props.index >= props.newItemIndex) {
      setChanges((c) => c + 1);
    }
  }, [props.index, props.newItemIndex]);

  return (
    <div className="flex flex-col gap-4 font-mono">
      <Rect className="w-full">{props.title}</Rect>
      <div className="grid grid-cols-3 gap-6">
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-muted-foreground font-semibold text-sm">
            New Items
          </p>
          <div className="flex flex-col gap-4">
            {new Array(10).fill(0).map((_, index) => {
              let text = `<li>item ${index + 1}</li>`;
              let color = "transparent";
              let focus = false;

              if (index === props.index) focus = true;

              if (index > props.newItemIndex) {
                text = `<li>item ${index}</li>`;
              }

              if (props.index >= index && index >= props.newItemIndex) {
                color = "yellow";
              }

              if (index === props.newItemIndex) {
                text = `<li>new item</li>`;
                color = "green";
              }

              return (
                <Rect
                  style={{ backgroundColor: "transparent" }}
                  size="xs"
                  key={index}
                  bordered
                  color={color}
                  focus={focus}
                  className="w-full"
                >
                  {text}
                </Rect>
              );
            })}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-muted-foreground font-semibold text-sm">
            Old Items
          </p>
          <div className="flex flex-col gap-4">
            {new Array(10).fill(0).map((_, index) => {
              let text = `<li>item ${index + 1}</li>`;
              let color = "transparent";
              let focus = false;

              if (index === props.index) focus = true;

              if (index === 9) text = "null";

              if (props.index >= index && index >= props.newItemIndex) {
                color = "yellow";
              }

              return (
                <Rect
                  style={{ backgroundColor: "transparent" }}
                  size="xs"
                  key={index}
                  color={color}
                  className="w-full"
                  focus={focus}
                >
                  {text}
                </Rect>
              );
            })}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <p className="text-muted-foreground text-sm font-semibold">
            DOM changes{" "}
            <span className="font-bold text-yellow-500">{changes}</span>
          </p>
          <div className="flex flex-col gap-4">
            {new Array(10).fill(0).map((_, index) => {
              let text = `<li>item ${index + 1}</li>`;
              let color = "transparent";

              if (index > props.index || props.index === -1) return null;

              if (index === props.newItemIndex) {
                text = `<li>new item</li>`;
              }

              if (index > props.newItemIndex) {
                text = `<li>item ${index}</li>`;
              }

              if (index === 9) {
                color = "green";
              } else if (index >= props.newItemIndex) {
                color = "yellow";
              }

              return (
                <Rect
                  transition={{
                    delay: 0.1,
                  }}
                  color={color}
                  size="xs"
                  key={index}
                  className="w-full"
                >
                  {text}
                </Rect>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
