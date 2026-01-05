import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, sectionSettings } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";

interface ProductSpecificationsData {
  heading?: string;
  subheading?: string;
}

type ProductSpecificationsProps =
  HydrogenComponentProps<ProductSpecificationsData>;

export const ProductSpecifications = forwardRef<
  HTMLElement,
  ProductSpecificationsProps
>((props, ref) => {
  const { heading, subheading, children, ...rest } = props;
  const animation = useAnimation();

  return (
    <Section ref={ref} {...rest} data-motion="fade-up" {...animation}>
      {heading && (
        <h2 className="text-3xl font-bold mb-4 text-center">{heading}</h2>
      )}
      {subheading && (
        <p className="text-gray-600 mb-8 text-center">{subheading}</p>
      )}
      {children}
    </Section>
  );
});

ProductSpecifications.displayName = "ProductSpecifications";

export default ProductSpecifications;

export const schema = createSchema({
  type: "product-specifications",
  title: "Product Specifications",
  childTypes: ["product-specifications--list"],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Product Specifications",
        },
        {
          type: "richtext",
          name: "subheading",
          label: "Subheading",
        },
      ],
    },
    ...sectionSettings,
  ],
  presets: {
    heading: "Product Specifications",
    children: [
      {
        type: "product-specifications--list",
      },
    ],
  },
});

