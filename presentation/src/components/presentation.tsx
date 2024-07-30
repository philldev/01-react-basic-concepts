import { createContext, useContext, useEffect, useId, useState } from "react";
import Slide from "./slide";
import { AnimatePresence } from "framer-motion";

const Context = createContext<{
  direction: number;
  currentSlide: number;
  addStep: (step: StepFn) => void;
} | null>(null);

export function usePresentation() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("usePresentation must be used within a Presentation");
  }
  return context;
}

type StepFn = () => Promise<void>;

export default function Presentation({
  children,
}: Readonly<{
  children: React.ReactNode[];
}>) {
  const [[slide, direction], setSlide] = useState([0, 0]);
  const [steps, setSteps] = useState<StepFn[]>([]);

  const filteredChildren = children
    .filter((child: any) => child.type.name === "Slide")
    .map((child: any, index) => {
      return {
        ...child,
        props: {
          ...child.props,
          index,
        },
        key: index,
      };
    });

  const slideLength = filteredChildren.length;

  useEffect(() => {
    const nextKey = "ArrowRight";
    const prevKey = "ArrowLeft";

    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === nextKey) {
        if (steps.length > 0) {
          const newSteps = [...steps];
          const step = newSteps.shift();
          await step?.();
          setSteps(newSteps);
          return;
        }

        if (slide < slideLength - 1) {
          setSteps([]);
          setSlide(([slide]) => [slide + 1, 1] as [number, number]);
        }
      }
      if (event.key === prevKey) {
        if (slide > 0) {
          setSteps([]);
          setSlide(([slide]) => [slide - 1, -1] as [number, number]);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [slide, slideLength, steps]);

  return (
    <Context.Provider
      value={{
        direction,
        currentSlide: slide,
        addStep: (step) => setSteps((steps) => [...steps, step]),
      }}
    >
      <div className="w-screen font-thin relative h-screen overflow-hidden font-mono dark bg-background text-foreground">
        <AnimatePresence custom={direction}>
          {filteredChildren[slide]}
        </AnimatePresence>
      </div>
    </Context.Provider>
  );
}
