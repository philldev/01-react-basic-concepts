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

export default function Presentation({
  children,
}: Readonly<{
  children: React.ReactNode[];
}>) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [direction, setDirection] = useState(0);
  const [steps, setSteps] = useState<StepFn[]>([]);
  const indexPath = pathname.split("/")[1];
  const slide = indexPath === "" ? 0 : parseInt(indexPath);

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

  const [prevStepCb, setPrevStepCb] = useState<() => Promise<void>>();

  useEffect(() => {
    const nextKey = "ArrowRight";
    const prevKey = "ArrowLeft";

    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.key === nextKey) {
        if (steps.length > 0) {
          const newSteps = [...steps];
          const step = newSteps.shift() as StepFn;

          const promises = [];

          promises.push(step());

          if (prevStepCb) {
            promises.push(prevStepCb());
          }

          const [stepResult] = await Promise.all(promises);

          if (stepResult) {
            setPrevStepCb(() => stepResult);
          }

          setSteps(newSteps);
          return;
        }

        if (slide < slideLength - 1) {
          setPrevStepCb(undefined);
          setSteps([]);
          setDirection(1);
          navigate(`/${slide + 1}`);
        }
      }
      if (event.key === prevKey) {
        if (slide > 0) {
          setPrevStepCb(undefined);
          setSteps([]);
          setDirection(-1);
          if (slide === 1) navigate("/");
          else navigate(`/${slide - 1}`);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [slide, slideLength, steps]);

  const progress = (slide / (slideLength - 1)) * 100;

  return (
    <Context.Provider
      value={{
        direction,
        currentSlide: slide,
        addStep: (step, order) => {
          let currentOrder = order || steps.length - 1;

          if (currentOrder < 0) currentOrder = 0;

          setSteps((steps) => [
            ...steps.slice(0, currentOrder),
            step,
            ...steps.slice(currentOrder),
          ]);
        },
      }}
    >
      <div className="w-screen font-light relative h-screen overflow-hidden font-sans dark bg-background text-foreground">
        <AnimatePresence custom={direction}>
          <Routes location={location} key={slide}>
            {filteredChildren.map((child, index) => (
              <Route
                key={index}
                path={`${index === 0 ? "/" : index}`}
                element={child}
              />
            ))}
          </Routes>
        </AnimatePresence>
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
