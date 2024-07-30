import { motion as m, useAnimationControls, Variant } from "framer-motion";
import { usePresentation } from "./presentation";
import { useEffect, useId, useMemo, useRef } from "react";

const defaultVariants = {
  initial: { opacity: 0 },
  show: { opacity: 1 },
};

type Variants = {
  initial: Variant;
  show: Variant;
};

const StepCache = new Map<string, string>();

export default function Step({
  children,
  className,
  index,
  variants,
  ...props
}: Readonly<
  {
    children: React.ReactNode;
    index: number;
    variants?: Variants;
  } & React.ComponentProps<typeof m.div>
>) {
  const controls = useAnimationControls();

  const { addStep, currentSlide } = usePresentation();

  const id = `step-${currentSlide}-${index}`;

  const step = useMemo(() => {
    return StepCache.get(id);
  }, [id]);

  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;

    const step = StepCache.get(id);

    if (step === "animated") return;

    const show = async () => {
      await controls.start("show");
      StepCache.set(id, "animated");
    };

    addStep(show);

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
