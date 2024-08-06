import { parseRoot, Block, HighlightedCodeBlock } from "codehike/blocks";
import { z } from "zod";
import Content from "./03.2--render.code.md";
import { Code } from "@/components/code";
import { FlowChart, Rect } from "@/components/flow-chart";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { useDeck } from "@/components/deck";
import { useOnMount } from "@/hooks/use-onmount";
import { SlideHeading } from "@/components/ui/slide-heading";
import { SlideText } from "@/components/ui/slide-text";
import { SlideSubheading } from "@/components/ui/slide-subheading";

const { steps } = parseRoot(
  Content,
  Block.extend({
    steps: z.array(
      Block.extend({
        code: HighlightedCodeBlock.extend({
          style: z.object({}),
        }),
      }),
    ),
  }),
);

const code1 = steps[0].code;
const code2 = steps[1].code;

export default function Render() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const { slideIndex, deckSteps } = useDeck();

  useEffect(() => {
    if (!carouselApi) return;

    const subSlideLength = carouselApi.scrollSnapList().length;

    for (let i = 0; i < subSlideLength - 1; i++) {
      const step = {
        id: `step-${i}-${slideIndex}`,
        show: () => carouselApi.scrollNext(),
        order: i,
      };

      deckSteps.addStep(slideIndex, step);
    }
  }, [carouselApi]);

  return (
    <div className="flex flex-col h-full items center justify-center">
      <SlideHeading className="mb-8">Step 2: Render ⚙️</SlideHeading>
      <SlideText className="mb-20">
        "Rendering" is React calling your components{" "}
        <pre className="inline">`Component(props)`</pre> and compute the ui tree
        that will be displayed on the screen.
      </SlideText>
      <Carousel setApi={setCarouselApi}>
        <CarouselContent>
          <CarouselItem>
            <SubSlide1 />
          </CarouselItem>
          <CarouselItem>
            <SubSlide2 />
          </CarouselItem>
          <CarouselItem>
            <SubSlide3 />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
}

function SubSlide1() {
  return (
    <div className="flex gap-20">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <SlideSubheading>2.1 On the initial render</SlideSubheading>
          <SlideText className="text-muted-foreground">
            React calls the root component
            <br />
            <br />
          </SlideText>
        </div>
        <div className="flex gap-10">
          <Code code={code1} lineNumbers={false} />
        </div>

        <FlowChart
          nodes={{
            app: <Rect color="yellow" children="<App/>" />,
            heading: <Rect color="yellow" children="<Heading/>" />,
            counter: <Rect color="yellow" children="<Counter/>" />,
            h1: <Rect color="yellow" children="<h1/>" />,
            p: <Rect color="yellow" children="<p/>" />,
            button: <Rect color="yellow" children="<button/>" />,
          }}
          connections={[
            ["app", "heading", "right_to_left"],
            ["app", "counter", "right_to_left"],
            ["heading", "h1", "right_to_left"],
            ["counter", "p", "right_to_left"],
            ["counter", "button", "right_to_left"],
          ]}
          className="grid place-items-start grid-cols-3 gap-4 w-full"
        >
          {(nodes) => (
            <>
              <div className="col-start-1 col-end-2 row-start-1 row-end-2">
                {nodes.app}
              </div>
              <div className="col-start-2 col-end-3 row-start-1 row-end-2">
                {nodes.heading}
              </div>
              <div className="col-start-2 col-end-3 row-start-2 row-end-3">
                {nodes.counter}
              </div>
              <div className="col-start-3 col-end-4 row-start-1 row-end-2 flex flex-col gap-2">
                {nodes.h1}
              </div>
              <div className="col-start-3 col-end-4 row-start-2 row-end-3 flex flex-col items-start gap-4">
                {nodes.p}
                {nodes.button}
              </div>
            </>
          )}
        </FlowChart>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <SlideSubheading className="text-4xl font-medium">
            2.1 For subsequent renders
          </SlideSubheading>
          <SlideText className="text-muted-foreground">
            React will call the function component whose state update triggered
            the render.
          </SlideText>
        </div>

        <div className="flex gap-10">
          <Code code={code2} lineNumbers={false} />
        </div>

        <FlowChart
          nodes={{
            app: <Rect children="<App/>" />,
            heading: <Rect children="<Heading/>" />,
            counter: <Rect color="yellow" children="<Counter/>" />,
            h1: <Rect children="<h1/>" />,
            p: <Rect color="yellow" children="<p/>" />,
            button: <Rect color="yellow" children="<button/>" />,
          }}
          connections={[
            ["app", "heading", "right_to_left"],
            ["app", "counter", "right_to_left"],
            ["heading", "h1", "right_to_left"],
            ["counter", "p", "right_to_left"],
            ["counter", "button", "right_to_left"],
          ]}
          className="grid place-items-start grid-cols-3 gap-4 w-full"
        >
          {(nodes) => (
            <>
              <div className="col-start-1 col-end-2 row-start-1 row-end-2">
                {nodes.app}
              </div>
              <div className="col-start-2 col-end-3 row-start-1 row-end-2">
                {nodes.heading}
              </div>
              <div className="col-start-2 col-end-3 row-start-2 row-end-3">
                {nodes.counter}
              </div>
              <div className="col-start-3 col-end-4 row-start-1 row-end-2 flex flex-col gap-2">
                {nodes.h1}
              </div>
              <div className="col-start-3 col-end-4 row-start-2 row-end-3 flex flex-col items-start gap-4">
                {nodes.p}
                {nodes.button}
              </div>
            </>
          )}
        </FlowChart>
      </div>
    </div>
  );
}

function SubSlide2() {
  return (
    <div className="flex flex-col gap-8">
      <SlideSubheading className="text-4xl font-medium">
        2.2 Diffing the UI tree
      </SlideSubheading>
      <SlideText>
        On the subsequent renders react, React needs to figure out how to
        efficiently update the UI to match the most recent tree. Generic
        solutions to this problem have a complexity of O(n^3), but React uses a
        more efficient O(n) heuristic based on two assumptions:
      </SlideText>

      <ol className="list-inside flex flex-col gap-4 text-2xl list-disc">
        <li>Elements of different types produce different trees.</li>
        <li>
          The developer can hint at stable child elements across renders with a
          key prop.
        </li>
      </ol>
    </div>
  );
}

function SubSlide3() {
  return (
    <div className="flex flex-col gap-8">
      <SlideSubheading className="text-4xl font-medium">
        2.2 Diffing Algorithm
      </SlideSubheading>
      <div className="flex flex-col gap-6 w-full">
        <SlideSubheading className="text-2xl">
          Element with different type
        </SlideSubheading>
        <div className="flex gap-10">
          <FlowChart
            className="flex-1"
            nodes={{
              app: <Rect size="sm">{"<App>"}</Rect>,
              ul: (
                <Rect color="yellow" size="sm">
                  {"<ul>"}
                </Rect>
              ),
              li1: <Rect size="sm" children="<li/>" />,
              li2: <Rect size="sm" children="<li/>" />,
            }}
            connections={[
              ["ul", "li1", "bottom_to_left"],
              ["ul", "li2", "bottom_to_left"],
              ["app", "ul", "bottom_to_left"],
            ]}
            children={(nodes) => (
              <div className="flex flex-col gap-4">
                <div>Old tree</div>
                <div className="grid grid-cols-2 gap-4 gap-x-2 w-max">
                  <div className="col-span-1 row-span-1">{nodes.app}</div>
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

          <FlowChart
            className="flex-1"
            nodes={{
              app: <Rect size="sm">{"<App>"}</Rect>,
              div: (
                <Rect size="sm" color="yellow">
                  {"<div>"}
                </Rect>
              ),
              li1: <Rect size="sm" children="<li/>" />,
              li2: <Rect size="sm" children="<li/>" />,
            }}
            connections={[
              ["div", "li1", "bottom_to_left"],
              ["div", "li2", "bottom_to_left"],
              ["app", "div", "bottom_to_left"],
            ]}
            children={(nodes) => (
              <div className="flex flex-col gap-4">
                <div>New tree</div>
                <div className="grid grid-cols-2 gap-4 gap-x-2 w-max">
                  <div className="col-span-1 row-span-1">{nodes.app}</div>
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

          <FlowChart
            className="flex-1"
            nodes={{
              app: <Rect size="sm">{"<App>"}</Rect>,
              ul: (
                <Rect color="red" size="sm">
                  {"<ul>"}
                </Rect>
              ),
              li1: <Rect color="red" size="sm" children="<li/>" />,
              li2: <Rect color="red" size="sm" children="<li/>" />,
              div: (
                <Rect color="green" size="sm">
                  {"<div>"}
                </Rect>
              ),
              new_li1: <Rect color="green" size="sm" children="<li/>" />,
              new_li2: <Rect color="green" size="sm" children="<li/>" />,
            }}
            connections={[
              ["ul", "li1", "bottom_to_left"],
              ["ul", "li2", "bottom_to_left"],
              ["app", "div", "bottom_to_left"],
              ["div", "new_li1", "bottom_to_left"],
              ["div", "new_li2", "bottom_to_left"],
            ]}
            children={(nodes) => (
              <div className="flex flex-col gap-4">
                <div>Result</div>
                <div className="grid grid-cols-2 gap-4 gap-x-2 w-max">
                  <div className="col-span-1 row-span-1">{nodes.app}</div>
                  <div className="col-start-2 row-start-2 col-span-1 row-span-1">
                    {nodes.ul}
                  </div>
                  <div className="row-start-3 col-start-3 col-span-1 row-span-1 flex flex-col gap-2">
                    {nodes.li1}
                    {nodes.li2}
                  </div>
                  <div className="col-start-2 row-start-4 col-span-1 row-span-1">
                    {nodes.div}
                  </div>
                  <div className="row-start-5 col-start-3 col-span-1 row-span-1 flex flex-col gap-2">
                    {nodes.new_li1}
                    {nodes.new_li2}
                  </div>
                </div>
              </div>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Rect size="sm" color="yellow">
            Changed
          </Rect>
          <Rect size="sm" color="green">
            Mounted
          </Rect>
          <Rect size="sm" color="red">
            Unmounted
          </Rect>
        </div>
      </div>
    </div>
  );
}
