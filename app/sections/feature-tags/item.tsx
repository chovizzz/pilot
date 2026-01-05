import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";

interface FeatureTagItemData {
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
}

type FeatureTagItemProps = HydrogenComponentProps<FeatureTagItemData>;

export const FeatureTagItem = forwardRef<HTMLButtonElement, FeatureTagItemProps>(
  (props, ref) => {
    const {
      text,
      backgroundColor = "#F5F5F5",
      textColor = "#333333",
      borderRadius = 20,
    } = props;

    return (
      <button
        ref={ref}
        className="px-4 py-2 font-medium transition-colors hover:opacity-80"
        style={{
          backgroundColor,
          color: textColor,
          borderRadius: `${borderRadius}px`,
          fontSize: "14px",
        }}
      >
        {text}
      </button>
    );
  }
);

FeatureTagItem.displayName = "FeatureTagItem";

export default FeatureTagItem;

export const schema = createSchema({
  type: "feature-tag--item",
  title: "Feature Tag",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "text",
          label: "Text",
          defaultValue: "Feature",
        },
      ],
    },
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "backgroundColor",
          label: "Background Color",
          defaultValue: "#F5F5F5",
        },
        {
          type: "color",
          name: "textColor",
          label: "Text Color",
          defaultValue: "#333333",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "borderRadius",
          label: "Border Radius",
          defaultValue: 20,
          configs: {
            min: 8,
            max: 32,
            step: 2,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    text: "Feature",
    backgroundColor: "#F5F5F5",
    textColor: "#333333",
    borderRadius: 20,
  },
});

