import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Component, ComponentProps } from "react";

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

const gridItemRowSpan = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
  5: "row-span-5",
  6: "row-span-6",
  7: "row-span-7",
  8: "row-span-8",
  9: "row-span-9",
  10: "row-span-10",
  11: "row-span-11",
  12: "row-span-12",
  13: "row-span-13",
};

const gridItemColSpan = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
  13: "col-span-13",
};

export interface GridItemProps extends ComponentProps<typeof motion.div> {
  col?: keyof typeof gridItemColumn;
  row?: keyof typeof gridItemRow;
  colSpan?: keyof typeof gridItemColSpan;
  rowSpan?: keyof typeof gridItemRowSpan;
}

export function GridItem({
  className,
  col = 1,
  row = 1,
  colSpan = 1,
  rowSpan = 1,
  ...props
}: GridItemProps) {
  const colStart = gridItemColumn[col];
  const rowStart = gridItemRow[row];
  const colSpanStart = gridItemColSpan[colSpan];
  const rowSpanStart = gridItemRowSpan[rowSpan];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "max-w-[40px] w-full overflow-visible",
        className,
        colStart,
        rowStart,
        colSpanStart,
        rowSpanStart,
      )}
      {...props}
    />
  );
}
