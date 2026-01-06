import {
  createSchema,
  type HydrogenComponentProps,
  useChildInstances,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";
import { PainPointSolutionItem } from "./item";

interface PainPointSolutionItemsData {
  layout?: "vertical" | "horizontal";
  gap?: number;
}

export const PainPointSolutionItems = forwardRef<
  HTMLDivElement,
  HydrogenComponentProps<PainPointSolutionItemsData>
>((props, ref) => {
  const { layout = "vertical", gap = 24, ...rest } = props as PainPointSolutionItemsData & typeof props;
  const childInstances = useChildInstances();
  const animation = useAnimation();

  return (
    <div
      ref={ref}
      {...rest}
      className={`flex flex-${layout === "horizontal" ? "row" : "col"} gap-${gap / 4}`}
      style={{ gap: `${gap}px` }}
      data-motion="fade-up"
      {...animation}
    >
      {childInstances.map((child, index) => (
        <PainPointSolutionItem key={`pain-point-${index}`} {...(child.data as any)} />
      ))}
    </div>
  );
});

PainPointSolutionItems.displayName = "PainPointSolutionItems";

export default PainPointSolutionItems;

export const schema = createSchema({
  type: "pain-point-solution--items",
  title: "Pain Point Items",
  childTypes: ["pain-point-solution--item"],
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "layout",
          label: "Layout",
          defaultValue: "vertical",
          configs: {
            options: [
              { value: "vertical", label: "Vertical" },
              { value: "horizontal", label: "Horizontal" },
            ],
          },
        },
        {
          type: "range",
          name: "gap",
          label: "Gap",
          defaultValue: 24,
          configs: {
            min: 8,
            max: 48,
            step: 4,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    layout: "vertical",
    gap: 24,
    children: [
      {
        type: "pain-point-solution--item",
        painPoint: "Problem",
        solution: "Solution",
      },
    ],
  },
});

