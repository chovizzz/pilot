import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, sectionSettings } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";

interface ProductSpecificationsData {
  heading?: string;
  productImage?: WeaverseImage | string;
  productImageLink?: string;
  maxWidth?: number;
  bgColor?: string;
  boxBgColor?: string;
  headingColor?: string;
}

type ProductSpecificationsProps =
  HydrogenComponentProps<ProductSpecificationsData>;

export const ProductSpecifications = forwardRef<
  HTMLElement,
  ProductSpecificationsProps
>((props, ref) => {
  const {
    heading = "Product Specifications",
    productImage,
    productImageLink,
    maxWidth = 500,
    bgColor = "#ffffff",
    boxBgColor = "#F9F8F8",
    headingColor = "#000000",
    children,
    ...rest
  } = props as ProductSpecificationsData & typeof props;
  const animation = useAnimation();

  // Extract image URL from WeaverseImage object or string
  const imageUrl = productImage 
    ? (typeof productImage === "string" ? productImage : productImage.url)
    : null;

  return (
    <Section
      ref={ref}
      {...rest}
      style={{ backgroundColor: bgColor }}
      data-motion="fade-up"
      {...animation}
    >
      <div className="w-full mx-auto leading-tight" style={{ backgroundColor: bgColor }}>
        <div
          className="main-content mx-auto"
          style={{
            padding: 0,
            maxWidth: `${maxWidth}px`,
          }}
        >
          {/* Specifications Box */}
          <div
            className="rounded-[7.5px] mb-[30px]"
            style={{
              padding: "25px 22px",
              backgroundColor: boxBgColor,
            }}
          >
            {heading && (
              <div
                className="mb-5 text-center font-bold"
                style={{
                  color: headingColor,
                  fontSize: "24px",
                }}
              >
                {heading}
              </div>
            )}
            {children}
          </div>

          {/* Product Image */}
          {imageUrl && (
            <a
              href={productImageLink || "#"}
              className="h-auto mx-auto block"
            >
              <div
                className="mx-auto imgage-section-container"
                style={{
                  maxWidth: "230px",
                  aspectRatio: "600 / 800",
                }}
              >
                <img
                  src={imageUrl}
                  alt="Product"
                  className="w-full h-full object-contain"
                />
              </div>
            </a>
          )}
        </div>
      </div>
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
          type: "image",
          name: "productImage",
          label: "Product Image",
        },
        {
          type: "text",
          name: "productImageLink",
          label: "Product Image Link",
          helpText: "Optional link for the product image",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "maxWidth",
          label: "Max Width",
          defaultValue: 500,
          configs: {
            min: 300,
            max: 800,
            step: 10,
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
          name: "bgColor",
          label: "Background Color",
          defaultValue: "#ffffff",
        },
        {
          type: "color",
          name: "boxBgColor",
          label: "Box Background Color",
          defaultValue: "#F9F8F8",
        },
        {
          type: "color",
          name: "headingColor",
          label: "Heading Color",
          defaultValue: "#000000",
        },
      ],
    },
    ...sectionSettings,
  ],
  presets: {
    heading: "Product Specifications",
    maxWidth: 500,
    bgColor: "#ffffff",
    boxBgColor: "#F9F8F8",
    headingColor: "#000000",
    children: [
      {
        type: "product-specifications--list",
      },
    ],
  },
});

