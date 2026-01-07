import {
  createSchema,
  type HydrogenComponentProps,
  useChildInstances,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";
import { PainPointSolutionItem } from "./item";

interface PainPointSolutionItemsData {
  gap?: number;
  itemWidth?: number;
  paddingBottom?: number;
}

export const PainPointSolutionItems = forwardRef<
  HTMLDivElement,
  HydrogenComponentProps<PainPointSolutionItemsData>
>((props, ref) => {
  const { gap = 16, itemWidth = 80, paddingBottom = 24, ...rest } = props as PainPointSolutionItemsData & typeof props;
  const childInstances = useChildInstances();
  const animation = useAnimation();

  // Custom scrollbar styles
  const scrollbarStyles = `
    .comment14-list::-webkit-scrollbar {
      height: 4px;
    }
    .comment14-list::-webkit-scrollbar-track {
      background: #e4e4e4;
      border-radius: 2px;
    }
    .comment14-list::-webkit-scrollbar-track-piece {
      background: #e4e4e4;
      border-radius: 2px;
      margin-left: 0;
      margin-right: 0;
    }
    .comment14-list::-webkit-scrollbar-thumb {
      background: #262626;
      border-radius: 2px;
    }
    .comment14-list::-webkit-scrollbar-thumb:hover {
      background: #000000;
    }
    /* Firefox */
    .comment14-list {
      scrollbar-width: thin;
      scrollbar-color: #262626 #e4e4e4;
    }
  `;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div
        ref={ref}
        {...rest}
        className="comment14-list flex overflow-x-auto pb-6"
        style={{
          gap: `${gap}px`,
          paddingBottom: `${paddingBottom}px`,
        }}
        data-motion="fade-up"
        {...animation}
      >
        {childInstances.map((child, index) => (
          <PainPointSolutionItem
            key={`pain-point-${index}`}
            itemWidth={itemWidth}
            {...(child.data as any)}
          />
        ))}
      </div>
    </>
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
          type: "range",
          name: "gap",
          label: "Gap",
          defaultValue: 16,
          configs: {
            min: 8,
            max: 48,
            step: 4,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "itemWidth",
          label: "Item Width (%)",
          defaultValue: 80,
          configs: {
            min: 60,
            max: 100,
            step: 5,
            unit: "%",
          },
          helpText: "Width of each item as percentage of container",
        },
        {
          type: "range",
          name: "paddingBottom",
          label: "Padding Bottom",
          defaultValue: 24,
          configs: {
            min: 0,
            max: 60,
            step: 4,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    gap: 16,
    itemWidth: 80,
    paddingBottom: 24,
    children: [
      {
        type: "pain-point-solution--item",
        painPointTitle: "Pain Point 1",
        painPoint: "Traditional fans take up valuable floor space",
        solutionTitle: "Ceiling Fan with LED Light:",
        solution: "Screw-in ceiling fan that fits any standard light socket - no space wasted!",
      },
    ],
  },
});

