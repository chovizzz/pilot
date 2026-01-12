import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Image } from "~/components/image";

interface PromotionBannerItemData {
  id?: string;
  title?: string;
  description?: string;
  showStar?: boolean;
  starIcon?: WeaverseImage | string;
  leftIcon?: WeaverseImage | string;
  titleColor?: string;
  descriptionColor?: string;
  titleSize?: number;
  descriptionSize?: number;
  textAlign?: "left" | "center" | "right";
}

type PromotionBannerItemProps =
  HydrogenComponentProps<PromotionBannerItemData>;

export const PromotionBannerItem = forwardRef<
  HTMLDivElement,
  PromotionBannerItemProps
>((props, ref) => {
  const {
    id,
    title,
    description,
    showStar = false,
    starIcon,
    leftIcon,
    titleColor = "#000000",
    descriptionColor = "#000000",
    titleSize = 14,
    descriptionSize = 12,
    textAlign = "left",
  } = props as PromotionBannerItemData & typeof props;

  // Prepare image data for Image component
  const leftIconData: Partial<WeaverseImage> | undefined = leftIcon
    ? typeof leftIcon === "string"
      ? { url: leftIcon, altText: "Left icon" }
      : leftIcon
    : undefined;
  const starIconData: Partial<WeaverseImage> | undefined = starIcon
    ? typeof starIcon === "string"
      ? { url: starIcon, altText: "Star icon" }
      : starIcon
    : undefined;

  return (
    <div
      ref={ref}
      id={id}
      className="shrink-0 flex items-center gap-2"
      style={{ 
        minWidth: "fit-content",
        width: "100%",
        minHeight: "fit-content",
      }}
    >
      {leftIconData && (
        <Image
          data={leftIconData}
          alt=""
          className="w-8 h-8 object-contain shrink-0"
          loading="lazy"
          sizes="auto"
        />
      )}
      <div
        className="flex-1 flex flex-col gap-0.5"
        style={{ textAlign }}
      >
        {title && (
          <div
            style={{
              color: titleColor,
              fontSize: `${titleSize}px`,
              fontWeight: 600,
              lineHeight: "1.3",
            }}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
        {description && (
          <div
            style={{
              color: descriptionColor,
              fontSize: `${descriptionSize}px`,
              fontWeight: 400,
              lineHeight: "1.3",
            }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
      {showStar && starIconData && (
        <Image
          data={starIconData}
          alt=""
          className="w-6 h-6 object-contain shrink-0"
          loading="lazy"
          sizes="auto"
        />
      )}
    </div>
  );
});

PromotionBannerItem.displayName = "PromotionBannerItem";

export default PromotionBannerItem;

export const schema = createSchema({
  type: "promotion-banner--item",
  title: "Promotion Banner Item",
  settings: [
    {
      group: "Layout",
      inputs: [
        {
          type: "text",
          name: "id",
          label: "Element ID",
          helpText: "Set a unique ID for anchor links (e.g., 'promo-banner-1'). Leave empty to auto-generate.",
        },
      ],
    },
    {
      group: "Content",
      inputs: [
        {
          type: "textarea",
          name: "title",
          label: "Title",
          defaultValue: "🏆 Must-Have Home Upgrade",
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          defaultValue: "Trusted by 10,000+ Households",
        },
        {
          type: "switch",
          name: "showStar",
          label: "Show Star Icon",
          defaultValue: false,
        },
        {
          type: "image",
          name: "starIcon",
          label: "Star Icon",
          condition: (data: PromotionBannerItemData) => data.showStar === true,
        },
        {
          type: "image",
          name: "leftIcon",
          label: "Left Icon",
        },
      ],
    },
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "titleColor",
          label: "Title Color",
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "descriptionColor",
          label: "Description Color",
          defaultValue: "#000000",
        },
      ],
    },
    {
      group: "Typography",
      inputs: [
        {
          type: "range",
          name: "titleSize",
          label: "Title Size",
          defaultValue: 14,
          configs: {
            min: 10,
            max: 20,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "descriptionSize",
          label: "Description Size",
          defaultValue: 12,
          configs: {
            min: 10,
            max: 16,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "select",
          name: "textAlign",
          label: "Text Alignment",
          defaultValue: "left",
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "center", label: "Center" },
              { value: "right", label: "Right" },
            ],
          },
        },
      ],
    },
  ],
  presets: {
    title: "🏆 Must-Have Home Upgrade",
    description: "Trusted by 10,000+ Households",
    showStar: true,
    titleColor: "#000000",
    descriptionColor: "#000000",
  },
});

