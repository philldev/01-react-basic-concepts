import BrowserUI from "@/components/browser-ui";
import { createStep, useDeck } from "@/components/deck";
import {
  FlowChart,
  FlowChartProps,
  Rect,
  RectProps,
} from "@/components/flow-chart";
import { Button } from "@/components/ui/button";
import { Grid, GridItem } from "@/components/ui/grid";
import { useOnMount } from "@/hooks/use-onmount";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { ComponentProps, ReactNode, SVGProps, useRef, useState } from "react";

const TreeNodeRect = ({ className, size = "xs", ...props }: RectProps) => (
  <Rect
    {...props}
    size={size}
    className={cn("w-max justify-left", className)}
  />
);

type TreeNodeArrType = [
  id: string,
  state: NodeItemState,
  label: string,
  [col: number, row: number],
];

function createTreeNodesFromArr(
  arr: TreeNodeArrType[],
  layoutIdPrefix: string = "",
) {
  const obj: Record<string, any> = {};

  arr.forEach(([id, state, child, [col = 1, row = 1]]) => {
    const props = getProps(state);
    obj[id] = (
      <TreeNodeRect
        {...props}
        children={child}
        layoutId={layoutIdPrefix + id}
        data-grid-col={col}
        data-grid-row={row}
      />
    );
  });

  return obj;
}

function resetTreeNodes(nodes: TreeNodeArrType[]): TreeNodeArrType[] {
  return nodes.map(([id, state, label, position]) => [
    id,
    "default",
    label,
    position,
  ]);
}

type NodeItemState =
  | "mounted"
  | "unmounted"
  | "render"
  | "compare"
  | "changed"
  | "compare_changed"
  | "default";

function getProps(state: NodeItemState) {
  const props: Record<string, any> = {
    color: "transparent",
    className: "",
    focus: false,
  };

  switch (state) {
    case "default":
      props.color = "transparent";
      break;
    case "mounted":
      props.color = "green";
      break;
    case "unmounted":
      props.color = "red";
      break;
    case "render":
      props.color = "yellow";
      props.className = "bg-opacity-0";
      break;
    case "compare":
      props.focus = true;
      break;
    case "changed":
      props.color = "yellow";
      break;
    case "compare_changed":
      props.color = "yellow";
      props.focus = true;
  }

  return props;
}

const StateCache = new Map<string, any[]>();

export default function DemoFlow() {
  const { deckSteps, slideIndex, setDisableNext } = useDeck();

  const [triggerFlowState, setTriggerFlowState] = useState<{
    events: TriggerEvent[];
    active?: boolean;
  }>({
    events: [],
    active: false,
  });

  const [reconciliationFlowState, setReconciliationFlowState] = useState<{
    components: ComponentFlowItemProps[];
    renderTreeNodes?: TreeNodeArrType[];
    renderTreeConnections?: FlowChartProps<any>["connections"];
    active?: boolean;
  }>({
    components: [],
    renderTreeNodes: [],
    renderTreeConnections: [],
    active: false,
  });

  const [commitFlowState, setCommitFlowState] = useState<{
    domChanges?: DomChanges[];
    domTreeNodes?: TreeNodeArrType[];
    domTreeConnections?: FlowChartProps<any>["connections"];
    active?: boolean;
  }>({
    domChanges: [],
    domTreeNodes: [["root", "default", "<div id='root'>", [1, 1]]],
    domTreeConnections: [],
    active: false,
  });

  const [appStatus, setAppStatus] = useState<
    "initial" | "loading" | "loaded" | "liked"
  >("initial");

  const stepConterRef = useRef(0);

  useOnMount(() => {
    const getId = (idx: number) => `step-${idx}`;

    setDisableNext(true);

    StateCache.clear();
    let steps = [
      () =>
        setTriggerFlowState({
          events: [
            {
              id: "1",
              label: "root.render()",
              active: false,
            },
          ],
          active: true,
        }),

      () =>
        setTriggerFlowState((prev) => ({
          ...prev,
          events: prev.events.map((ev) =>
            ev.id === "1" ? { ...ev, active: true } : ev,
          ),
        })),

      () => {
        setTriggerFlowState((prev) => ({
          ...prev,
          active: false,
        }));

        const newComponents = [
          [
            "<Post />",
            [["post = null"], ["loading = true"]],
            [["getPost()", true]],
          ],
          ["<LoadingSpinner />"],
        ] as ComponentArrType[];

        const newNodes = [
          ["post", "render", "<Post />", [1, 1]],
          ["loadingSpinner", "render", "<LoadingSpinner />", [2, 2]],
          ["svg", "render", "<svg />", [3, 3]],
        ] as TreeNodeArrType[];

        setReconciliationFlowState((prev) => ({
          ...prev,
          active: true,
          components: createComponentFromArr(newComponents),
          renderTreeNodes: newNodes,
          renderTreeConnections: [
            ["post", "loadingSpinner", "bottom_to_left"],
            ["loadingSpinner", "svg", "bottom_to_left"],
          ],
        }));
      },

      () => {
        setReconciliationFlowState((prev) => ({
          ...prev,
          active: false,
          renderTreeNodes: prev.renderTreeNodes?.map(
            ([id, _, label, position]) => [id, "mounted", label, position],
          ),
        }));
      },
      () => {
        const newChanges: DomChangesArrType[] = [
          ["mounted", "<svg/>", "root.appendChild(svg)"],
        ];

        setReconciliationFlowState((prev) => ({
          ...prev,
          active: false,
          renderTreeNodes: resetTreeNodes(prev.renderTreeNodes ?? []),
        }));

        setCommitFlowState((prev) => ({
          ...prev,
          active: true,
          domChanges: createDomChangesFromArr(newChanges),
        }));
      },

      () => {
        setCommitFlowState((prev) => ({
          ...prev,
          active: true,
          domChanges: updateDomChanges(prev.domChanges ?? [], "1", {
            active: true,
          }),
          domTreeNodes: [
            ...(prev.domTreeNodes ?? []),
            ["svg", "mounted", "<svg />", [2, 2]],
          ],
          domTreeConnections: [["root", "svg", "bottom_to_left"]],
        }));
      },

      () => {
        setAppStatus("loading");

        setCommitFlowState((prev) => ({
          ...prev,
          active: false,
          domChanges: [],
          domTreeNodes: resetTreeNodes(prev.domTreeNodes ?? []),
        }));
      },

      () => {
        // add 2 events in trigger flow: setPost(postData) and setLoading(true)
        // activate trigger flow

        setReconciliationFlowState((prev) => ({
          ...prev,
          components: prev.components.map((c) =>
            c.id === "1"
              ? {
                  ...c,
                  effects: c.effects?.map((e) =>
                    e.id === "1" ? { ...e, loading: false, disabled: true } : e,
                  ),
                }
              : c,
          ),
        }));

        setTriggerFlowState((prev) => ({
          ...prev,
          active: true,
          events: [
            ...prev.events.map((c) => ({ ...c, active: false })),
            {
              id: "2",
              label: "effect():\nsetPost(postData)\nsetLoading(false)",
              active: true,
            },
          ],
        }));
      },

      () => {
        // set post component state to post = postData, loading = false and set to newState
        // activate reconciliation flow

        setTriggerFlowState((prev) => ({
          ...prev,
          active: false,
        }));

        setReconciliationFlowState((prev) => ({
          ...prev,
          active: true,
          // set the render tree node post node color to green and bg opacity to 0
          renderTreeNodes: prev.renderTreeNodes?.map(
            ([id, state, label, pos]) => {
              if (id === "post") return [id, "render", label, pos];
              return [id, state, label, pos];
            },
          ),
          components: prev.components.map((c) =>
            c.name === "<Post />"
              ? {
                  ...c,
                  states: c.states?.map((s) =>
                    s.id === "1"
                      ? { ...s, label: "post = postData", newState: true }
                      : s.id === "2"
                        ? { ...s, newState: true, label: "loading = false" }
                        : s,
                  ),
                }
              : c,
          ),
        }));
      },

      () => {
        // add main, h1, p, img, p, LikeButton in reconciliation flow render tree nodes and render tree render fn with green color, in render fn add the new ones below the existing ones
        // activate reconciliation flow

        setReconciliationFlowState((prev) => ({
          ...prev,
          renderTreeNodes: [
            ...(prev.renderTreeNodes ?? []),
            ["main", "render", "<main />", [2, 4]],
            ["h1", "render", "<h1 />", [3, 5]],
            ["p", "render", "<p />", [3, 6]],
            ["img", "render", "<img />", [3, 7]],
            ["p2", "render", "<p />", [3, 8]],
            ["likeButton", "render", "<LikeButton />", [3, 9]],
            [
              "likeButton_button",
              "render",
              '<button className="outline" />',
              [4, 10],
            ],
            ["svg_heart_outline", "render", "<svg />", [5, 11]],
            ["likeButton_span", "render", "<span>100</span>", [5, 12]],
          ],
          renderTreeConnections: [
            ...(prev.renderTreeConnections ?? []),
            ["main", "h1", "bottom_to_left"],
            ["main", "p", "bottom_to_left"],
            ["main", "img", "bottom_to_left"],
            ["main", "p2", "bottom_to_left"],
            ["main", "likeButton", "bottom_to_left"],
            ["likeButton", "likeButton_button", "bottom_to_left"],
            ["likeButton_button", "likeButton_span", "bottom_to_left"],
            ["likeButton_button", "svg_heart_outline", "bottom_to_left"],
          ],
          components: [
            ...prev.components,

            {
              id: "likeButton",
              name: "<LikeButton />",
              states: [{ id: "1", label: "liked = false" }],
              props: [{ id: "1", label: "likes = 100" }],
            },
          ],
        }));
      },

      () => {
        // set reconciliation flow loading spinner node & main node color to yellow
        // activate reconciliation flow

        const compare = ["loadingSpinner", "main"];

        setReconciliationFlowState((prev) => ({
          ...prev,
          renderTreeNodes: prev.renderTreeNodes?.map(
            ([id, state, label, pos]) => {
              if (compare.includes(id)) return [id, "compare", label, pos];
              return [id, state, label, pos];
            },
          ),
        }));
      },

      () => {
        // set reconciliation flow loading spinner node & main node color to yellow

        const changed = ["loadingSpinner", "main"];

        setReconciliationFlowState((prev) => ({
          ...prev,
          renderTreeNodes: prev.renderTreeNodes?.map(
            ([id, state, label, pos]) => {
              if (changed.includes(id)) return [id, "changed", label, pos];
              return [id, state, label, pos];
            },
          ),
        }));
      },

      () => {
        // swap recon flow post to loading spinner connection to main
        // set loading spinner & svg node color to red
        // set main, h1, p, img, p, LikeButton color to green

        const unmounted = ["loadingSpinner", "svg"];
        const mounted = [
          "main",
          "h1",
          "p",
          "img",
          "p2",
          "likeButton",
          "likeButton_button",
          "svg_heart_outline",
          "likeButton_span",
        ];

        setReconciliationFlowState((prev) => ({
          ...prev,
          // remove loading spinner component
          components: prev.components.filter(
            (c) => c.name !== "<LoadingSpinner />",
          ),
          renderTreeNodes: prev.renderTreeNodes?.map(
            ([id, state, label, pos]) => {
              if (unmounted.includes(id)) return [id, "unmounted", label, pos];
              if (mounted.includes(id)) return [id, "mounted", label, pos];
              return [id, state, label, pos];
            },
          ),
          renderTreeConnections: [
            // @ts-ignore
            ...prev.renderTreeConnections?.map((c) =>
              c[0] === "post" ? ["post", "main", "bottom_to_left"] : c,
            ),
          ],
        }));
      },

      () => {
        const changes = [
          ["red", "<svg/>", "root.replaceChild(svg, main)"],
          ["green", "<main/>", "main.appendChild(h1)"],
          ["green", "<h1/>", "main.appendChild(p)"],
          ["green", "<p/>", "main.appendChild(img)"],
          ["green", "<img/>", "main.appendChild(p)"],
          ["green", "<p/>", "main.appendChild(LikeButton)"],
          ["green", "<button/>", "main.appendChild(button)"],
          ["green", "<svg/>", "button.appendChild(svg)"],
          ["green", "<span/>", "button.appendChild(span)"],
        ].map(([color, content, codeLabel], i) => ({
          id: `${i + 1}`,
          // @ts-ignore
          content: <Rect size="xs" color={color} children={content} />,
          codeLabel,
        })) as DomChanges[];

        setCommitFlowState((prev) => ({
          ...prev,
          active: true,
          domChanges: changes,
        }));

        const unmounted = ["loadingSpinner", "svg"];

        setReconciliationFlowState((prev) => ({
          ...prev,
          active: false,
          components: prev.components.map((c) => ({
            ...c,
            states: c.states?.map((s) => ({ ...s, newState: false })),
            active: false,
          })),
          renderTreeNodes: resetTreeNodes(prev.renderTreeNodes ?? [])
            .filter(([id]) => !unmounted.includes(id))
            .map(([id, state, content, pos]) => {
              const newPos = [pos[0], pos[1] - unmounted.length] as [
                number,
                number,
              ];
              return [id, state, content, newPos];
            }),
        }));
      },
      ...new Array(9).fill(null).map((_, index) => () => {
        setCommitFlowState((prev) => ({
          ...prev,
          domChanges: prev.domChanges?.map((c, i) => ({
            ...c,
            active: index === i ? true : false,
          })),
        }));

        if (index === 0) {
          setCommitFlowState((prev) => ({
            ...prev,
            domTreeNodes: [
              ...(prev.domTreeNodes?.map(([id, state, label, pos]) => {
                if (id === "svg") return [id, "unmounted", label, pos];
                return [id, state, label, pos];
              }) as TreeNodeArrType[]),
            ],
          }));
        }

        let subSteps = [
          [
            ["h1", "mounted", "<h1 />", [3, 4]],
            ["main", "h1", "bottom_to_left"],
          ],
          [
            ["p", "mounted", "<p />", [3, 5]],
            ["main", "p", "bottom_to_left"],
          ],
          [
            ["img", "mounted", "<img />", [3, 6]],
            ["main", "img", "bottom_to_left"],
          ],
          [
            ["p2", "mounted", "<p />", [3, 7]],
            ["main", "p2", "bottom_to_left"],
          ],
          [
            [
              "likeButton_button",
              "mounted",
              "<button className='outline'/>",
              [3, 8],
            ],
            ["main", "likeButton_button", "bottom_to_left"],
          ],
          [
            ["svg_heart_outline", "mounted", "<svg />", [4, 9]],
            ["likeButton_button", "svg_heart_outline", "bottom_to_left"],
          ],
          [
            ["likeButton_span", "mounted", "<span>100</span>", [4, 10]],
            ["likeButton_button", "likeButton_span", "bottom_to_left"],
          ],
        ] as const;

        subSteps.forEach(([node, connection], i) => {
          if (i === index - 2) {
            // @ts-ignore
            setCommitFlowState((prev) => ({
              ...prev,
              domTreeConnections: [
                ...(prev.domTreeConnections ?? []),
                connection,
              ],
              domTreeNodes: [...(prev.domTreeNodes ?? []), node],
            }));
          }
        });

        if (index === 1) {
          setCommitFlowState((prev) => ({
            ...prev,
            domTreeConnections: [
              ["root", "main", "bottom_to_left"],
              ...(prev.domTreeConnections?.slice(1) ?? []),
            ],
            domTreeNodes: [
              ...(prev.domTreeNodes ?? []),
              ["main", "mounted", "<main />", [2, 3]],
            ],
          }));
        }
      }),

      () => {
        setAppStatus("loaded");
        setCommitFlowState((prev) => ({
          ...prev,
          active: false,
          domTreeNodes: resetTreeNodes(prev.domTreeNodes ?? [])
            .filter((t) => t[0] !== "svg")
            .map(([id, state, content, pos]) => {
              const newPos = [pos[0], pos[1] - 1] as [number, number];
              return [id, state, content, newPos];
            }),
          domChanges: [],
        }));
      },
    ];

    steps.forEach((step, index) => {
      stepConterRef.current = index + 1;
      deckSteps.addStep(slideIndex, createStep(getId(index), step, index));
    });
  });

  const clickedRef = useRef(false);

  const handleClickLike = () => {
    if (clickedRef.current) return;
    clickedRef.current = true;

    setTriggerFlowState((prev) => ({
      ...prev,
      active: true,
      events: [
        ...prev.events.map((c) => ({ ...c, active: false })),
        {
          id: "2",
          label: "click():\nsetLiked(true)",
          active: true,
        },
      ],
    }));

    const stepsLen = stepConterRef.current + 1;

    const getId = (idx: number) => `step-${idx}`;

    const steps = [
      () => {
        setTriggerFlowState((prev) => ({ ...prev, active: false }));
        setReconciliationFlowState((prev) => ({
          ...prev,
          active: true,
          renderTreeNodes: [
            ...(prev.renderTreeNodes?.map(([id, state, label, pos]) => {
              if (id === "likeButton") return [id, "render", label, pos];
              return [id, state, label, pos];
            }) as TreeNodeArrType[]),
          ],
          components: prev.components.map((c) =>
            c.id === "likeButton"
              ? {
                  ...c,
                  states: [{ id: "1", label: "liked = true", newState: true }],
                }
              : c,
          ),
        }));
      },
      () => {
        setReconciliationFlowState((prev) => ({
          ...prev,
          renderTreeNodes: [
            ...(prev.renderTreeNodes ?? []),
            [
              "likeButton_button_2",
              "render",
              "<button className='filled' />",
              [4, 11],
            ],
            ["svg_heart_outline_2", "render", "<svg />", [5, 12]],
            ["likeButton_span_2", "render", "<span>101</span>", [5, 13]],
          ],
          renderTreeConnections: [
            ...(prev.renderTreeConnections ?? []),
            ["likeButton_button_2", "likeButton_span_2", "bottom_to_left"],
            ["likeButton_button_2", "svg_heart_outline_2", "bottom_to_left"],
          ],
        }));
      },
      ...[
        ["likeButton_button", "likeButton_button_2", "compare"],
        [
          "likeButton_button",
          "likeButton_button_2",
          "changed",
          "<button className='filled' />",
        ],
        ["svg_heart_outline", "svg_heart_outline_2", "compare"],
        ["svg_heart_outline", "svg_heart_outline_2", "default"],
        ["likeButton_span", "likeButton_span_2", "compare"],
        ["likeButton_span", "likeButton_span_2", "changed", "<span>101</span>"],
      ].map((item) => async () => {
        setReconciliationFlowState((prev) => ({
          ...prev,
          renderTreeNodes: [
            ...(prev.renderTreeNodes?.map(([id, state, label, pos]) => {
              if (id === item[0] || id === item[1])
                return [id, item[2], item[3] ?? label, pos];
              return [id, state, label, pos];
            }) as TreeNodeArrType[]),
          ],
        }));
      }),
      () => {
        const removedNodes = [
          "likeButton_button_2",
          "svg_heart_outline_2",
          "likeButton_span_2",
        ];

        setReconciliationFlowState((prev) => ({
          ...prev,
          active: false,
          renderTreeNodes: resetTreeNodes(prev.renderTreeNodes ?? []).filter(
            ([id]) => !removedNodes.includes(id),
          ),
        }));

        const domChanges: DomChangesArrType[] = [
          [
            "changed",
            "<button />",
            "button.setAttribute('className', 'filled')",
          ],
          ["changed", "<span/>", "span.innerText = '101'"],
        ];

        setCommitFlowState((prev) => ({
          ...prev,
          active: true,
          domChanges: createDomChangesFromArr(domChanges),
        }));
      },
      ...(
        [
          [
            "1",
            "likeButton_button",
            "changed",
            "<button className='filled' />",
          ],
          ["2", "likeButton_span", "changed", "<span>101</span>"],
        ] as [string, string, NodeItemState, string][]
      ).map((item, _) => async () => {
        setCommitFlowState((prev) => ({
          ...prev,
          domTreeNodes: prev.domTreeNodes?.map(([id, state, label, pos]) => {
            if (id === item[1]) return [id, item[2], item[3], pos];
            return [id, state, label, pos];
          }),
          domChanges: prev.domChanges?.map((c) => ({
            ...c,
            active: c.id === item[0],
          })),
        }));
      }),
      () => {
        setAppStatus("liked");
        setCommitFlowState((prev) => ({
          ...prev,
          active: false,
          domChanges: [],
          domTreeNodes: resetTreeNodes(prev.domTreeNodes ?? []),
        }));
        setDisableNext(false);
      },
    ];

    steps.forEach((step, _index) => {
      let index = _index + stepsLen;
      deckSteps.addStep(slideIndex, createStep(getId(index), step, index));
    });
  };

  const handleClickBack = () => {};
  const handleClickContinue = () => {};

  return (
    <div className="flex flex-col gap-10">
      <div className="flex-1 flex gap-8">
        <TriggerFlow {...triggerFlowState} />
        <ReconciliationFlow {...reconciliationFlowState} />
        <CommitFlow {...commitFlowState} />
      </div>

      <div className="flex gap-10">
        <BrowserUI className="h-[500px] w-[450px] transform scale-75 absolute bottom-4 left-4 origin-bottom-left hover:scale-100 transition-all">
          <AppExample status={appStatus} onClickLike={handleClickLike} />
        </BrowserUI>
      </div>
    </div>
  );
}

interface TriggerEvent {
  id: string;
  label: string;
  active?: boolean;
}

function TriggerFlow({
  events = [],
  active,
}: {
  events?: TriggerEvent[];
  active?: boolean;
}) {
  return (
    <FlowBoard className="w-max">
      <FlowBoardTitle active={active}>Trigger</FlowBoardTitle>
      <FlowBoardContent className="w-[180px] flex flex-col gap-4">
        <FlowBoardSubtitle>Events</FlowBoardSubtitle>
        <div className="flex flex-col gap-2">
          {events.map((event) => (
            <motion.div
              initial={{ opacity: 0, y: "-50%" }}
              animate={{ opacity: 1, y: "0%" }}
              transition={{ duration: 0.4 }}
              key={event.id}
              className="relative px-2 py-1"
            >
              {event.active && (
                <motion.div
                  layoutId="selected"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="inset-0 w-full h-full bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 absolute rounded-lg"
                />
              )}
              <span className="text-xs font-medium font-mono">
                {event.label}
              </span>
            </motion.div>
          ))}
        </div>
      </FlowBoardContent>
    </FlowBoard>
  );
}

function ReconciliationFlow({
  components = [],
  renderTreeNodes = [],
  renderTreeConnections,
  active,
}: {
  components?: ComponentFlowItemProps[];
  renderTreeNodes?: TreeNodeArrType[];
  renderTreeConnections?: FlowChartProps<any>["connections"];
  active?: boolean;
}) {
  return (
    <FlowBoard className="flex-1">
      <FlowBoardTitle active={active}>Reconciliation</FlowBoardTitle>
      <FlowBoardContent className="flex gap-4">
        <div className="w-[150px] flex flex-col gap-4">
          <FlowBoardSubtitle>Components</FlowBoardSubtitle>
          <div className="flex flex-col gap-2">
            {components.map((component) => (
              <ComponentFlowItem key={component.id} {...component} />
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <FlowBoardSubtitle>Render Tree</FlowBoardSubtitle>
          <FlowChart
            nodes={createTreeNodesFromArr(renderTreeNodes ?? [])}
            connections={renderTreeConnections}
            children={(nodes) => (
              <Grid className="gap-4 gap-x-2">
                {Object.entries(nodes).map(([id, node]) => (
                  <GridItem
                    key={id}
                    // @ts-ignore
                    col={node.props["data-grid-col"]}
                    // @ts-ignore
                    row={node.props["data-grid-row"]}
                    children={node}
                  />
                ))}
              </Grid>
            )}
            config={{
              connectionOffset: {
                start: "start",
              },
            }}
          />
        </div>
      </FlowBoardContent>
    </FlowBoard>
  );
}

type ComponentArrType = [
  name: string,
  states?: [string, newState?: boolean][],
  effects?: [string, loading?: boolean][],
];

function createComponentFromArr(arr: ComponentArrType[]) {
  return arr.map(([name, states, effects], i) => ({
    id: `${i + 1}`,
    name,
    states: states?.map(([label, newState], i) => ({
      id: `${i + 1}`,
      label,
      newState,
    })),
    effects: effects?.map(([label, loading], i) => ({
      id: `${i + 1}`,
      label,
      loading,
    })),
  }));
}

interface ComponentFlowItemProps {
  id: string;
  name: string;
  active?: boolean;
  states?: { id: string; label: string; newState?: boolean }[];
  effects?: {
    id: string;
    label: string;
    loading?: boolean;
    disabled?: boolean;
  }[];
  props?: { id: string; label: string; changed?: boolean }[];
  ["data-fc-id"]?: string;
}

function ComponentFlowItem(props: ComponentFlowItemProps) {
  return (
    <div
      className="relative border rounded-lg text-xs overflow-hidden"
      data-fc-id={props["data-fc-id"]}
    >
      <div className="flex p-2 bg-gray-800 justify-between">
        <pre>{props.name}</pre>
      </div>
      <div className="flex flex-col gap-2 px-2 py-2">
        {props.props && props.props.length ? (
          <div className="flex flex-col gap-1">
            <p>Props</p>
            {props.props?.map((prop) => (
              <pre
                className={cn(
                  "p-1 bg-gray-800/50 w-max rounded-md transition-all duration-500",
                  prop.changed && "bg-yellow-500/80",
                )}
              >
                {prop.label}
              </pre>
            ))}
          </div>
        ) : null}

        {props.states && props.states.length ? (
          <div className="flex flex-col gap-1">
            <p>States</p>
            {props.states?.map((state) => (
              <pre
                className={cn(
                  "p-1 bg-gray-800/50 w-max rounded-md transition-all duration-500",
                  state.newState && "bg-green-500/80",
                )}
              >
                {state.label}
              </pre>
            ))}
          </div>
        ) : null}

        {props.effects && props.effects.length ? (
          <div className="flex flex-col gap-1">
            <p>Effects</p>
            {props.effects?.map((effect) => (
              <div
                key={effect.id}
                className={cn(
                  "flex gap-2 items-center",
                  effect.disabled && "opacity-50",
                )}
              >
                <pre
                  className={cn(
                    "p-1 bg-gray-800/50 w-max rounded-md",
                    effect.loading && "animate-pulse bg-yellow-500/80",
                  )}
                >
                  {effect.label}
                </pre>
                {effect.loading && <LoadingSpinner className="w-4 h-4" />}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

type DomChangesState = "mounted" | "unmounted" | "changed";

type DomChangesArrType = [
  state: DomChangesState,
  content: string,
  codeLabel: string,
];

function createDomChangesFromArr(arr: DomChangesArrType[]): DomChanges[] {
  return arr.map(([state, content, codeLabel], i) => ({
    id: `${i + 1}`,
    state,
    content: (
      <Rect
        size="xs"
        color={
          state === "mounted"
            ? "green"
            : state === "unmounted"
              ? "red"
              : "yellow"
        }
        children={content}
      />
    ),
    codeLabel,
    active: false,
  }));
}

function updateDomChanges(
  current: DomChanges[],
  id: string,
  newChange: Partial<DomChanges>,
) {
  return current.map((change) => {
    if (change.id === id) {
      return { ...change, ...newChange };
    }
    return change;
  });
}

interface DomChanges {
  id: string;
  content: ReactNode;
  codeLabel: string;
  active?: boolean;
}

function CommitFlow({
  domChanges = [],
  active,
  domTreeNodes,
  domTreeConnections,
}: {
  domChanges?: DomChanges[];
  domTreeNodes?: TreeNodeArrType[];
  domTreeConnections?: FlowChartProps<any>["connections"];
  active?: boolean;
}) {
  const changesInfo = domChanges.find((change) => change.active)?.codeLabel;

  return (
    <FlowBoard className="flex-1">
      <FlowBoardTitle active={active}>Trigger</FlowBoardTitle>
      <div className="p-2 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 rounded-lg flex gap-10">
        <p className="text-sm text-yellow-400 font-medium">Changes info :</p>
        <p className="text-sm text-white font-mono">{changesInfo}</p>
      </div>
      <FlowBoardContent className="flex gap-4">
        <div className="w-[150px] flex flex-col gap-4">
          <FlowBoardSubtitle>DOM Changes</FlowBoardSubtitle>
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {domChanges.map((changes) => (
                <motion.div
                  initial={{ opacity: 0, x: "-50%" }}
                  animate={{ opacity: 1, x: "0%" }}
                  exit={{ opacity: 0, x: "50%" }}
                  transition={{ duration: 0.4 }}
                  key={changes.id}
                  className="relative px-2 py-2"
                >
                  {changes.active && (
                    <motion.div
                      layoutId="selected_dom_changes"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="inset-0 w-full h-full bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 absolute rounded-lg"
                    />
                  )}
                  {changes.content}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <FlowBoardSubtitle>DOM Tree</FlowBoardSubtitle>
          <FlowChart
            nodes={createTreeNodesFromArr(domTreeNodes ?? [], "dom_")}
            connections={domTreeConnections}
            children={(nodes) => (
              <Grid className="gap-4 gap-x-2">
                {Object.entries(nodes).map(([id, node]) => (
                  <GridItem
                    key={id}
                    // @ts-ignore
                    col={node.props["data-grid-col"]}
                    // @ts-ignore
                    row={node.props["data-grid-row"]}
                    children={node}
                  />
                ))}
              </Grid>
            )}
            config={{
              connectionOffset: {
                start: "start",
              },
            }}
          />
        </div>
      </FlowBoardContent>
    </FlowBoard>
  );
}

function FlowBoard({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-4 h-full min-h-[600px]", className)}
      {...props}
    />
  );
}

function FlowBoardContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex-1", className)} {...props} />;
}

const flowBoardTitleCva = cva(
  "flex justify-center bg-background items-center p-3 border-2 font-mono rounded-lg transition-all duration-500",
  {
    variants: {
      active: {
        true: "bg-yellow-500/20 border-yellow-500",
      },
    },
  },
);

function FlowBoardTitle({
  className,
  active,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof flowBoardTitleCva>) {
  return (
    <div
      className={cn(
        flowBoardTitleCva({
          active,
          className,
        }),
      )}
      {...props}
    />
  );
}

function FlowBoardSubtitle({
  className,
  active,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof flowBoardTitleCva>) {
  return (
    <div
      className={cn("text-muted-foreground text-sm font-medium")}
      {...props}
    />
  );
}

interface Post {
  title: string;
  img_url: string;
  content: string;
  author: string;
  likes: number;
}

function getPost() {
  return new Promise<Post>((resolve) => {
    setTimeout(() => {
      resolve({
        title: "Hello World",
        img_url: "https://picsum.photos/id/1003/200/300",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, ",
        author: "John Doe",
        likes: 100,
      });
    }, 1000);
  });
}
type AppStatus = "initial" | "loading" | "loaded" | "liked";

function AppExample(props: { status: AppStatus; onClickLike: () => void }) {
  const post: Post = {
    title: "Hello World",
    img_url: "https://picsum.photos/id/1003/200/300",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, ",
    author: "John Doe",
    likes: 100,
  };

  if (props.status === "initial") return null;

  if (props.status === "loading") {
    return <LoadingSpinner className="mx-auto pt-20 w-32 h-32" />;
  }

  const likes = post.likes;
  const liked = props.status === "liked";

  return (
    <div className="bg-white h-full text-black p-4 flex flex-col gap-3 rounded-lg">
      <h1 className="text-2xl font-bold">{post?.title}</h1>
      <p>by {post?.author}</p>
      <img className="h-[200px] object-cover" src={post?.img_url} />
      <p>{post?.content}</p>
      <button onClick={props.onClickLike} className="flex gap-2 items-center">
        {liked ? (
          <HeartFill className="w-5 h-5" />
        ) : (
          <Heart className="w-5 h-5" />
        )}
        <span className="ml-2">{liked ? likes + 1 : likes}</span>
      </button>
    </div>
  );
}

export function LoadingSpinner(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <g>
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".14"
        ></rect>
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".29"
          transform="rotate(30 12 12)"
        ></rect>
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".43"
          transform="rotate(60 12 12)"
        ></rect>
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".57"
          transform="rotate(90 12 12)"
        ></rect>
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".71"
          transform="rotate(120 12 12)"
        ></rect>
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          opacity=".86"
          transform="rotate(150 12 12)"
        ></rect>
        <rect
          width="2"
          height="5"
          x="11"
          y="1"
          fill="currentColor"
          transform="rotate(180 12 12)"
        ></rect>
        <animateTransform
          attributeName="transform"
          calcMode="discrete"
          dur="0.75s"
          repeatCount="indefinite"
          type="rotate"
          values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
        ></animateTransform>
      </g>
    </svg>
  );
}

export function Heart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3m-4.4 15.55l-.1.1l-.1-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05"
      ></path>
    </svg>
  );
}

export function HeartFill(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"
      ></path>
    </svg>
  );
}
