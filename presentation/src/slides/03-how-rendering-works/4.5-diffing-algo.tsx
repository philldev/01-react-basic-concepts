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

export default function DiffingAlgo5() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-12">
        <SlideSubheading className="text-foreground/80">
          Diffing Algorithm
        </SlideSubheading>
        <SlideHeading className="mb-10">
          4. Dynamic List of elements with keys
        </SlideHeading>
        <SlideText className="text-muted-foreground">
          In React, a key is a special attribute used to uniquely identify
          elements in a list. Keys help React optimize the rendering process by
          keeping track of elements and ensuring that only the elements that
          change are re-rendered.
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
      <ComparingChart index={index} title="Keys using index" newItemIndex={0} />
      <ComparingChart
        index={index}
        title="Keys using unique id"
        newItemIndex={0}
        uniqueId={true}
      />
    </div>
  );
}

function ComparingChart(props: {
  index: number;
  title: string;
  newItemIndex: number;
  uniqueId?: boolean;
}) {
  const [changes, setChanges] = useState(0);

  useEffect(() => {
    if (props.uniqueId) {
      if (props.index === props.newItemIndex) {
        setChanges((c) => c + 1);
      }
    } else {
      if (props.index >= props.newItemIndex) {
        setChanges((c) => c + 1);
      }
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
              let text = ``;
              let color = "transparent";
              let focus = false;

              if (props.newItemIndex === index) {
                text = `<li key="${props.uniqueId ? 9 : index}">new item</li>`;
              } else {
                text = `<li key="${
                  props.uniqueId ? index - 1 : index
                }">item ${index}</li>`;
              }

              if (props.uniqueId) {
                if (
                  index === props.newItemIndex &&
                  props.index === props.newItemIndex
                )
                  focus = true;

                if (props.index === index) {
                  focus = true;
                }
              } else {
                if (props.index === index) {
                  focus = true;
                }
                if (props.index >= index) {
                  color = "yellow";
                }
              }

              if (index === props.newItemIndex) color = "green";

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
              let text = ``;
              let color = "transparent";
              let focus = false;

              text = `<li key="${index}">item ${index + 1}</li>`;

              if (props.uniqueId) {
                if (props.index === index + 1) {
                  focus = true;
                }
              } else {
                if (props.index === index) {
                  focus = true;
                }

                if (props.index >= index) {
                  color = "yellow";
                }
              }

              if (index === 9) text = "null";

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
              let text = ``;
              let color = "transparent";

              if (index > props.index || props.index === -1) return null;

              if (index === props.newItemIndex) {
                text = `<li>new item</li>`;
              } else {
                text = `<li>item ${index}</li>`;
              }

              if (props.uniqueId) {
                if (index === props.newItemIndex) {
                  color = "green";
                }
              } else {
                if (props.index >= index && index >= props.newItemIndex) {
                  color = "yellow";
                }

                if (index === 9) {
                  color = "green";
                }
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
