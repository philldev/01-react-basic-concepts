import { cn } from "@/lib/utils";
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
  motion,
  useAnimationControls,
  Variant,
} from "framer-motion";

const SLIDE_DISPLAY_NAME = "Slide" as const;
const NEXT_KEY = "ArrowRight";
const PREV_KEY = "ArrowLeft";

interface _Step {
  id: string;
  show: () => void;
  order: number;
}

class SlideSteps {
  private currentIndex: number = 0;
  private steps: _Step[] = [];

  insertStep(step: _Step) {
    this.steps.push(step);
    this.steps.sort((a, b) => a.order - b.order);
    console.log(this.steps);
  }

  getCurrentStep() {
    return this.steps[this.currentIndex];
  }

  getStep(index: number) {
    return this.steps[index];
  }

  getStepById(id: string) {
    return this.steps.find((step) => step.id === id);
  }

  setCurrentIndex(index: number) {
    this.currentIndex = index;
  }

  getCurrentIndex() {
    return this.currentIndex;
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
    if (!slideSteps) {
      throw new Error(`Slide ${slideIndex} does not exist`);
    }
    if (slideSteps.getStepById(step.id)) {
      return;
    }

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

type Direction = -1 | 0 | 1;

interface DeckContext {
  slideIndex: number;
  direction: Direction;
  deckSteps: DeckSteps;
}

const DeckContext = createContext<DeckContext | null>(null);

export function useDeck() {
  const context = useContext(DeckContext);
  if (!context) {
    throw new Error("useDeckContext must be used within a Deck");
  }
  return context;
}

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

  const [direction, setDirection] = useState<Direction>(0);

  const slideIndex = getSlideIndex(location.pathname);

  const slides = useMemo(
    () => Children.toArray(children).filter((child) => isSlideElement(child)),
    [children],
  );

  const DeckStepsRef = useRef<DeckSteps | null>(null);

  const getDeckSteps = useCallback(() => {
    if (DeckStepsRef.current) {
      return DeckStepsRef.current;
    }

    const slideSteps = new DeckSteps(slides.length);
    DeckStepsRef.current = slideSteps;
    return slideSteps;
  }, [slides]);

  const gotoNext = () => {
    setDirection(1);
    const deckSteps = getDeckSteps();
    const slideSteps = deckSteps.getSlideSteps(slideIndex);

    if (
      slideSteps.length > 0 &&
      slideSteps.getCurrentIndex() < slideSteps.length
    ) {
      slideSteps.getCurrentStep().show();
      slideSteps.setCurrentIndex(slideSteps.getCurrentIndex() + 1);
      return;
    }

    if (slideIndex === slides.length - 1) return;

    slideSteps.reset();
    navigate(`/${slideIndex + 1}`);
  };

  const gotoPrev = () => {
    setDirection(-1);
    const deckSteps = getDeckSteps();
    const slideSteps = deckSteps.getSlideSteps(slideIndex);
    slideSteps.reset();

    if (slideIndex === 0) return;
    if (slideIndex === 1) {
      navigate("/");
      return;
    }
    navigate(`/${slideIndex - 1}`);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === NEXT_KEY) gotoNext();
      if (event.key === PREV_KEY) gotoPrev();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [slideIndex, slides.length]);

  return (
    <DeckContext.Provider
      value={{ slideIndex, direction: direction, deckSteps: getDeckSteps() }}
    >
      <div
        className="w-screen font-light relative h-screen overflow-hidden font-sans dark bg-background text-foreground"
        {...props}
      >
        <AnimatePresence custom={direction}>
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
        "h-screen absolute inset-0 w-screen p-20 overflow-hidden",
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
  asChild?: boolean;
  variants?: StepVariants;
  order?: number;
}

function Step({ variants, ...props }: Readonly<StepProps>) {
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
      order: props.order ?? deckSteps.getSlideSteps(slideIndex).length,
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
