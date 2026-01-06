import {
  createSchema,
  type HydrogenComponentProps,
  useChildInstances,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";
import { FeatureIconsItem } from "./item";

interface FeatureIconsGridData {
  columns?: number;
  gap?: number;
}

export const FeatureIconsGrid = forwardRef<
  HTMLDivElement,
  HydrogenComponentProps<FeatureIconsGridData>
>((props, ref) => {
  const { columns = 2, gap = 16, ...rest } = props as FeatureIconsGridData & typeof props;
  const childInstances = useChildInstances();
  const animation = useAnimation();

  return (
    <div
      ref={ref}
      {...rest}
      className={`grid gap-${gap / 4}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      }}
      data-motion="fade-up"
      {...animation}
    >
      {childInstances.map((child, index) => (
        <FeatureIconsItem key={`item-${index}`} {...(child.data as any)} />
      ))}
    </div>
  );
});

FeatureIconsGrid.displayName = "FeatureIconsGrid";

export default FeatureIconsGrid;

export const schema = createSchema({
  type: "feature-icons--grid",
  title: "Feature Icons Grid",
  childTypes: ["feature-icons--item"],
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "columns",
          label: "Columns",
          defaultValue: 2,
          configs: {
            min: 1,
            max: 6,
            step: 1,
          },
        },
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
      ],
    },
  ],
  presets: {
    columns: 2,
    gap: 16,
    children: [
      {
        type: "feature-icons--item",
        icon: "https://via.placeholder.com/64",
        title: "Feature 1",
        bgColor: "#FFF5E6",
        iconColor: "#FF6B35",
        textColor: "#000000",
      },
      {
        type: "feature-icons--item",
        icon: "https://via.placeholder.com/64",
        title: "Feature 2",
        bgColor: "#FFF5E6",
        iconColor: "#FF6B35",
        textColor: "#000000",
      },
      {
        type: "feature-icons--item",
        icon: "https://via.placeholder.com/64",
        title: "Feature 3",
        bgColor: "#FFF5E6",
        iconColor: "#FF6B35",
        textColor: "#000000",
      },
      {
        type: "feature-icons--item",
        icon: "https://via.placeholder.com/64",
        title: "Feature 4",
        bgColor: "#FFF5E6",
        iconColor: "#FF6B35",
        textColor: "#000000",
      },
    ],
  },
});

