import BrowserUI from "@/components/browser-ui";
import { FlowChart } from "@/components/flow-chart";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function ReactState() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let interval = setInterval(() => {
      setDark((prev) => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center flex-col h-full">
      <h1 className="w-full text-8xl font-medium mb-8">State</h1>
      <p className="text-3xl leading-relaxed mb-10 text-foreground/75">
        State is a variable that hold some information and <br /> may change
        over the lifetime of a component.
      </p>
      <FlowChart
        connections={[
          {
            start: "1",
            end: "2",
            startPosition: "right",
            endPosition: "left",
          },
          {
            start: "2",
            end: "3",
            startPosition: "right",
            endPosition: "left",
          },
        ]}
        className="flex text-2xl justify-between w-full items-start gap-40 max-h-[500px]"
      >
        <div
          id="1"
          className="border border-border p-6 rounded-lg min-w-[300px]"
        >
          <pre>theme = {dark ? '"dark"' : '"light"'}</pre>
        </div>
        <div id="2" className="border border-border p-6 rounded-lg">
          Rerenders
        </div>
        <BrowserUI
          id="3"
          className={cn(
            "flex-1 data-[dark]:bg-black bg-white h-[200px] transition-colors duration-1000",
            dark ? "text-white bg-black" : "text-black bg-white",
          )}
        >
          <h1 className="text-6xl">Hello world!</h1>
        </BrowserUI>
      </FlowChart>
    </div>
  );
}
