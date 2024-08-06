import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface SlideTextProps extends React.ComponentProps<"p"> {
  asChild?: boolean;
}

export function SlideText({
  asChild = false,
  className,
  ...props
}: SlideTextProps) {
  const Comp = asChild ? Slot : "p";
  return (
    <Comp
      className={cn("text-2xl leading-relaxed text-foreground/80", className)}
      {...props}
    />
  );
}
