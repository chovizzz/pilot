import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, sectionSettings } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";

interface ProductInfoData {
  title?: string;
  subtitle?: string;
  maxWidth?: number;
  padding?: number;
  backgroundColor?: string;
}

type ProductInfoProps = HydrogenComponentProps<ProductInfoData>;

export const ProductInfo = forwardRef<HTMLElement, ProductInfoProps>(
  (props, ref) => {
    const {
      title,
      subtitle,
      maxWidth = 480,
      padding = 20,
      backgroundColor = "#ffffff",
      children,
      ...rest
    } = props as ProductInfoData & typeof props;
    const animation = useAnimation();

    // Create responsive maxWidth style that only applies on lg (1024px) and above
    // If maxWidth is 0 or falsy, don't apply max-width (unlimited)
    const responsiveMaxWidthStyle = maxWidth && maxWidth > 0 ? `
      .product-info-responsive {
        width: 100%;
      }
      @media (min-width: 1024px) {
        .product-info-responsive {
          max-width: ${maxWidth}px;
        }
      }
    ` : `
      .product-info-responsive {
        width: 100%;
      }
    `;

    return (
      <Section
        ref={ref}
        {...rest}
        className="product-info-responsive mx-auto"
        style={{
          backgroundColor,
        }}
        overflow="unset"
        data-motion="fade-up"
        {...animation}
      >
        <style>{responsiveMaxWidthStyle}</style>
        <div
          className="main-content max-w-7xl mx-auto"
          style={{ padding: `${padding}px` }}
        >
          {title && (
            <div
              className="product-info-title font-bold mb-2 text-center"
              style={{
                fontSize: "26px",
                color: "#191919",
              }}
            >
              {title}
            </div>
          )}
          {subtitle && (
            <div
              className="product-info-subtitle mb-4 text-center"
              style={{
                fontSize: "16px",
                color: "#3b1602",
              }}
            >
              {subtitle}
            </div>
          )}
          <div className="product-info-list space-y-4">{children}</div>
        </div>
      </Section>
    );
  }
);

ProductInfo.displayName = "ProductInfo";

export default ProductInfo;

export const schema = createSchema({
  type: "product-info",
  title: "Product Info",
  childTypes: ["product-info--item"],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "title",
          label: "Title",
          defaultValue: "Smart 2-in-1 Ceiling Fan with LED Light",
        },
        {
          type: "textarea",
          name: "subtitle",
          label: "Subtitle",
          defaultValue:
            "Transform any room with this space-saving innovation that combines powerful air circulation with brilliant lighting.",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "text",
          name: "id",
          label: "Section ID",
          helpText: "Set a unique ID for anchor links (e.g., 'product-info'). Leave empty to auto-generate.",
        },
        {
          type: "range",
          name: "maxWidth",
          label: "Max Width",
          defaultValue: 480,
          configs: {
            min: 0,
            max: 1600,
            step: 20,
            unit: "px",
          },
          helpText:
            "Maximum width on large screens (1024px and above). Set to 0 for unlimited width.",
        },
        {
          type: "range",
          name: "padding",
          label: "Padding",
          defaultValue: 20,
          configs: {
            min: 0,
            max: 100,
            step: 5,
            unit: "px",
          },
        },
      ],
    },
    {
      group: "Style",
      inputs: [
        {
          type: "color",
          name: "backgroundColor",
          label: "Background Color",
          defaultValue: "#ffffff",
        },
      ],
    },
    ...sectionSettings,
  ],
  presets: {
    title: "Smart 2-in-1 Ceiling Fan with LED Light",
    subtitle:
      "Transform any room with this space-saving innovation that combines powerful air circulation with brilliant lighting.",
    children: [
      {
        type: "product-info--item",
        title: "Super Bright LED",
        description: "1,000 lumens of natural 5,000K light",
        backgroundColor: "#ef7b2e",
        textColor: "#ffffff",
        stickyTop: 20,
      },
      {
        type: "product-info--item",
        title: "3 Speed Fan",
        description: "Adjustable airflow for perfect comfort",
        backgroundColor: "#fae2d2",
        textColor: "#000000",
        stickyTop: 40,
      },
    ],
  },
});

