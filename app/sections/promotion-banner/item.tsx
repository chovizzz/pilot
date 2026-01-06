import {
  createSchema,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";

interface PromotionBannerItemData {
  title?: string;
  description?: string;
  showStar?: boolean;
  starIcon?: WeaverseImage | string;
  leftIcon?: WeaverseImage | string;
  titleColor?: string;
  descriptionColor?: string;
  titleSize?: number;
  descriptionSize?: number;
}

type PromotionBannerItemProps =
  HydrogenComponentProps<PromotionBannerItemData>;

export const PromotionBannerItem = forwardRef<
  HTMLDivElement,
  PromotionBannerItemProps
>((props, ref) => {
  const {
    title,
    description,
    showStar = false,
    starIcon,
    leftIcon,
    titleColor = "#000000",
    descriptionColor = "#000000",
    titleSize = 14,
    descriptionSize = 12,
  } = props as PromotionBannerItemData & typeof props;

  // Extract image URLs from WeaverseImage objects or strings
  const leftIconUrl = leftIcon 
    ? (typeof leftIcon === "string" ? leftIcon : leftIcon.url)
    : null;
  const starIconUrl = starIcon 
    ? (typeof starIcon === "string" ? starIcon : starIcon.url)
    : null;

  return (
    <div
      ref={ref}
      className="shrink-0 flex items-center gap-2"
      style={{ 
        minWidth: "fit-content",
        width: "100%",
        minHeight: "fit-content",
      }}
    >
      {leftIconUrl && (
        <img
          src={leftIconUrl}
          alt=""
          className="w-8 h-8 object-contain shrink-0"
        />
      )}
      <div className="flex-1 flex flex-col gap-0.5">
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
      {showStar && starIconUrl && (
        <img
          src={starIconUrl}
          alt=""
          className="w-6 h-6 object-contain shrink-0"
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

