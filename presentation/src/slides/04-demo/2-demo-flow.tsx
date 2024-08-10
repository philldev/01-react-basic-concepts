import BrowserUI from "@/components/browser-ui";
import { createStep, useDeck } from "@/components/deck";
import {
  FlowChart,
  FlowChartProps,
  Rect,
  RectProps,
} from "@/components/flow-chart";
import { Grid, GridItem } from "@/components/ui/grid";
import { useOnMount } from "@/hooks/use-onmount";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import {
  ComponentProps,
  ReactNode,
  SVGProps,
  useEffect,
  useRef,
  useState,
} from "react";

const TreeNodeRect = ({ className, size = "xs", ...props }: RectProps) => (
  <Rect
    {...props}
    size={size}
    className={cn("w-max justify-left", className)}
  />
);

const TreeNodes = {
  main: (props?: RectProps, text?: string) => (
    <TreeNodeRect {...props} children={text ?? "<main>"} />
  ),
  ul: (props?: RectProps, text?: string) => (
    <TreeNodeRect {...props} children={text ?? "<ul>"} />
  ),
  li: (props?: RectProps, text?: string) => (
    <TreeNodeRect {...props} children={text ?? "<li>"} />
  ),
  div: (props?: RectProps, text?: string) => (
    <TreeNodeRect {...props} children={text ?? "<div>"} />
  ),
  button: (props?: RectProps, text?: string) => (
    <TreeNodeRect {...props} children={text ?? "<button>"} />
  ),
  text: (props?: RectProps, text?: string) => (
    <TreeNodeRect {...props} children={text ?? "<text>"} />
  ),
};

export default function DemoFlow() {
  const { deckSteps, slideIndex } = useDeck();

  const [triggerFlowState, setTriggerFlowState] = useState<{
    events: TriggerEvent[];
    active?: boolean;
  }>({
    events: [],
    active: false,
  });

  const [reconciliationFlowState, setReconciliationFlowState] = useState<{
    components: ComponentFlowItemProps[];
    renderTreeNodes?: FlowChartProps<any>["nodes"];
    renderTreeConnections?: FlowChartProps<any>["connections"];
    renderTreeRenderFn?: FlowChartProps<any>["children"];
    active?: boolean;
  }>({
    components: [],
    renderTreeNodes: {},
    renderTreeConnections: [],
    renderTreeRenderFn: undefined,
    active: false,
  });

  const [commitFlowState, setCommitFlowState] = useState<{
    domChanges?: DomChanges[];
    domTreeNodes?: FlowChartProps<any>["nodes"];
    domTreeConnections?: FlowChartProps<any>["connections"];
    domTreeRenderFn?: FlowChartProps<any>["children"];
    active?: boolean;
  }>({
    domChanges: [],
    domTreeNodes: {
      root: TreeNodes.div({}, "<div id='root'>"),
    },
    domTreeConnections: [],
    domTreeRenderFn: (nodes) => (
      <Grid className="gap-4 gap-x-2">
        <GridItem col={1} row={1} children={nodes.root} />
      </Grid>
    ),
    active: false,
  });

  const [appStatus, setAppStatus] = useState<
    "initial" | "loading" | "loaded" | "liked"
  >("initial");

  const stepConterRef = useRef(0);

  useOnMount(() => {
    const getId = (idx: number) => `step-${idx}`;

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

        setReconciliationFlowState((prev) => ({
          ...prev,
          active: true,
          components: [
            {
              id: "1",
              name: "<Post />",
              states: [
                { id: "1", label: "post = null" },
                { id: "2", label: "loading = true" },
              ],
              effects: [
                {
                  id: "1",
                  label: "getPost()",
                  loading: true,
                },
              ],
            },
            {
              id: "2",
              name: "<LoadingSpinner />",
            },
          ],
          renderTreeNodes: {
            post: TreeNodes.div(
              {
                color: "green",
                className: "bg-opacity-0",
              },
              "<Post />",
            ),
            loadingSpinner: TreeNodes.div(
              {
                color: "green",
                className: "bg-opacity-0",
              },
              "<LoadingSpinner />",
            ),
            svg: TreeNodes.div(
              {
                color: "green",
              },
              "<svg />",
            ),
          },
          renderTreeConnections: [
            ["post", "loadingSpinner", "bottom_to_left"],
            ["loadingSpinner", "svg", "bottom_to_left"],
          ],
          renderTreeRenderFn: (nodes) => (
            <Grid className="gap-4 gap-x-2">
              <GridItem col={1} row={1} children={nodes.post} />
              <GridItem col={2} row={2} children={nodes.loadingSpinner} />
              <GridItem col={3} row={3} children={nodes.svg} />
            </Grid>
          ),
        }));
      },

      () => {
        setReconciliationFlowState((prev) => ({
          ...prev,
          active: false,
          renderTreeNodes: {
            ...Object.fromEntries(
              Object.entries(prev.renderTreeNodes ?? {}).map(
                ([id, node]: [string, any]) => {
                  return [
                    id,
                    TreeNodes.div(
                      {
                        ...node.props,
                        color: "transparent",
                      },
                      node.props.children,
                    ),
                  ];
                },
              ),
            ),
          },
        }));

        setCommitFlowState((prev) => ({
          ...prev,
          active: true,
          domChanges: [
            {
              id: "1",
              content: <Rect size="xs" color="green" children="<svg/>" />,
              codeLabel: "root.appendChild(svg)",
            },
          ],
        }));
      },

      () => {
        setCommitFlowState((prev) => ({
          ...prev,
          active: true,
          domChanges: prev.domChanges?.map((d) =>
            d.id === "1" ? { ...d, active: true } : d,
          ),
          domTreeNodes: {
            root: prev.domTreeNodes?.root,
            svg: TreeNodes.div(
              {
                color: "green",
              },
              "<svg />",
            ),
          },
          domTreeConnections: [["root", "svg", "bottom_to_left"]],
          domTreeRenderFn: (nodes) => (
            <Grid className="gap-4 gap-x-2">
              <GridItem col={1} row={1} children={nodes.root} />
              <GridItem col={2} row={2} children={nodes.svg} />
            </Grid>
          ),
        }));
      },

      () => {
        setAppStatus("loading");

        setCommitFlowState((prev) => ({
          ...prev,
          active: false,
          domChanges: [],
          domTreeNodes: {
            root: prev.domTreeNodes?.root,
            svg: TreeNodes.div(
              {
                color: "transparent",
              },
              "<svg />",
            ),
          },
        }));

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
      },

      () => {
        // add 2 events in trigger flow: setPost(postData) and setLoading(true)
        // activate trigger flow

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
          renderTreeNodes: {
            ...prev.renderTreeNodes,
            post: TreeNodes.div(
              {
                color: "yellow",
                className: "bg-opacity-0",
              },
              "<Post />",
            ),
          },
          components: prev.components.map((c) =>
            c.id === "1"
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
          renderTreeNodes: {
            ...prev.renderTreeNodes,
            main: TreeNodes.div({}, "<main />"),
            h1: TreeNodes.div({}, "<h1 />"),
            p: TreeNodes.div({}, "<p />"),
            p2: TreeNodes.div({}, "<p />"),
            img: TreeNodes.div({}, "<img />"),
            likeButton: TreeNodes.div({}, "<LikeButton />"),
          },
          renderTreeConnections: [
            ...(prev.renderTreeConnections ?? []),
            ["main", "h1", "bottom_to_left"],
            ["main", "p", "bottom_to_left"],
            ["main", "img", "bottom_to_left"],
            ["main", "p2", "bottom_to_left"],
            ["main", "likeButton", "bottom_to_left"],
          ],
          renderTreeRenderFn: (nodes) => (
            <Grid className="gap-4 gap-x-2">
              <GridItem col={1} row={1} children={nodes.post} />
              <GridItem col={2} row={2} children={nodes.loadingSpinner} />
              <GridItem col={3} row={3} children={nodes.svg} />
              <GridItem col={2} row={4} children={nodes.main} />
              <GridItem col={3} row={5} children={nodes.h1} />
              <GridItem col={3} row={6} children={nodes.p} />
              <GridItem col={3} row={7} children={nodes.img} />
              <GridItem col={3} row={8} children={nodes.p2} />
              <GridItem col={3} row={9} children={nodes.likeButton} />
            </Grid>
          ),
        }));
      },

      () => {
        // set reconciliation flow loading spinner node & main node color to yellow
        // activate reconciliation flow

        setReconciliationFlowState((prev) => ({
          ...prev,
          renderTreeNodes: {
            ...prev.renderTreeNodes,
            loadingSpinner: TreeNodes.div(
              {
                focus: true,
              },
              "<LoadingSpinner />",
            ),
            main: TreeNodes.div(
              {
                focus: true,
              },
              "<main />",
            ),
          },
        }));
      },

      () => {
        // set reconciliation flow loading spinner node & main node color to yellow

        setReconciliationFlowState((prev) => ({
          ...prev,
          renderTreeNodes: {
            ...prev.renderTreeNodes,
            loadingSpinner: TreeNodes.div(
              {
                color: "yellow",
              },
              "<LoadingSpinner />",
            ),
            main: TreeNodes.div(
              {
                color: "yellow",
              },
              "<main />",
            ),
          },
        }));
      },

      () => {
        // swap recon flow post to loading spinner connection to main
        // set loading spinner & svg node color to red
        // set main, h1, p, img, p, LikeButton color to green

        const unmounted = ["loadingSpinner", "svg"];
        const mounted = ["main", "h1", "p", "img", "p2", "likeButton"];

        setReconciliationFlowState((prev) => ({
          ...prev,
          // remove loading spinner component
          components: prev.components.filter((c) => c.id !== "2"),
          renderTreeNodes: {
            ...prev.renderTreeNodes,
            ...Object.fromEntries(
              Object.entries(prev.renderTreeNodes ?? {}).map(
                ([id, node]: [string, any]) => {
                  return [
                    id,
                    TreeNodes.div(
                      {
                        ...node.props,
                        layoutId: id,
                        color: mounted.includes(id)
                          ? "green"
                          : unmounted.includes(id)
                            ? "red"
                            : "transparent",
                      },
                      node.props.children,
                    ),
                  ];
                },
              ),
            ),
          },
          renderTreeRenderFn: (nodes) => (
            <Grid className="gap-4 gap-x-2">
              <GridItem col={1} row={1} children={nodes.post} />
              <GridItem col={2} row={2} children={nodes.loadingSpinner} />
              <GridItem col={3} row={3} children={nodes.svg} />
              <GridItem col={2} row={4} children={nodes.main} />
              <GridItem col={3} row={5} children={nodes.h1} />
              <GridItem col={3} row={6} children={nodes.p} />
              <GridItem col={3} row={7} children={nodes.img} />
              <GridItem col={3} row={8} children={nodes.p2} />
              <GridItem col={3} row={9} children={nodes.likeButton} />
              <GridItem col={4} row={10} children={nodes.likeButton_button} />
              <GridItem col={5} row={11} children={nodes.svg_heart_outline} />
              <GridItem col={5} row={12} children={nodes.likeButton_span} />
            </Grid>
          ),
          renderTreeConnections: [
            // @ts-ignore
            ...prev.renderTreeConnections?.map((c) =>
              c[0] === "post" ? ["post", "main", "bottom_to_left"] : c,
            ),
            ["likeButton", "likeButton_button", "bottom_to_left"],
            ["likeButton_button", "likeButton_span", "bottom_to_left"],
            ["likeButton_button", "svg_heart_outline", "bottom_to_left"],
          ],
        }));
      },

      () => {
        // set likeButton node focus to true
        // add new component to recon flow: name: <LikeButton />, states: [liked = false]

        setReconciliationFlowState((prev) => ({
          ...prev,
          renderTreeNodes: {
            ...prev.renderTreeNodes,
            likeButton: TreeNodes.div(
              {
                focus: true,
                layoutId: "likeButton",
              },
              "<LikeButton />",
            ),
            likeButton_button: TreeNodes.div(
              {
                color: "green",
                layoutId: "likeButton_button",
              },
              "<button className='outline' />",
            ),
            likeButton_span: TreeNodes.div(
              {
                color: "green",
                layoutId: "likeButton_span",
              },
              "<span>100</span>",
            ),
            svg_heart_outline: TreeNodes.div(
              {
                color: "green",
                layoutId: "svg_heart_outline",
              },
              "<svg />",
            ),
          },
          connections: [
            ...(prev.renderTreeConnections ?? []),
            ["likeButton", "likeButton_button", "bottom_to_left"],
            ["likeButton", "likeButton_span", "bottom_to_left"],
            ["likeButton", "svg_heart_outline", "bottom_to_left"],
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
        setCommitFlowState((prev) => ({
          ...prev,
          active: true,
          domChanges: [
            {
              id: "1",
              content: <Rect size="xs" color="red" children="<svg/>" />,
              codeLabel: "root.replaceChild(svg, main)",
            },
            {
              id: "2",
              content: <Rect size="xs" color="green" children="<main/>" />,
              codeLabel: "root.replaceChild(svg, main)",
            },
            {
              id: "3",
              content: <Rect size="xs" color="green" children="<h1/>" />,
              codeLabel: "main.appendChild(h1)",
            },
            {
              id: "4",
              content: <Rect size="xs" color="green" children="<p/>" />,
              codeLabel: "main.appendChild(p)",
            },
            {
              id: "5",
              content: <Rect size="xs" color="green" children="<img/>" />,
              codeLabel: "main.appendChild(img)",
            },
            {
              id: "6",
              content: <Rect size="xs" color="green" children="<p/>" />,
              codeLabel: "main.appendChild(p)",
            },
            {
              id: "8",
              content: <Rect size="xs" color="green" children="<button />" />,
              codeLabel: "main.appendChild(button)",
            },
            {
              id: "10",
              content: <Rect size="xs" color="green" children="<svg/>" />,
              codeLabel: "button.appendChild(svg)",
            },
            {
              id: "9",
              content: <Rect size="xs" color="green" children="<span/>" />,
              codeLabel: "button.appendChild(span)",
            },
          ],
        }));

        setReconciliationFlowState((prev) => ({
          ...prev,
          active: false,
          components: prev.components.map((c) => ({
            ...c,
            states: c.states?.map((s) => ({ ...s, newState: false })),
            active: false,
          })),
          renderTreeNodes: {
            ...Object.fromEntries(
              Object.entries(prev.renderTreeNodes ?? {}).map(
                ([id, node]: [string, any]) => {
                  return [
                    id,
                    TreeNodes.div(
                      {
                        ...node.props,
                        focus: false,
                        color: "transparent",
                      },
                      node.props.children,
                    ),
                  ];
                },
              ),
            ),
          },
          renderTreeRenderFn: (nodes) => (
            <Grid className="gap-4 gap-x-2">
              <GridItem col={1} row={1} children={nodes.post} />
              <GridItem col={2} row={2} children={nodes.main} />
              <GridItem col={3} row={3} children={nodes.h1} />
              <GridItem col={3} row={4} children={nodes.p} />
              <GridItem col={3} row={5} children={nodes.img} />
              <GridItem col={3} row={6} children={nodes.p2} />
              <GridItem col={3} row={7} children={nodes.likeButton} />
              <GridItem col={4} row={8} children={nodes.likeButton_button} />
              <GridItem col={5} row={9} children={nodes.svg_heart_outline} />
              <GridItem col={5} row={10} children={nodes.likeButton_span} />
            </Grid>
          ),
        }));
      },
      ...new Array(10).fill(null).map((_, index) => () => {
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
            domTreeNodes: {
              root: prev.domTreeNodes?.root,
              svg: TreeNodes.div(
                {
                  color: "red",
                },
                "<svg />",
              ),
              main: TreeNodes.div(
                {
                  color: "green",
                  className: "opacity-[0!important]",
                  layoutId: "dom_main",
                },
                "<main />",
              ),
              h1: TreeNodes.div(
                {
                  color: "green",
                  className: "opacity-[0!important]",
                  layoutId: "dom_h1",
                },
                "<h1 />",
              ),
              p: TreeNodes.div(
                {
                  color: "green",
                  className: "opacity-[0!important]",
                  layoutId: "dom_p",
                },
                "<p />",
              ),
              img: TreeNodes.div(
                {
                  color: "green",
                  className: "opacity-[0!important]",
                  layoutId: "dom_img",
                },
                "<img />",
              ),
              p2: TreeNodes.div(
                {
                  color: "green",
                  className: "opacity-[0!important]",
                  layoutId: "dom_p2",
                },
                "<p />",
              ),
              likeButton_button: TreeNodes.div(
                {
                  color: "green",
                  className: "opacity-[0!important]",
                  layoutId: "dom_likeButton_button",
                },
                "<button className='outline'/>",
              ),
              likeButton_span: TreeNodes.div(
                {
                  color: "green",
                  className: "opacity-[0!important]",
                  layoutId: "dom_likeButton_span",
                },
                "<span>100</span>",
              ),
              svg_heart_outline: TreeNodes.div(
                {
                  color: "green",
                  className: "opacity-[0!important]",
                  layoutId: "dom_svg_heart_outline",
                },
                "<svg />",
              ),
            },
            domTreeRenderFn: (nodes) => (
              <Grid className="gap-4 gap-x-2">
                <GridItem col={1} row={1} children={nodes.root} />
                <GridItem col={2} row={2} children={nodes.svg} />
                <GridItem col={2} row={3} children={nodes.main} />
                <GridItem col={3} row={4} children={nodes.h1} />
                <GridItem col={3} row={5} children={nodes.p} />
                <GridItem col={3} row={6} children={nodes.img} />
                <GridItem col={3} row={7} children={nodes.p2} />
                <GridItem col={4} row={8} children={nodes.likeButton_button} />
                <GridItem col={5} row={9} children={nodes.svg_heart_outline} />
                <GridItem col={5} row={10} children={nodes.likeButton_span} />
              </Grid>
            ),
          }));
        }

        let subSteps = [
          ["h1", "<h1 />", ["main", "h1", "bottom_to_left"]],
          ["p", "<p />", ["main", "p", "bottom_to_left"]],
          ["img", "<img />", ["main", "img", "bottom_to_left"]],
          ["p2", "<p />", ["main", "p2", "bottom_to_left"]],
          [
            "likeButton_button",
            "<button className='outline' />",
            ["main", "likeButton_button", "bottom_to_left"],
          ],
          [
            "svg_heart_outline",
            "<svg />",
            ["likeButton_button", "svg_heart_outline", "bottom_to_left"],
          ],
          [
            "likeButton_span",
            "<span>100</span>",
            ["likeButton_button", "likeButton_span", "bottom_to_left"],
          ],
        ] as const;

        subSteps.forEach(([id, content, connections], i) => {
          if (i === index - 2) {
            // @ts-ignore
            setCommitFlowState((prev) => ({
              ...prev,
              domTreeConnections: [
                ...(prev.domTreeConnections ?? []),
                connections,
              ],
              domTreeNodes: {
                ...prev.domTreeNodes,
                [id]: TreeNodes.div(
                  {
                    color: "green",
                    className: "opacity-100",
                    layoutId: `dom_${id}`,
                  },
                  content,
                ),
              },
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
            domTreeNodes: {
              ...prev.domTreeNodes,
              main: TreeNodes.div(
                {
                  color: "green",
                  className: "opacity-100",
                },
                "<main />",
              ),
            },
          }));
        }
      }),

      () => {
        setAppStatus("loaded");
        setCommitFlowState((prev) => ({
          ...prev,
          active: false,
          domTreeNodes: {
            ...Object.fromEntries(
              Object.entries(prev.domTreeNodes ?? {}).map(
                ([id, node]: [string, any]) => {
                  return [
                    id,
                    TreeNodes.div(
                      {
                        ...node.props,
                        color: "tranparent",
                      },
                      node.props.children,
                    ),
                  ];
                },
              ),
            ),
          },
          domChanges: [],
          domTreeRenderFn: (nodes) => (
            <Grid className="gap-4 gap-x-2">
              <GridItem col={1} row={1} children={nodes.root} />
              <GridItem col={2} row={2} children={nodes.main} />
              <GridItem col={3} row={3} children={nodes.h1} />
              <GridItem col={3} row={4} children={nodes.p} />
              <GridItem col={3} row={5} children={nodes.img} />
              <GridItem col={3} row={6} children={nodes.p2} />
              <GridItem col={4} row={7} children={nodes.likeButton_button} />
              <GridItem col={5} row={8} children={nodes.svg_heart_outline} />
              <GridItem col={5} row={9} children={nodes.likeButton_span} />
            </Grid>
          ),
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
          active: true,
          renderTreeNodes: {
            ...Object.fromEntries(
              Object.entries(prev.renderTreeNodes ?? {}).map(
                ([id, node]: [string, any]) => {
                  return [
                    id,
                    TreeNodes.div(
                      {
                        ...node.props,
                        color: "transparent",
                        focus: id === "likeButton",
                      },
                      node.props.children,
                    ),
                  ];
                },
              ),
            ),
            likeButton_button_2: TreeNodes.div(
              {},
              "<button className='filled' />",
            ),
            likeButton_span_2: TreeNodes.div({}, "<span>101</span>"),

            svg_heart_outline_2: TreeNodes.div({}, "<svg />"),
          },
        }));
      },
      () => {
        setReconciliationFlowState((prev) => ({
          ...prev,
          renderTreeConnections: [
            ...(prev.renderTreeConnections ?? []),
            ["likeButton_button_2", "likeButton_span_2", "bottom_to_left"],
            ["likeButton_button_2", "svg_heart_outline_2", "bottom_to_left"],
          ],
          renderTreeRenderFn: (nodes) => (
            <Grid className="gap-4 gap-x-2">
              <GridItem col={1} row={1} children={nodes.post} />
              <GridItem col={2} row={2} children={nodes.main} />
              <GridItem col={3} row={3} children={nodes.h1} />
              <GridItem col={3} row={4} children={nodes.p} />
              <GridItem col={3} row={5} children={nodes.img} />
              <GridItem col={3} row={6} children={nodes.p2} />
              <GridItem col={3} row={7} children={nodes.likeButton} />
              <GridItem col={4} row={8} children={nodes.likeButton_button} />
              <GridItem col={5} row={9} children={nodes.svg_heart_outline} />
              <GridItem col={5} row={10} children={nodes.likeButton_span} />
              <GridItem col={4} row={11} children={nodes.likeButton_button_2} />
              <GridItem col={5} row={12} children={nodes.svg_heart_outline_2} />
              <GridItem col={5} row={13} children={nodes.likeButton_span_2} />
            </Grid>
          ),
        }));
      },
      ...[
        ["likeButton_button", "likeButton_button_2", "tranparent"],
        ["likeButton_button", "likeButton_button_2", "yellow"],
        ["svg_heart_outline", "svg_heart_outline_2", "transparent"],
        ["likeButton_span", "likeButton_span_2", "transparent"],
        ["likeButton_span", "likeButton_span_2", "yellow"],
      ].map((item, index) => async () => {
        setReconciliationFlowState((prev) => ({
          ...prev,
          renderTreeNodes: {
            ...Object.fromEntries(
              Object.entries(prev.renderTreeNodes ?? {}).map(
                ([id, node]: [string, any]) => {
                  return [
                    id,
                    TreeNodes.div(
                      {
                        ...node.props,
                        focus: id === item[0] || id === item[1],
                        color:
                          id === item[0] || id === item[1]
                            ? item[2]
                            : node.props.color,
                      },
                      item[2] === "yellow" && id === item[0]
                        ? prev.renderTreeNodes[item[1]].props.children
                        : node.props.children,
                    ),
                  ];
                },
              ),
            ),
          },
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
          renderTreeNodes: {
            ...Object.fromEntries(
              Object.entries(prev.renderTreeNodes ?? {})
                .filter(([id]) => !removedNodes.includes(id))
                .map(([id, node]: [string, any]) => [
                  id,
                  TreeNodes.div(
                    {
                      ...node.props,
                      focus: false,
                      color: "transparent",
                    },
                    node.props.children,
                  ),
                ]),
            ),
          },
        }));

        setCommitFlowState((prev) => ({
          ...prev,
          active: true,
          domChanges: [
            {
              id: "1",
              content: <Rect size="xs" color="yellow" children="<button />" />,
              codeLabel: "button.setAttribute('className', 'filled')",
            },
            {
              id: "2",
              content: <Rect size="xs" color="yellow" children="<span/>" />,
              codeLabel: "span.innerText = '101'",
            },
          ],
        }));
      },
      ...[
        ["1", "likeButton_button", "yellow", "<button className='filled' />"],
        ["2", "likeButton_span", "yellow", "<span>101</span>"],
      ].map((item, index) => async () => {
        setCommitFlowState((prev) => ({
          ...prev,
          domTreeNodes: {
            ...Object.fromEntries(
              Object.entries(prev.domTreeNodes ?? {}).map(
                ([id, node]: [string, any]) => {
                  return [
                    id,
                    TreeNodes.div(
                      {
                        ...node.props,
                        color: id === item[1] ? item[2] : node.props.color,
                      },
                      id === item[1] ? item[3] : node.props.children,
                    ),
                  ];
                },
              ),
            ),
          },
          domChanges: prev.domChanges?.map((c, i) => ({
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
          domTreeNodes: {
            ...Object.fromEntries(
              Object.entries(prev.domTreeNodes ?? {}).map(
                ([id, node]: [string, any]) => {
                  return [
                    id,
                    TreeNodes.div(
                      {
                        ...node.props,
                        color: "transparent",
                      },
                      node.props.children,
                    ),
                  ];
                },
              ),
            ),
          },
        }));
      },
    ];

    steps.forEach((step, _index) => {
      let index = _index + stepsLen;
      deckSteps.addStep(slideIndex, createStep(getId(index), step, index));
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex-1 flex gap-8">
        <TriggerFlow {...triggerFlowState} />
        <ReconciliationFlow {...reconciliationFlowState} />
        <CommitFlow {...commitFlowState} />
      </div>

      <div className="flex gap-10">
        <BrowserUI className="h-[500px] w-[350px] transform scale-75 absolute bottom-4 left-4 origin-bottom-left hover:scale-100 transition-all">
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
  renderTreeNodes = {},
  renderTreeConnections,
  renderTreeRenderFn,
  active,
}: {
  components?: ComponentFlowItemProps[];
  renderTreeNodes?: FlowChartProps<any>["nodes"];
  renderTreeConnections?: FlowChartProps<any>["connections"];
  renderTreeRenderFn?: FlowChartProps<any>["children"];
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
            nodes={renderTreeNodes}
            connections={renderTreeConnections}
            children={renderTreeRenderFn}
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
  domTreeRenderFn,
}: {
  domChanges?: DomChanges[];
  domTreeNodes?: FlowChartProps<any>["nodes"];
  domTreeConnections?: FlowChartProps<any>["connections"];
  domTreeRenderFn?: FlowChartProps<any>["children"];
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
            nodes={domTreeNodes}
            connections={domTreeConnections}
            children={domTreeRenderFn}
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
