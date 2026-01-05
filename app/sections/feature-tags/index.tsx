import {
  createSchema,
  type HydrogenComponentProps,
  useChildInstances,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";
import { FeatureTagItem } from "./item";

interface FeatureTagsData {
  gap?: number;
}

export const FeatureTags = forwardRef<HTMLDivElement, HydrogenComponentProps<FeatureTagsData>>(
  (props, ref) => {
    const { gap = 8 } = props;
    const childInstances = useChildInstances();
    const animation = useAnimation();

    return (
      <div
        ref={ref}
        {...props}
        className="flex flex-wrap items-center justify-center gap-2"
        style={{ gap: `${gap}px` }}
        data-motion="fade-up"
        {...animation}
      >
        {childInstances.map((child) => (
          <FeatureTagItem key={child.id} {...(child.data as any)} />
        ))}
      </div>
    );
  }
);

FeatureTags.displayName = "FeatureTags";

export default FeatureTags;

export const schema = createSchema({
  type: "feature-tags",
  title: "Feature Tags",
  childTypes: ["feature-tag--item"],
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "gap",
          label: "Gap",
          defaultValue: 8,
          configs: {
            min: 4,
            max: 16,
            step: 2,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    gap: 8,
    children: [
      {
        type: "feature-tag--item",
        text: "Bright Light",
      },
      {
        type: "feature-tag--item",
        text: "Quiet Fan",
      },
    ],
  },
});

