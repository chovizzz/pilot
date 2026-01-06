import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";

interface ProductSpecificationsItemData {
  label?: string;
  value?: string;
  labelColor?: string;
  valueColor?: string;
  labelSize?: number;
  valueSize?: number;
  dotColor?: string;
  dotSize?: number; // Passed from parent list
}

type ProductSpecificationsItemProps =
  HydrogenComponentProps<ProductSpecificationsItemData>;

export const ProductSpecificationsItem = forwardRef<
  HTMLDivElement,
  ProductSpecificationsItemProps
>((props, ref) => {
  const {
    label,
    value,
    labelColor = "#000000",
    valueColor = "#3E3E3E",
    labelSize = 16,
    valueSize = 18,
    dotColor = "#3E3E3E",
    dotSize = 5,
  } = props as ProductSpecificationsItemData & typeof props;
  const animation = useAnimation();

  return (
    <div
      ref={ref}
      className="product-info-12-item"
      data-motion="fade-up"
      {...animation}
    >
      {/* Label with dot */}
      <div
        className="product-info-12-item-title mb-1.5 flex items-center gap-3"
        style={{
          color: labelColor,
          fontSize: `${labelSize}px`,
        }}
      >
        <div
          className="rounded-full shrink-0"
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            backgroundColor: dotColor,
          }}
        />
        {label}
      </div>
      {/* Value */}
      <div
        className="product-info-12-item-text font-bold pl-[17px] lg:pl-[22px]"
        style={{
          color: valueColor,
          fontSize: `${valueSize}px`,
        }}
      >
        <p dangerouslySetInnerHTML={{ __html: value || "" }} />
      </div>
    </div>
  );
});

ProductSpecificationsItem.displayName = "ProductSpecificationsItem";

export default ProductSpecificationsItem;

export const schema = createSchema({
  type: "product-specifications--item",
  title: "Specification Item",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "label",
          label: "Label",
          defaultValue: "Input Voltage:",
        },
        {
          type: "richtext",
          name: "value",
          label: "Value",
          defaultValue: "85-265v (V)",
        },
      ],
    },
    {
      group: "Typography",
      inputs: [
        {
          type: "range",
          name: "labelSize",
          label: "Label Font Size",
          defaultValue: 16,
          configs: {
            min: 12,
            max: 24,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "valueSize",
          label: "Value Font Size",
          defaultValue: 18,
          configs: {
            min: 14,
            max: 28,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "labelColor",
          label: "Label Color",
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "valueColor",
          label: "Value Color",
          defaultValue: "#3E3E3E",
        },
        {
          type: "color",
          name: "dotColor",
          label: "Dot Color",
          defaultValue: "#3E3E3E",
        },
      ],
    },
  ],
  presets: {
    label: "Input Voltage:",
    value: "85-265v (V)",
    labelColor: "#000000",
    valueColor: "#3E3E3E",
    dotColor: "#3E3E3E",
  },
});

