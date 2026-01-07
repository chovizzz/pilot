import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";
import { Image } from "~/components/image";

interface ProductInfoItemData {
  title?: string;
  description?: string;
  image?: WeaverseImage | string;
  backgroundColor?: string;
  textColor?: string;
  stickyTop?: number;
  padding?: number;
  borderRadius?: number;
  titleFontSize?: number;
  descriptionFontSize?: number;
}

type ProductInfoItemProps = HydrogenComponentProps<ProductInfoItemData>;

export const ProductInfoItem = forwardRef<
  HTMLDivElement,
  ProductInfoItemProps
>((props, ref) => {
  const {
    title,
    description,
    image,
    backgroundColor = "#ef7b2e",
    textColor = "#ffffff",
    stickyTop = 20,
    padding = 20,
    borderRadius = 12,
    titleFontSize = 22,
    descriptionFontSize = 16,
    ...rest
  } = props as ProductInfoItemData & typeof props;
  const animation = useAnimation();

  // Prepare image data for Image component
  const imageData: Partial<WeaverseImage> | undefined = image
    ? typeof image === "string"
      ? { url: image, altText: title || "Product feature" }
      : image
    : undefined;

  return (
    <div
      ref={ref}
      {...rest}
      className="product-info-item sticky rounded-xl overflow-hidden"
      style={{
        backgroundColor,
        color: textColor,
        padding: `${padding}px`,
        top: `${stickyTop}px`,
        borderRadius: `${borderRadius}px`,
      }}
      data-motion="fade-up"
      {...animation}
    >
      {title && (
        <div
          className="product-info-item-title mb-1 font-bold text-center"
          style={{
            fontSize: `${titleFontSize}px`,
            color: textColor,
          }}
        >
          {title}
        </div>
      )}
      {description && (
        <div
          className="product-info-item-subtitle mb-4 text-center"
          style={{
            fontSize: `${descriptionFontSize}px`,
            color: textColor,
          }}
        >
          <p>{description}</p>
        </div>
      )}
      {imageData && (
        <div className="image-section-container rounded-xl overflow-hidden w-full">
          <Image
            data={imageData}
            alt={title || "Product feature"}
            className="w-full h-auto object-contain rounded-xl"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 600px"
            aspectRatio="600/736"
          />
        </div>
      )}
    </div>
  );
});

ProductInfoItem.displayName = "ProductInfoItem";

export default ProductInfoItem;

export const schema = createSchema({
  type: "product-info--item",
  title: "Product Info Item",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "title",
          label: "Title",
          defaultValue: "Super Bright LED",
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          defaultValue: "1,000 lumens of natural 5,000K light",
        },
        {
          type: "image",
          name: "image",
          label: "Image",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "stickyTop",
          label: "Sticky Top Offset",
          defaultValue: 20,
          configs: {
            min: 0,
            max: 200,
            step: 10,
            unit: "px",
          },
          helpText:
            "Distance from top when item becomes sticky. Increase for each item to create a stacking effect.",
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
        {
          type: "range",
          name: "borderRadius",
          label: "Border Radius",
          defaultValue: 12,
          configs: {
            min: 0,
            max: 50,
            step: 2,
            unit: "px",
          },
        },
      ],
    },
    {
      group: "Typography",
      inputs: [
        {
          type: "range",
          name: "titleFontSize",
          label: "Title Font Size",
          defaultValue: 22,
          configs: {
            min: 12,
            max: 48,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "descriptionFontSize",
          label: "Description Font Size",
          defaultValue: 16,
          configs: {
            min: 10,
            max: 32,
            step: 1,
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
          defaultValue: "#ef7b2e",
        },
        {
          type: "color",
          name: "textColor",
          label: "Text Color",
          defaultValue: "#ffffff",
        },
      ],
    },
  ],
  presets: {
    title: "Super Bright LED",
    description: "1,000 lumens of natural 5,000K light",
    backgroundColor: "#ef7b2e",
    textColor: "#ffffff",
    stickyTop: 20,
  },
});

