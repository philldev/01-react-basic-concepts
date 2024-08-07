import { cn } from "@/lib/utils";
import { AnnotationHandler, InnerLine, InnerToken, Pre } from "codehike/code";
import { motion } from "framer-motion";
import { ComponentProps } from "react";

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
    ["data-fc-id"]?: string;
  },
) {
  const {
    containerProps,
    code,
    styled = true,
    lineNumbers = true,
    ["data-fc-id"]: flowChartId,
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
        styled && "rounded-md border-border p-4 border bg-blue-900/10",
        lineNumbers && "pl-2",
        className,
      )}
      data-fc-id={flowChartId}
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

import { CustomPreProps, InnerPre, getPreRef } from "codehike/code";
import {
  TokenTransitionsSnapshot,
  calculateTransitions,
  getStartingSnapshot,
} from "codehike/utils/token-transitions";
import React from "react";

const MAX_TRANSITION_DURATION = 2000; // milliseconds

class SmoothPre extends React.Component<CustomPreProps> {
  ref: React.RefObject<HTMLPreElement>;
  constructor(props: CustomPreProps) {
    super(props);
    this.ref = getPreRef(this.props);
  }

  render() {
    return <InnerPre merge={this.props} style={{ position: "relative" }} />;
  }

  getSnapshotBeforeUpdate() {
    return getStartingSnapshot(this.ref.current!);
  }

  componentDidUpdate(_: never, __: never, snapshot: TokenTransitionsSnapshot) {
    const transitions = calculateTransitions(this.ref.current!, snapshot);
    transitions.forEach(({ element, keyframes, options }) => {
      const { translateX, translateY, ...kf } = keyframes as any;
      if (translateX && translateY) {
        kf.translate = [
          `${translateX[0]}px ${translateY[0]}px`,
          `${translateX[1]}px ${translateY[1]}px`,
        ];
      }
      element.animate(kf, {
        duration: options.duration * MAX_TRANSITION_DURATION,
        delay: options.delay * MAX_TRANSITION_DURATION,
        easing: options.easing,
        fill: "both",
      });
    });
  }
}
export const tokenTransitions: AnnotationHandler = {
  name: "token-transitions",
  PreWithRef: SmoothPre,
  Token: (props) => (
    <InnerToken merge={props} style={{ display: "inline-block" }} />
  ),
};
