import {
  AnimationControls,
  motion as m,
  useAnimationControls,
  Variant,
} from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { getStepId, StepCache, usePresentation } from "./presentation";

const defaultVariants = {
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

type Variants = {
  initial: Variant;
  show: Variant;
};

export default function Step({
  children,
  className,
  index,
  variants,
  onNext,
  ...props
}: Readonly<
  {
    children: React.ReactNode;
    index: number;
    variants?: Variants;
    onNext?: (controls: AnimationControls) => Promise<void>;
  } & React.ComponentProps<typeof m.div>
>) {
  const controls = useAnimationControls();

  const { addStep, currentSlide } = usePresentation();

  const id = getStepId(currentSlide, index);

  const step = useMemo(() => {
    return StepCache.get(id);
  }, [id]);

  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;

    const step = StepCache.get(id);

    if (step === "animated") return;

    const handleNext = async () => {
      await onNext?.(controls);
    };

    const show = async () => {
      await controls.start("show");
      StepCache.set(id, "animated");

      if (onNext) {
        return handleNext;
      }

      return undefined;
    };

    addStep(show, index);

    return () => {
      controls.stop();
      initRef.current = true;
    };
  }, []);

  const initial = step || "initial";

  return (
    <m.div
      initial={initial}
      animate={controls}
      variants={variants || defaultVariants}
      className={className}
      {...props}
    >
      {children}
    </m.div>
  );
}
