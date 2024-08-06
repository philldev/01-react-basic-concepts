import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface SlideHeadingProps extends React.ComponentProps<"h1"> {
  asChild?: boolean;
}

export function SlideHeading({
  asChild = false,
  className,
  ...props
}: SlideHeadingProps) {
  const Comp = asChild ? Slot : "h1";
  return <Comp className={cn("text-8xl font-medium", className)} {...props} />;
}
