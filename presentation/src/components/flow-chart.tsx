import { PathBuilder } from "@/lib/draw-path";
import { cn } from "@/lib/utils";
import { useAnimate } from "framer-motion";
import { ComponentProps, forwardRef, useEffect, useId, useState } from "react";

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
    if (startPosition === "top") path.lineTo(start[0], end[1] + 25);
    else if (startPosition === "bottom") path.lineTo(start[0], end[1] - 25);

    if (start[0] < end[0])
      path.quadraticCurveTo(start[0], end[1], start[0] + 25, end[1]);
    else if (start[0] > end[0])
      path.quadraticCurveTo(start[0], end[1], start[0] - 25, end[1]);
    else path.lineTo(start[0], end[1]);

    path.lineTo(end[0], end[1]);
  }

  if (
    (startPosition === "left" || startPosition === "right") &&
    (endPosition === "bottom" || endPosition === "top")
  ) {
    if (startPosition === "left") path.lineTo(end[0] + 25, start[1]);
    else if (startPosition === "right") path.lineTo(end[0] - 25, start[1]);

    if (start[1] > end[1])
      path.quadraticCurveTo(end[0], start[1], end[0], start[1] - 25);
    else if (start[1] < end[1])
      path.quadraticCurveTo(end[0], start[1], end[0], start[1] + 25);
    else path.lineTo(start[0], end[1]);

    path.lineTo(end[0], end[1]);
  }

  if (
    (startPosition === "right" || startPosition === "left") &&
    (endPosition === "left" || endPosition === "right")
  ) {
    if (middle[0] > start[0]) path.lineTo(middle[0] - 25, start[1]);
    else path.lineTo(middle[0] + 25, start[1]);

    const YDelta = Math.min(25, Math.abs(start[1] - end[1]) / 2);

    if (start[1] > end[1]) {
      path.quadraticCurveTo(middle[0], start[1], middle[0], start[1] - YDelta);
      path.lineTo(middle[0], end[1] + 25);
    } else if (start[1] < end[1]) {
      path.quadraticCurveTo(middle[0], start[1], middle[0], start[1] + YDelta);
      path.lineTo(middle[0], end[1] - 25);
    }

    if (middle[0] > start[0])
      path.quadraticCurveTo(middle[0], end[1], middle[0] + 25, end[1]);
    else path.quadraticCurveTo(middle[0], end[1], middle[0] - 25, end[1]);

    path.lineTo(end[0], end[1]);
  }

  if (
    (startPosition === "bottom" || startPosition === "top") &&
    (endPosition === "top" || endPosition === "bottom")
  ) {
    if (middle[1] > start[1]) path.lineTo(start[0], middle[1] - 25);
    else path.lineTo(start[0], middle[1] + 25);

    const XDelta = Math.min(25, Math.abs(start[0] - end[0]) / 2);

    if (start[0] > end[0]) {
      path.quadraticCurveTo(start[0], middle[1], start[0] - XDelta, middle[1]);
      path.lineTo(end[0] + XDelta, middle[1]);
    } else if (start[0] < end[0]) {
      path.quadraticCurveTo(start[0], middle[1], start[0] + XDelta, middle[1]);
      path.lineTo(end[0] - XDelta, middle[1]);
    }

    if (middle[1] > start[1])
      path.quadraticCurveTo(end[0], middle[1], end[0], middle[1] + 25);
    else path.quadraticCurveTo(end[0], middle[1], end[0], middle[1] - 25);

    path.lineTo(end[0], end[1]);
  }

  return {
    initialPath: path.buildInitialPath(),
    endPath: path.build(),
  };
}

export interface FlowChartConnection {
  start: string;
  end: string;
  startPosition: "top" | "bottom" | "left" | "right";
  endPosition: "top" | "bottom" | "left" | "right";
}

export function FlowChart(
  props: {
    connections?: FlowChartConnection[];
  } & ComponentProps<"div">,
) {
  const flowChartId = useId();

  const { children, connections = [], className, ...rest } = props;

  const [paths, setPaths] = useState<
    {
      id: string;
      initialPath: string;
      endPath: string;
    }[]
  >([]);

  useEffect(() => {
    let resizeObservers: ResizeObserver[] = [];

    if (!connections.length) return;

    setPaths([]);

    connections.forEach(({ start, end, startPosition, endPosition }) => {
      const resizeObserver = new ResizeObserver(() => {
        const startNode = document.getElementById(start) as HTMLElement;
        const endNode = document.getElementById(end) as HTMLElement;

        const id = `${flowChartId}-${start}-${end}`;

        setPaths((paths) => {
          const exist = paths.find((path) => path.id === id);

          if (exist)
            return paths.map((path) =>
              path.id === id
                ? {
                    ...path,
                    ...getConnectionPath(
                      startNode,
                      endNode,
                      startPosition,
                      endPosition,
                    ),
                  }
                : path,
            );

          const { initialPath, endPath } = getConnectionPath(
            startNode,
            endNode,
            startPosition,
            endPosition,
          );

          return [
            ...paths,
            {
              id,
              initialPath,
              endPath,
            },
          ];
        });
      });
      const startNode = document.getElementById(start) as HTMLElement;
      const endNode = document.getElementById(end) as HTMLElement;

      if (!startNode || !endNode) return;

      resizeObserver.observe(startNode);
      resizeObserver.observe(endNode);

      resizeObservers.push(resizeObserver);
    });

    return () => {
      setPaths([]);
      resizeObservers.forEach((resizeObserver) => resizeObserver.disconnect());
    };
  }, [connections]);

  return (
    <div className={cn("relative w-max", className)} {...rest}>
      <svg className="inset-0 text-muted-foreground -z-10 absolute w-full h-full">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
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
      {children}
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

const Rect = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => {
    const { children, className, ...rest } = props;

    return (
      <div
        ref={ref}
        className={cn(
          "h-12 text-xl font-medium flex min-w-[250px] items-center justify-center w-max px-10 rounded-md border border-border",
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

FlowChart.Rect = Rect;
