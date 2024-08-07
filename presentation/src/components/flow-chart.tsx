import { PathBuilder } from "@/lib/draw-path";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { useAnimate } from "framer-motion";
import {
  ComponentProps,
  ReactElement,
  ReactNode,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";

export type FlowChartNodes<T = any> = Record<string, ReactElement<T>>

type ModifiedNodes<T extends FlowChartNodes> = {
  [id in keyof T]: ReactElement<{ "data-fc-id": string }>;
};

type PosiblePosition = "top" | "bottom" | "left" | "right";

export type FlowChartConnection<T, K> = [
  from: T extends string ? T : never,
  to: K extends string ? K : never,
  connectionType: `${PosiblePosition}_to_${PosiblePosition}`,
];

export interface FlowChartProps<T extends FlowChartNodes<any>>
  extends Omit<ComponentProps<"div">, "children"> {
  nodes: T;
  connections?: FlowChartConnection<keyof T, keyof T>[];
  children: (nodes: ModifiedNodes<T>) => ReactNode;
}

export function FlowChart<T extends FlowChartNodes<any>>({
  className,
  children,
  nodes,
  connections = [],
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
  }, [newNodes, filteredConnections]);

  return (
    <div className={cn("relative w-max", className)} {...props}>
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
        {paths.map((path) => (
          <Path
            key={path.id}
            id={path.id}
            initialPath={path.initialPath}
            endPath={path.endPath}
          />
        ))}
      </svg>
      {children(newNodes)}
    </div>
  );
}

const Path = (props: { id: string; initialPath: string; endPath: string }) => {
  const [scope, animate] = useAnimate();

  const handleAnimation = async () => {
    await animate(
      scope.current,
      {
        d: props.endPath,
      },
      {
        duration: 1,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.5,
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
  "border border-tranparent w-max rounded-lg font-mono text-center",
  {
    variants: {
      color: {
        transparent: "border-gray-500 bg-background text-foreground",
        red: "border-red-500 bg-red-500/20 text-foreground",
        green: "border-green-500 bg-green-500/20 text-foreground",
        blue: "border-blue-500 bg-blue-500/20 text-foreground",
        yellow: "border-yellow-500 bg-yellow-500/20 text-foreground",
        light: "border-border bg-white text-black",
      },
      size: {
        xs: "p-1 text-xs min-w-[50px]",
        sm: "p-2 text-sm min-w-[75px]",
        default: "p-3",
        lg: "p-6 text-2xl border-2",
      },
    },
    defaultVariants: {
      color: "transparent",
      size: "default",
    },
  },
);

export function Rect({
  className,
  children,
  color,
  size,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof chartBoxCva>) {
  return (
    <div className={cn(chartBoxCva({ color, size, className }))} {...props}>
      {children}
    </div>
  );
}

function getPosition(
  node: HTMLElement,
  position: "top" | "bottom" | "left" | "right",
) {
  switch (position) {
    case "top":
      return [node.offsetLeft + node.offsetWidth / 2, node.offsetTop] as const;
    case "bottom":
      return [
        node.offsetLeft + node.offsetWidth / 2,
        node.offsetTop + node.offsetHeight,
      ] as const;
    case "left":
      return [node.offsetLeft, node.offsetTop + node.offsetHeight / 2] as const;
    case "right":
      return [
        node.offsetLeft + node.offsetWidth,
        node.offsetTop + node.offsetHeight / 2,
      ] as const;
  }
}

function getConnectionPath(
  startNode?: HTMLElement | null,
  endNode?: HTMLElement | null,
  startPosition: "top" | "bottom" | "left" | "right" = "right",
  endPosition: "top" | "bottom" | "left" | "right" = "left",
) {
  if (!startNode || !endNode) return { initialPath: "", endPath: "" };

  const start = getPosition(startNode, startPosition);
  const end = getPosition(endNode, endPosition);

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
