import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { motion as m } from "framer-motion";
import { usePresentation } from "./presentation";

const variants = {
  initial: (direction: number) => ({
    x: direction > 0 ? "100%" : direction < 0 ? "-100%" : "0%",
  }),
  show: { x: "0%" },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : direction < 0 ? "100%" : "0%",
  }),
};

export default function Slide({
  children,
  className,
  index = 0,
  ...props
}: Readonly<
  { children: React.ReactNode; index?: number } & ComponentProps<typeof m.div>
>) {
  const { direction } = usePresentation();

  return (
    <m.div
      className={cn(
        "h-screen absolute inset-0 w-screen p-20 overflow-hidden",
        className,
      )}
      custom={direction}
      variants={variants}
      exit="exit"
      initial="initial"
      animate="show"
      transition={{ duration: 1, ease: "easeInOut" }}
      {...props}
    >
      {children}
    </m.div>
  );
}
