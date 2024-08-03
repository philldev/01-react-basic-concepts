import { cn } from "@/lib/utils";
import { InnerToken, Pre } from "codehike/code";
import { ComponentProps } from "react";
import { AnnotationHandler, InnerLine } from "codehike/code";
import { tokenTransitions } from "./token-transitions";
import { motion } from "framer-motion";

export const lineNumbersAn: AnnotationHandler = {
  name: "line-numbers",
  Line: (props) => {
    const width = props.totalLines.toString().length + 1;
    return (
      <div className="flex items-center gap-6">
        <span
          className="opacity-50 text-right"
          style={{ minWidth: `${width}ch` }}
        >
          {props.lineNumber}
        </span>
        <InnerLine merge={props} />
      </div>
    );
  },
};

export const focus: AnnotationHandler = {
  name: "focus",
  onlyIfAnnotated: true,
  Token: (props) => (
    <InnerToken
      merge={props}
      className="opacity-50 data-[focus]:opacity-100 transition-opacity duration-300"
    />
  ),
  AnnotatedToken: ({ annotation, ...props }) => (
    <InnerToken merge={props} data-focus={true} />
  ),
};

export function Code(
  props: ComponentProps<typeof Pre> & {
    containerProps?: ComponentProps<typeof motion.div>;
    lineNumbers?: boolean;
    styled?: boolean;
  },
) {
  const {
    containerProps,
    code,
    styled = true,
    lineNumbers = true,
    ...restProps
  } = props;
  const { className, ...restContainerProps } = containerProps || {};

  const handlers = [focus, tokenTransitions];

  if (lineNumbers) {
    handlers.push(lineNumbersAn);
  }

  return (
    <motion.div
      className={cn(
        "w-max",
        styled && "rounded-md border-border p-4 border",
        lineNumbers && "pl-2",
        className,
      )}
      {...restContainerProps}
    >
      <Pre code={code} handlers={handlers} {...restProps} />
    </motion.div>
  );
}

interface Range {
  lineNumber: number;
  fromColumn: number;
  toColumn: number;
}

export function findRange(code: string, searchString: string): Range | null {
  const lines = code.split("\n");

  for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
    const line = lines[lineNumber];
    const startColumn = line.indexOf(searchString);

    if (startColumn !== -1) {
      const endColumn = startColumn + searchString.length;
      return {
        lineNumber: lineNumber + 1, // Line numbers are typically 1-based
        fromColumn: startColumn + 1, // Column numbers are typically 1-based
        toColumn: endColumn,
      };
    }
  }

  return null;
}
