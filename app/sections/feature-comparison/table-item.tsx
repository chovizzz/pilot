import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Image } from "~/components/image";

interface FeatureComparisonTableItemData {
  feature?: string;
  ourProduct?: string;
  competitor?: string;
  ourProductImage?: WeaverseImage | string;
  competitorImage?: WeaverseImage | string;
  imageWidth?: number;
  itemBgColor?: string;
  itemHeight?: number;
  showBorder?: boolean;
  borderColor?: string;
  rowBgColor?: string;
  rowHeight?: number;
}

type FeatureComparisonTableItemProps =
  HydrogenComponentProps<FeatureComparisonTableItemData>;

export const FeatureComparisonTableItem = forwardRef<
  HTMLTableRowElement,
  FeatureComparisonTableItemProps
>((props, ref) => {
  const {
    feature,
    ourProduct,
    competitor,
    ourProductImage,
    competitorImage,
    imageWidth = 0,
    itemBgColor,
    itemHeight,
    showBorder = true,
    borderColor = "#d1d5db",
    rowBgColor = "#ffffff",
    rowHeight = 48,
  } = props as FeatureComparisonTableItemData & typeof props;

  // Use item-specific background color if provided, otherwise use row background color
  const backgroundColor = itemBgColor || rowBgColor;
  // Use item-specific height if provided, otherwise use row height
  const height = itemHeight || rowHeight;

  // Prepare image data for Image component
  const ourProductImageData: Partial<WeaverseImage> | undefined = ourProductImage
    ? typeof ourProductImage === "string"
      ? { url: ourProductImage, altText: "Our product" }
      : ourProductImage
    : undefined;
  const competitorImageData: Partial<WeaverseImage> | undefined = competitorImage
    ? typeof competitorImage === "string"
      ? { url: competitorImage, altText: "Competitor" }
      : competitorImage
    : undefined;

  return (
    <tr
      ref={ref}
      style={{ backgroundColor, height: `${height}px` }}
      className="hover:opacity-90 transition-opacity"
    >
      <td
        className="px-4 font-medium align-middle"
        style={
          showBorder ? { border: `1px solid ${borderColor}` } : undefined
        }
      >
        {feature}
      </td>
      <td
        className="px-4 text-center align-middle"
        style={
          showBorder ? { border: `1px solid ${borderColor}` } : undefined
        }
      >
        {ourProductImageData ? (
          <Image
            data={ourProductImageData}
            alt=""
            className="mx-auto object-contain"
            style={{
              maxHeight: `${height - 8}px`,
              maxWidth: "100%",
              ...(imageWidth > 0 ? { width: `${imageWidth}px`, height: "auto" } : {}),
            }}
            loading="lazy"
            sizes="auto"
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: ourProduct || "" }} />
        )}
      </td>
      <td
        className="px-4 text-center align-middle"
        style={
          showBorder ? { border: `1px solid ${borderColor}` } : undefined
        }
      >
        {competitorImageData ? (
          <Image
            data={competitorImageData}
            alt=""
            className="mx-auto object-contain"
            style={{
              maxHeight: `${height - 8}px`,
              maxWidth: "100%",
              ...(imageWidth > 0 ? { width: `${imageWidth}px`, height: "auto" } : {}),
            }}
            loading="lazy"
            sizes="auto"
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: competitor || "" }} />
        )}
      </td>
    </tr>
  );
});

FeatureComparisonTableItem.displayName = "FeatureComparisonTableItem";

export default FeatureComparisonTableItem;

export const schema = createSchema({
  type: "feature-comparison--table-item",
  title: "Comparison Item",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "feature",
          label: "Feature Name",
          defaultValue: "Feature",
        },
        {
          type: "image",
          name: "ourProductImage",
          label: "Others Image",
        },
        {
          type: "range",
          name: "imageWidth",
          label: "Image Width",
          defaultValue: 0,
          configs: {
            min: 0,
            max: 300,
            step: 10,
            unit: "px",
          },
          helpText: "Set to 0 to use auto width (maintains aspect ratio)",
        },
        {
          type: "richtext",
          name: "ourProduct",
          label: "Others Text",
          defaultValue: "✓",
          condition: (data: FeatureComparisonTableItemData) =>
            !data.ourProductImage,
        },
        {
          type: "image",
          name: "competitorImage",
          label: "Saker Image",
        },
        {
          type: "richtext",
          name: "competitor",
          label: "Saker Text",
          defaultValue: "✗",
          condition: (data: FeatureComparisonTableItemData) =>
            !data.competitorImage,
        },
      ],
    },
    {
      group: "Style",
      inputs: [
        {
          type: "color",
          name: "itemBgColor",
          label: "Item Background Color",
          defaultValue: "",
          helpText: "Leave empty to use table default background color",
        },
        {
          type: "range",
          name: "itemHeight",
          label: "Item Height",
          defaultValue: 0,
          configs: {
            min: 0,
            max: 200,
            step: 4,
            unit: "px",
          },
          helpText: "Set to 0 to use table default row height",
        },
      ],
    },
  ],
  presets: {
    feature: "Feature",
    ourProduct: "✓",
    competitor: "✗",
  },
});

