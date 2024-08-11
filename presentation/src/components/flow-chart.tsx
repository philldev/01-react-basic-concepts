import { PathBuilder } from "@/lib/draw-path";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Easing, motion, useAnimate, useAnimation } from "framer-motion";
import {
  ComponentProps,
  ReactElement,
  ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

export type FlowChartNodes<T = any> = Record<string, ReactElement<T>>;

type ModifiedNodes<T extends FlowChartNodes> = {
  [id in keyof T]: ReactElement<{
    "data-fc-id"?: string;
    "data-grid-col"?: number;
    "data-grid-row"?: number;
  }>;
};

type PosiblePosition = "top" | "bottom" | "left" | "right";

export type FlowChartConnection<T, K> = [
  from: T extends string ? T : never,
  to: K extends string ? K : never,
  connectionType: `${PosiblePosition}_to_${PosiblePosition}`,
];

export type FlowChartConfig = {
  connectionOffset?: {
    start?: "start" | "end" | "center";
    end?: "start" | "end" | "center";
  };
};

export interface FlowChartProps<T extends FlowChartNodes<any>>
  extends Omit<ComponentProps<"div">, "children"> {
  nodes: T;
  connections?: FlowChartConnection<keyof T, keyof T>[];
  children?: (nodes: ModifiedNodes<T>) => ReactNode;
  config?: FlowChartConfig;
  styled?: boolean;
}

export function FlowChart<T extends FlowChartNodes<any>>({
  className,
  children,
  nodes,
  connections = [],
  config,
  ...props
}: FlowChartProps<T>) {
  const flowChartId = useId();

  const newNodes = useMemo(() => {
    const newNodes: FlowChartNodes = {};

    for (const [key, value] of Object.entries(nodes)) {
      newNodes[key] = {
        ...value,
        props: {
          "data-fc-id": `${flowChartId}-${key}`,
          ...value.props,
        },
      };
    }

    return newNodes as ModifiedNodes<T>;
  }, [nodes]);

  const filteredConnections = useMemo(
    () =>
      connections.filter(([from, to]) => from in newNodes && to in newNodes),
    [connections, newNodes],
  );

  const [paths, setPaths] = useState<
    {
      id: string;
      initialPath: string;
      endPath: string;
    }[]
  >([]);

  function generatePaths(
    connections: FlowChartConnection<keyof T, keyof T>[] = [],
  ) {
    const newPaths: {
      id: string;
      initialPath: string;
      endPath: string;
    }[] = [];

    connections.forEach(([from, to, connectionType]) => {
      const fromNode = newNodes[from];
      const toNode = newNodes[to];

      const fromPosition = connectionType.split("_to_")[0];
      const toPosition = connectionType.split("_to_")[1];

      const fromEl = document.querySelector(
        `[data-fc-id="${fromNode.props["data-fc-id"]}"]`,
      ) as HTMLElement;

      const toEl = document.querySelector(
        `[data-fc-id="${toNode.props["data-fc-id"]}"]`,
      ) as HTMLElement;

      if (!fromEl || !toEl) return;

      const { initialPath, endPath } = getConnectionPath(
        fromEl,
        toEl,
        fromPosition as "top" | "bottom" | "left" | "right",
        toPosition as "top" | "bottom" | "left" | "right",
        config?.connectionOffset?.start ?? "center",
        config?.connectionOffset?.end ?? "center",
      );

      newPaths.push({
        id: `${flowChartId}-${from}-${to}`,
        initialPath,
        endPath,
      });
    });

    return newPaths;
  }

  useEffect(() => {
    const resizeObservers: ResizeObserver[] = [];

    function handleResize() {
      setPaths(generatePaths(filteredConnections));
    }

    Object.values(newNodes).forEach((node) => {
      const el = document.querySelector(
        `[data-fc-id="${node.props["data-fc-id"]}"]`,
      );

      if (!el) return;

      const observer = new ResizeObserver(handleResize);
      observer.observe(el);
      resizeObservers.push(observer);
    });

    return () => {
      resizeObservers.forEach((resizeObserver) => resizeObserver.disconnect());
    };
  }, [
    newNodes,
    filteredConnections,
    config?.connectionOffset?.start,
    config?.connectionOffset?.end,
  ]);

  return (
    <div
      className={cn(
        "relative w-max",
        props.styled && "rounded-md border-border p-4 border bg-blue-900/10",
        className,
      )}
      {...props}
    >
      <svg className="inset-0 text-muted-foreground -z-10 absolute w-full h-full">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 z"
              stroke="currentColor"
              fill="currentColor"
            />
          </marker>
        </defs>
        {paths.map((path, index) => (
          <Path
            key={index}
            id={path.id}
            initialPath={path.initialPath}
            endPath={path.endPath}
          />
        ))}
      </svg>
      {children?.(newNodes)}
    </div>
  );
}

const Path = (props: { id: string; initialPath: string; endPath: string }) => {
  const [scope, animate] = useAnimate();

  const handleAnimation = async () => {
    animate(
      scope.current,
      {
        d: props.endPath,
      },
      {
        duration: 1.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    );
  };

  useEffect(() => {
    handleAnimation();
  }, [props.endPath]);

  return (
    <path
      ref={scope}
      markerEnd="url(#arrow)"
      stroke="currentColor"
      d={props.initialPath}
      fill="transparent"
      strokeWidth="2px"
    />
  );
};

const chartBoxCva = cva(
  "border relative overflow-hidden border-tranparent w-max rounded-lg font-mono text-center transition-all duration-500 outline outline-2 outline-transparent",
  {
    variants: {
      type: {
        solid: "bg-opacity-80",
        transparent: "bg-opacity-20",
      },
      color: {
        transparent: "border-gray-500 bg-background text-foreground",
        red: "border-red-500 bg-red-500 text-foreground",
        green: "border-green-500 bg-green-500 text-foreground",
        blue: "border-blue-500 bg-blue-500 text-foreground",
        yellow: "border-yellow-500 bg-yellow-500 text-foreground",
        orange: "border-orange-500 bg-orange-500 text-foreground",
        purple: "border-purple-500 bg-purple-500 text-foreground",
        pink: "border-pink-500 bg-pink-500 text-foreground",
        light: "border-border bg-white bg-opacity-100 text-black",
        white: "border-border bg-white text-black",
        gray: "border-border bg-gray-500 text-white",
      },
      size: {
        xs: "p-1 text-xs min-w-[50px]",
        sm: "p-2 text-sm min-w-[75px]",
        default: "p-3",
        lg: "p-6 text-2xl border-2",
      },
      focus: {
        true: "outline-yellow-500",
      },
    },
    defaultVariants: {
      color: "transparent",
      size: "default",
      type: "transparent",
    },
  },
);

export type RectProps = ComponentProps<typeof motion.div> &
  VariantProps<typeof chartBoxCva>;

export function Rect({
  className,
  color,
  size,
  type,
  focus,
  children,
  ...props
}: ComponentProps<typeof motion.div> & VariantProps<typeof chartBoxCva>) {
  const prevChildren =
    useRef<ComponentProps<typeof motion.div>["children"]>(null);

  useEffect(() => {
    if (!prevChildren.current) {
      prevChildren.current = children;
    }
  }, [children]);

  const [scope, animate] = useAnimate();

  const newSpanRef = useRef<HTMLSpanElement>(null);
  const currentSpanRef = useRef<HTMLSpanElement>(null);

  const [_, rerender] = useState(0);

  async function handleAnimation() {
    const ease = [0.25, 0.1, 0.25, 1] as Easing;
    const duration = 1;

    const opts = {
      duration,
      ease,
    };

    await Promise.all([
      animate(
        newSpanRef.current!,
        {
          y: "0",
        },
        opts,
      ),
      animate(currentSpanRef.current!, { y: "200%" }, opts),
    ]);

    prevChildren.current = children;
    rerender((c) => {
      return c + 1;
    });

    setTimeout(() => {
      newSpanRef.current!.style.setProperty("transform", "translateY(-200%)");
      currentSpanRef.current!.style.setProperty("transform", "translateY(0)");
    }, 0);
  }

  useEffect(() => {
    if (typeof children === "string" && prevChildren.current) {
      if (prevChildren.current !== children) {
        handleAnimation();
      }
    }
  }, [children]);

  return (
    <motion.div
      layout
      ref={scope}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(chartBoxCva({ color, size, className, type, focus }))}
      {...props}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span ref={newSpanRef} animate={{ y: "-200%" }}>
          {children}
        </motion.span>
      </div>
      <motion.span className="flex justify-center w-full" ref={currentSpanRef}>
        {prevChildren.current ?? children}
      </motion.span>
    </motion.div>
  );
}

function getPosition(
  node: HTMLElement,
  position: "top" | "bottom" | "left" | "right",
  offset: "start" | "end" | "center" = "center",
) {
  const getModifier = (offset: "start" | "end" | "center", size: number) => {
    // if (offset === "start") return (size / 100) * 10;
    // if (offset === "end") return size - (size / 100) * 10;
    if (offset === "start") return 12;
    if (offset === "end") return size - 12;

    return size / 2;
  };

  switch (position) {
    case "top":
      return [
        node.offsetLeft + getModifier(offset, node.offsetWidth),
        node.offsetTop,
      ];
    case "bottom":
      return [
        node.offsetLeft + getModifier(offset, node.offsetWidth),
        node.offsetTop + node.offsetHeight,
      ];
    case "left":
      return [
        node.offsetLeft,
        node.offsetTop + getModifier(offset, node.offsetHeight),
      ];
    case "right":
      return [
        node.offsetLeft + node.offsetWidth,
        node.offsetTop + getModifier(offset, node.offsetHeight),
      ];
  }
}

function getConnectionPath(
  startNode?: HTMLElement | null,
  endNode?: HTMLElement | null,
  startPosition: "top" | "bottom" | "left" | "right" = "right",
  endPosition: "top" | "bottom" | "left" | "right" = "left",
  startOffset: "start" | "end" | "center" = "center",
  endOffset: "start" | "end" | "center" = "center",
) {
  if (!startNode || !endNode) return { initialPath: "", endPath: "" };

  let start = getPosition(startNode, startPosition, startOffset);
  let end = getPosition(endNode, endPosition, endOffset);

  const middle = [
    start[0] + (end[0] - start[0]) / 2,
    start[1] + (end[1] - start[1]) / 2,
  ];

  const pathBuilder = new PathBuilder();

  const path = pathBuilder.moveTo(start[0], start[1]);

  if (
    (startPosition === "top" || startPosition === "bottom") &&
    (endPosition === "left" || endPosition === "right")
  ) {
    const XDelta = Math.min(15, Math.abs(start[0] - end[0]) / 2);
    const YDelta = Math.min(15, Math.abs(start[1] - end[1]) / 2);

    if (startPosition === "top") path.lineTo(start[0], end[1] + YDelta);
    else if (startPosition === "bottom") path.lineTo(start[0], end[1] - YDelta);

    if (start[0] < end[0])
      path.quadraticCurveTo(start[0], end[1], start[0] + XDelta, end[1]);
    else if (start[0] > end[0])
      path.quadraticCurveTo(start[0], end[1], start[0] - XDelta, end[1]);
    else path.lineTo(start[0], end[1]);

    path.lineTo(end[0], end[1]);
  }

  if (
    (startPosition === "left" || startPosition === "right") &&
    (endPosition === "bottom" || endPosition === "top")
  ) {
    const XDelta = Math.min(15, Math.abs(start[0] - end[0]) / 2);
    const YDelta = Math.min(15, Math.abs(start[1] - end[1]) / 2);

    if (startPosition === "left") path.lineTo(end[0] + XDelta, start[1]);
    else if (startPosition === "right") path.lineTo(end[0] - XDelta, start[1]);

    if (start[1] > end[1])
      path.quadraticCurveTo(end[0], start[1], end[0], start[1] - YDelta);
    else if (start[1] < end[1])
      path.quadraticCurveTo(end[0], start[1], end[0], start[1] + YDelta);
    else path.lineTo(start[0], end[1]);

    path.lineTo(end[0], end[1]);
  }

  if (
    (startPosition === "right" || startPosition === "left") &&
    (endPosition === "left" || endPosition === "right")
  ) {
    const YDelta = Math.min(15, Math.abs(start[1] - end[1]) / 2);
    const XDelta = Math.min(15, Math.abs(start[0] - end[0]) / 2);

    if (middle[0] > start[0]) path.lineTo(middle[0] - XDelta, start[1]);
    else path.lineTo(middle[0] + XDelta, start[1]);

    if (start[1] > end[1]) {
      path.quadraticCurveTo(middle[0], start[1], middle[0], start[1] - YDelta);
      path.lineTo(middle[0], end[1] + YDelta);
    } else if (start[1] < end[1]) {
      path.quadraticCurveTo(middle[0], start[1], middle[0], start[1] + YDelta);
      path.lineTo(middle[0], end[1] - YDelta);
    }

    if (middle[0] > start[0])
      path.quadraticCurveTo(middle[0], end[1], middle[0] + XDelta, end[1]);
    else path.quadraticCurveTo(middle[0], end[1], middle[0] - XDelta, end[1]);

    path.lineTo(end[0], end[1]);
  }

  if (
    (startPosition === "bottom" || startPosition === "top") &&
    (endPosition === "top" || endPosition === "bottom")
  ) {
    const XDelta = Math.min(15, Math.abs(start[0] - end[0]) / 2);
    const YDelta = Math.min(15, Math.abs(start[1] - end[1]) / 2);

    if (middle[1] > start[1]) path.lineTo(start[0], middle[1] - YDelta);
    else path.lineTo(start[0], middle[1] + YDelta);

    if (start[0] > end[0]) {
      path.quadraticCurveTo(start[0], middle[1], start[0] - XDelta, middle[1]);
      path.lineTo(end[0] + XDelta, middle[1]);
    } else if (start[0] < end[0]) {
      path.quadraticCurveTo(start[0], middle[1], start[0] + XDelta, middle[1]);
      path.lineTo(end[0] - XDelta, middle[1]);
    }

    if (middle[1] > start[1])
      path.quadraticCurveTo(end[0], middle[1], end[0], middle[1] + YDelta);
    else path.quadraticCurveTo(end[0], middle[1], end[0], middle[1] - YDelta);

    path.lineTo(end[0], end[1]);
  }

  return {
    initialPath: path.buildInitialPath(),
    endPath: path.build(),
  };
}
