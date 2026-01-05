import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";

interface ProductSpecificationsItemData {
  label?: string;
  value?: string;
}

type ProductSpecificationsItemProps =
  HydrogenComponentProps<ProductSpecificationsItemData>;

export const ProductSpecificationsItem = forwardRef<
  HTMLDivElement,
  ProductSpecificationsItemProps
>((props, ref) => {
  const { label, value } = props;
  const animation = useAnimation();

  return (
    <div
      ref={ref}
      className="flex justify-between items-center py-3 border-b border-gray-200"
      data-motion="fade-up"
      {...animation}
    >
      <span className="font-medium text-gray-700">{label}</span>
      <span className="text-gray-900">{value}</span>
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
          defaultValue: "Specification",
        },
        {
          type: "text",
          name: "value",
          label: "Value",
          defaultValue: "Value",
        },
      ],
    },
  ],
  presets: {
    label: "Specification",
    value: "Value",
  },
});

