import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

const Context = createContext<{
  direction: number;
  currentSlide: number;
  addStep: (step: StepFn, order?: number) => void;
} | null>(null);

export function usePresentation() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("usePresentation must be used within a Presentation");
  }
  return context;
}

export const StepCache = new Map<string, string>();

export function getStepId(slideIndex: number, index: number) {
  return `step-${slideIndex}-${index}`;
}

export function useAddStep(step: StepFn, order?: number) {
  const { addStep } = usePresentation();

  const isInitRef = useRef(false);

  useEffect(() => {
    if (!isInitRef.current) {
      addStep(step, order);
      isInitRef.current = true;
      return;
    }
  }, []);
}

type StepFn = () => Promise<void | (() => Promise<void>)>;

function getSlidesFromChildren(children: React.ReactNode[]) {
  return children
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
}

const numberRegex = /^\d+$/;

function getSlideIndex(pathname: string): number {
  const pathSegments = pathname.split("/");
  const pathLength = pathSegments.length;

  if (pathLength > 2 || pathSegments[1] === "") {
    return 0;
  }

  const indexPath = pathSegments[1];
  const parsedIndex = parseInt(indexPath);

  return isNaN(parsedIndex) || !numberRegex.test(indexPath) ? 0 : parsedIndex;
}

export default function Presentation({
  children,
}: Readonly<{
  children: React.ReactNode[];
}>) {
  const navigate = useNavigate();
  const location = useLocation();

  const [direction, setDirection] = useState(0);
  const [steps, setSteps] = useState<StepFn[]>([]);
  const [prevStepCb, setPrevStepCb] = useState<() => Promise<void>>();

  const slideIndex = getSlideIndex(location.pathname);
  const slides = getSlidesFromChildren(children);
  const slideLength = slides.length;
  const progress = (slideIndex / (slideLength - 1)) * 100;

  const handleSteps = async () => {
    const newSteps = [...steps];
    const step = newSteps.shift() as StepFn;
    const promises = [step()];
    if (prevStepCb) promises.push(prevStepCb());
    const [stepResult] = await Promise.all(promises);
    if (stepResult) {
      setPrevStepCb(() => stepResult);
    }
    setSteps(newSteps);
  };

  const slideToNext = async () => {
    if (slideIndex === slideLength - 1) return;
    if (steps.length > 0) {
      await handleSteps();
      return;
    }
    setPrevStepCb(undefined);
    setSteps([]);
    setDirection(1);
    navigate(`/${slideIndex + 1}`);
  };

  const slideToPrev = async () => {
    if (slideIndex === 0) return;
    setPrevStepCb(undefined);
    setSteps([]);
    setDirection(-1);
    if (slideIndex === 1) navigate("/");
    else navigate(`/${slideIndex - 1}`);
  };

  const addStep = (step: StepFn, order?: number) => {
    let currentOrder = order || steps.length - 1;

    if (currentOrder < 0) currentOrder = 0;

    setSteps((steps) => [
      ...steps.slice(0, currentOrder),
      step,
      ...steps.slice(currentOrder),
    ]);
  };

  useEffect(() => {
    const nextKey = "ArrowRight";
    const prevKey = "ArrowLeft";
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === nextKey) slideToNext();
      if (event.key === prevKey) slideToPrev();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [slideIndex, slideLength, steps, prevStepCb]);

  return (
    <Context.Provider
      value={{
        direction,
        currentSlide: slideIndex,
        addStep,
      }}
    >
      <div className="w-screen font-light relative h-screen overflow-hidden font-sans dark bg-background text-foreground">
        <AnimatePresence custom={direction}>
          <Routes location={location} key={slideIndex}>
            {slides.map((child, index) => (
              <Route
                key={index}
                path={`${index === 0 ? "/" : index}`}
                element={child}
              />
            ))}
            <Route
              path="*"
              element={
                <div className="flex justify-center items-center h-full">
                  <h1 className="text-center text-6xl font-medium">
                    404 Slide not found
                  </h1>
                </div>
              }
            />
          </Routes>
        </AnimatePresence>
        <div></div>

        <div className="absolute bottom-0 left-0 right-0 h-1">
          <motion.div
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="h-1 absolute left-0  bg-orange-500"
          ></motion.div>
        </div>
      </div>
    </Context.Provider>
  );
}
