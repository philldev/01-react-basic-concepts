import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export default function BrowserUI({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("border border-border w-max p-4 rounded-lg", className)}
      {...props}
    >
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
      </div>
      <div className="min-w-[300px] h-full pt-4">{children}</div>
    </div>
  );
}
