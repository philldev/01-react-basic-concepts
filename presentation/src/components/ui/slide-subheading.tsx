import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface SlideSubheadingProps extends React.ComponentProps<"h2"> {
  asChild?: boolean;
}

export function SlideSubheading({
  asChild = false,
  className,
  ...props
}: SlideSubheadingProps) {
  const Comp = asChild ? Slot : "h2";
  return <Comp className={cn("text-4xl font-medium", className)} {...props} />;
}
