import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Rect } from "../flow-chart";

export interface GridProps extends ComponentProps<"div"> {}

export function Grid({ className, ...props }: GridProps) {
  return <div className={cn("grid", className)} {...props} />;
}

const gridItemColumn = {
  1: "col-start-1",
  2: "col-start-2",
  3: "col-start-3",
  4: "col-start-4",
  5: "col-start-5",
  6: "col-start-6",
  7: "col-start-7",
  8: "col-start-8",
  9: "col-start-9",
  10: "col-start-10",
  11: "col-start-11",
  12: "col-start-12",
  13: "col-start-13",
};

const gridItemRow = {
  1: "row-start-1",
  2: "row-start-2",
  3: "row-start-3",
  4: "row-start-4",
  5: "row-start-5",
  6: "row-start-6",
  7: "row-start-7",
  8: "row-start-8",
  9: "row-start-9",
  10: "row-start-10",
  11: "row-start-11",
  12: "row-start-12",
  13: "row-start-13",
};

export interface GridItemProps extends ComponentProps<"div"> {
  col?: keyof typeof gridItemColumn;
  row?: keyof typeof gridItemRow;
}

export function GridItem({
  className,
  col = 1,
  row = 1,
  ...props
}: GridItemProps) {
  const colStart = gridItemColumn[col];
  const rowStart = gridItemRow[row];

  return <div className={cn(className, colStart, rowStart)} {...props} />;
}
