import {
  createSchema,
  type HydrogenComponentProps,
  useChildInstances,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";
import { ProductSpecificationsItem } from "./item";

interface ProductSpecificationsListData {
  dotSize?: number;
}

export const ProductSpecificationsList = forwardRef<
  HTMLDivElement,
  HydrogenComponentProps<ProductSpecificationsListData>
>((props, ref) => {
  const { dotSize = 5, ...rest } = props as ProductSpecificationsListData & typeof props;
  const childInstances = useChildInstances();
  const animation = useAnimation();

  return (
    <div
      ref={ref}
      {...rest}
      className="product-info-12-list space-y-5"
      data-motion="fade-up"
      {...animation}
    >
      {childInstances.map((child, index) => (
        <ProductSpecificationsItem
          key={`spec-item-${index}`}
          {...(child.data as any)}
          dotSize={dotSize}
        />
      ))}
    </div>
  );
});

ProductSpecificationsList.displayName = "ProductSpecificationsList";

export default ProductSpecificationsList;

export const schema = createSchema({
  type: "product-specifications--list",
  title: "Specifications List",
  childTypes: ["product-specifications--item"],
  settings: [
    {
      group: "Dot",
      inputs: [
        {
          type: "range",
          name: "dotSize",
          label: "Dot Size",
          defaultValue: 5,
          configs: {
            min: 3,
            max: 20,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    dotSize: 5,
    children: [
      {
        type: "product-specifications--item",
        label: "Input Voltage:",
        value: "85-265v (V)",
      },
      {
        type: "product-specifications--item",
        label: "Luminous flux:",
        value: "90 (lm)",
      },
      {
        type: "product-specifications--item",
        label: "Beam angle:",
        value: "270 (degrees)",
      },
      {
        type: "product-specifications--item",
        label: "Main Application Scene:",
        value: "Home",
      },
    ],
  },
});

