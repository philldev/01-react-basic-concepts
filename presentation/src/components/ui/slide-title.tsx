import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface SlideTitleProps extends React.ComponentProps<"h1"> {
  asChild?: boolean;
}

export function SlideTitle({
  asChild = false,
  className,
  ...props
}: SlideTitleProps) {
  const Comp = asChild ? Slot : "h1";
  return (
    <Comp
      className={cn(
        "text-8xl font-medium underline underline-offset-4",
        className,
      )}
      {...props}
    />
  );
}
