import { cn, isOsMac, sleep } from "@/lib/utils";
import {
  Children,
  ComponentProps,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Button } from "./ui/button";
import {
  AnimatePresence,
  AnimationControls,
  motion,
  useAnimationControls,
  Variant,
} from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";

const SLIDE_DISPLAY_NAME = "Slide" as const;

interface DeckProps extends ComponentProps<"div"> {
  basePath?: string;
}

function Deck({
  children,
  className,
  basePath = "/",
  ...props
}: Readonly<DeckProps>) {
  const location = useLocation();
  const navigate = useNavigate();

  const slides = useGetSlidesFromChildren(children);
  const slideIndex = getSlideIndex(location.pathname);
  const [getDirection, setDirection] = useDirection();
  const [getDeckSteps] = useDeckSteps(slides.length);

  const disableNext = useRef(false);
  const disablePrev = useRef(false);
  const getDisableNext = () => disableNext.current;
  const getDisablePrev = () => disablePrev.current;
  const setDisableNext = (value: boolean) => (disableNext.current = value);
  const setDisablePrev = (value: boolean) => (disablePrev.current = value);

  useHotkeys(
    "right",
    () => {
      setDirection(1);

      const deckSteps = getDeckSteps();
      const currentStep = deckSteps.getCurrentStep(slideIndex);

      if (currentStep) {
        deckSteps.showCurrentStep(slideIndex);
        return;
      }
      deckSteps.resetSlideSteps(slideIndex);
      const disableNext = getDisableNext();
      if (slideIndex === slides.length - 1 || disableNext) return;
      navigate(`/${slideIndex + 1}`);
    },
    [slideIndex, slides.length],
  );

  useHotkeys(
    isOsMac() ? "meta+shift+right" : "ctrl+shift+right",
    () => {
      setDirection(1);
      const deckSteps = getDeckSteps();
      deckSteps.resetSlideSteps(slideIndex);
      if (slideIndex === slides.length - 1) return;
      navigate(`/${slideIndex + 1}`);
    },
    [slideIndex, slides.length],
  );

  useHotkeys(
    isOsMac() ? "meta+right" : "ctrl+right",
    () => {
      const deckSteps = getDeckSteps();
      deckSteps.runAllSteps(slideIndex, 100);
    },
    [slideIndex, slides.length],
  );

  useHotkeys(
    "left",
    () => {
      setDirection(-1);
      setDisableNext(false);
      const deckSteps = getDeckSteps();
      deckSteps.resetSlideSteps(slideIndex);

      if (slideIndex === 0) return;

      if (slideIndex === 1) {
        navigate("/");
        return;
      }

      const disablePrev = getDisablePrev();

      if (disablePrev) return;

      navigate(`/${slideIndex - 1}`);
    },
    [slideIndex, slides.length],
  );

  return (
    <DeckContext.Provider
      value={{
        slideIndex,
        direction: getDirection(),
        deckSteps: getDeckSteps(),
        setDisableNext,
        setDisablePrev,
        getDisableNext,
        getDisablePrev,
      }}
    >
      <div
        className="w-screen font-light relative h-screen overflow-hidden font-sans dark bg-background text-foreground"
        {...props}
      >
        <AnimatePresence custom={getDirection()}>
          <Routes location={location} key={slideIndex}>
            {slides.map((slide, index) => (
              <Route
                key={index}
                path={`${index === 0 ? "/" : index}`}
                element={slide}
              />
            ))}
            <Route
              path="*"
              element={
                <div className="flex justify-center flex-col gap-10 items-center h-full">
                  <h1 className="text-center text-6xl font-medium">
                    404 Slide not found
                  </h1>

                  <Button>
                    <Link to="/">Go to Home Slide</Link>
                  </Button>
                </div>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </DeckContext.Provider>
  );
}

interface _Step {
  id: string;
  show: () => void;
  onNext?: () => void;
  order: number;
}

export function createStep(id: string, show: () => void, order?: number) {
  return {
    id,
    show,
    order: order ?? 0,
  };
}

class SlideSteps {
  private currentIndex = 0;
  private steps: _Step[] = [];

  hasNext() {
    return this.currentIndex <= this.steps.length - 1;
  }

  hasPrev() {
    return this.currentIndex > 0;
  }

  insertStep(step: _Step) {
    if (this.steps.find((s) => s.id === step.id)) return;
    this.steps.push(step);
    this.steps.sort((a, b) => a.order - b.order);
  }

  getCurrentStep(): _Step | undefined {
    return this.steps[this.currentIndex];
  }

  getPreviousStep(): _Step | undefined {
    return this.steps[this.currentIndex - 1];
  }

  getStepById(id: string) {
    return this.steps.find((step) => step.id === id);
  }

  setCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  incrementCurrentIndex() {
    this.currentIndex++;
  }

  reset() {
    this.currentIndex = 0;
    this.steps = [];
  }

  get length() {
    return this.steps.length;
  }
}

interface StepWithPartialOrder {
  id: string;
  show: () => void;
  onNext?: () => void;
  order?: number;
}

class DeckSteps {
  private slides: Map<number, SlideSteps> = new Map();

  constructor(slidesLength: number) {
    for (let i = 0; i < slidesLength; i++) {
      this.slides.set(i, new SlideSteps());
    }
  }

  addStep(slideIndex: number, step: StepWithPartialOrder) {
    const slideSteps = this.slides.get(slideIndex);

    if (!slideSteps) throw new Error(`Slide ${slideIndex} does not exist`);

    slideSteps.insertStep({
      ...step,
      order: step.order ?? 0,
    });
  }

  getSlideSteps(slideIndex: number) {
    const slideSteps = this.slides.get(slideIndex);

    if (!slideSteps) {
      throw new Error(`Slide ${slideIndex} does not exist`);
    }

    return slideSteps;
  }

  getCurrentStep(slideIndex: number) {
    const slideSteps = this.getSlideSteps(slideIndex);
    return slideSteps.getCurrentStep();
  }

  showCurrentStep(slideIndex: number) {
    const slideSteps = this.getSlideSteps(slideIndex);
    const currentStep = slideSteps.getCurrentStep();
    const prevStep = slideSteps.getPreviousStep();

    if (!currentStep) return;

    prevStep?.onNext?.();

    currentStep.show();

    slideSteps.incrementCurrentIndex();
  }

  getPrevStep(slideIndex: number) {
    const slideSteps = this.getSlideSteps(slideIndex);
    return slideSteps.getPreviousStep();
  }

  resetSlideSteps(slideIndex: number) {
    const slideSteps = this.getSlideSteps(slideIndex);
    slideSteps.reset();
  }

  async runAllSteps(slideIndex: number, interval = 500) {
    const slideSteps = this.getSlideSteps(slideIndex);

    while (slideSteps.hasNext()) {
      this.showCurrentStep(slideIndex);
      await sleep(interval);
    }
  }
}

interface DeckContext {
  slideIndex: number;
  direction: Direction;
  deckSteps: DeckSteps;
  setDisableNext: (value: boolean) => void;
  setDisablePrev: (value: boolean) => void;
  getDisableNext: () => boolean;
  getDisablePrev: () => boolean;
}

const DeckContext = createContext<DeckContext | null>(null);

export function useDeck() {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error("useDeckContext must be used within a Deck");
  }
  return context;
}

function getSlideIndex(pathname: string): number {
  const numberRegex = /^\d+$/;
  const pathSegments = pathname.split("/");
  const pathLength = pathSegments.length;

  if (pathLength > 2 || pathSegments[1] === "") {
    return 0;
  }

  const indexPath = pathSegments[1];
  const parsedIndex = parseInt(indexPath);

  return isNaN(parsedIndex) || !numberRegex.test(indexPath) ? 0 : parsedIndex;
}

function getSlidesFromChildren(children: any) {
  return Children.toArray(children).filter((child) => isSlideElement(child));
}

type Direction = -1 | 0 | 1;

const useDirection = () => {
  const ref = useRef<Direction>(0);
  const getDirection = () => ref.current;
  const setDirection = (direction: Direction) => {
    ref.current = direction;
  };

  return [getDirection, setDirection] as const;
};

const useDeckSteps = (slidesLength: number) => {
  const ref = useRef<DeckSteps | null>(null);
  const getDeckSteps = useCallback(() => {
    if (ref.current) {
      return ref.current;
    }

    const slideSteps = new DeckSteps(slidesLength);
    ref.current = slideSteps;
    return slideSteps;
  }, [slidesLength]);

  return [getDeckSteps] as const;
};

function useGetSlidesFromChildren(children: any) {
  return useMemo(() => getSlidesFromChildren(children), [children]);
}

const variants = {
  initial: (direction: number) => ({
    x: direction > 0 ? "100%" : direction < 0 ? "-100%" : "0%",
  }),
  show: { x: "0%" },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : direction < 0 ? "100%" : "0%",
  }),
};

interface SlideProps extends ComponentProps<typeof motion.div> {
  element?: ReactNode;
}

function Slide({
  children,
  element,
  className,
  ...props
}: Readonly<SlideProps>) {
  const { direction: slideTransition } = useDeck();

  return (
    <motion.div
      className={cn(
        "h-screen absolute inset-0 w-screen p-20 pt-32 overflow-hidden",
        className,
      )}
      custom={slideTransition}
      variants={variants}
      exit="exit"
      initial="initial"
      animate="show"
      transition={{ duration: 1, ease: "easeInOut" }}
      {...props}
    >
      {element ?? children}
    </motion.div>
  );
}

function isSlideElement(val: any): val is React.ReactElement {
  return (
    typeof val === "object" &&
    val != null &&
    "type" in val &&
    val.type.displayName === SLIDE_DISPLAY_NAME
  );
}

Slide.displayName = SLIDE_DISPLAY_NAME;

const stepVariants = {
  initial: { height: 0, opacity: 0 },
  show: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

type StepVariants = {
  initial: Variant;
  show: Variant;
};

interface StepProps extends ComponentProps<typeof motion.div> {
  variants?: StepVariants;
  order?: number;
  onNext?: (controls: AnimationControls) => void;
}

function Step({ variants, order, onNext, ...props }: Readonly<StepProps>) {
  const controls = useAnimationControls();

  const id = useId();

  const { deckSteps, slideIndex } = useDeck();

  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    deckSteps.addStep(slideIndex, {
      id,
      show: () => {
        controls.start("show");
      },
      onNext: () => {
        if (onNext) {
          onNext(controls);
        }
      },
      order: order ?? deckSteps.getSlideSteps(slideIndex).length,
    });

    return () => {
      controls.stop();
    };
  }, []);

  return (
    <motion.div
      variants={variants || stepVariants}
      initial="initial"
      animate={controls}
      {...props}
    />
  );
}

function DeckWithRouter(props: DeckProps) {
  return (
    <BrowserRouter basename={props.basePath ?? "/"}>
      <Deck {...props} />
    </BrowserRouter>
  );
}

export { DeckWithRouter as Deck, Slide, Step };
