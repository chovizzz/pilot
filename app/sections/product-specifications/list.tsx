import {
  createSchema,
  type HydrogenComponentProps,
  useChildInstances,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";
import { ProductSpecificationsItem } from "./item";

export const ProductSpecificationsList = forwardRef<
  HTMLDivElement,
  HydrogenComponentProps
>((props, ref) => {
  const childInstances = useChildInstances();
  const animation = useAnimation();

  return (
    <div
      ref={ref}
      {...props}
      className="space-y-2"
      data-motion="fade-up"
      {...animation}
    >
      {childInstances.map((child) => (
        <ProductSpecificationsItem
          key={child.id}
          {...(child.data as any)}
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
  settings: [],
  presets: {
    children: [
      {
        type: "product-specifications--item",
        label: "Power",
        value: "60W",
      },
      {
        type: "product-specifications--item",
        label: "Voltage",
        value: "110-240V",
      },
    ],
  },
});

