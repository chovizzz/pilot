import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";

interface FeatureIconsItemData {
  icon?: WeaverseImage | string;
  title?: string;
  description?: string;
  layout?: "vertical" | "horizontal";
  iconWidth?: number;
  titleFontSize?: number;
  descriptionFontSize?: number;
  bgColor?: string;
  iconColor?: string;
  textColor?: string;
}

type FeatureIconsItemProps = HydrogenComponentProps<FeatureIconsItemData>;

export const FeatureIconsItem = forwardRef<
  HTMLDivElement,
  FeatureIconsItemProps
>((props, ref) => {
  const {
    icon,
    title,
    description,
    layout = "vertical",
    iconWidth = 48,
    titleFontSize = 16,
    descriptionFontSize = 14,
    bgColor = "#FFF5E6",
    iconColor = "#FF6B35",
    textColor = "#000000",
  } = props as FeatureIconsItemData & typeof props;
  const animation = useAnimation();

  // Extract image URL from WeaverseImage object or string
  const iconUrl = icon 
    ? (typeof icon === "string" ? icon : icon.url)
    : null;

  const isHorizontal = layout === "horizontal";

  return (
    <div
      ref={ref}
      className={`flex ${isHorizontal ? "flex-row items-center" : "flex-col items-center"} ${isHorizontal ? "text-left" : "text-center"} px-3 py-4 rounded-lg gap-4`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      data-motion="fade-up"
      {...animation}
    >
      {iconUrl && (
        <div className={`flex items-center justify-center ${isHorizontal ? "shrink-0" : ""}`}>
          <img
            src={iconUrl}
            alt={title || ""}
            className="object-contain"
            style={{
              width: `${iconWidth}px`,
              height: `${iconWidth}px`,
            }}
          />
        </div>
      )}
      <div className={isHorizontal ? "flex-1" : ""}>
        {title && (
          <h3 
            className={`font-semibold ${isHorizontal ? "mb-2" : "mb-2"}`}
            style={{ 
              color: textColor,
              fontSize: `${titleFontSize}px`,
            }}
          >
            {title}
          </h3>
        )}
        {description && (
          <p 
            className="leading-relaxed whitespace-pre-line"
            style={{ 
              color: textColor,
              fontSize: `${descriptionFontSize}px`,
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
});

FeatureIconsItem.displayName = "FeatureIconsItem";

export default FeatureIconsItem;

export const schema = createSchema({
  type: "feature-icons--item",
  title: "Feature Icon Item",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "image",
          name: "icon",
          label: "Icon",
        },
        {
          type: "text",
          name: "title",
          label: "Title",
          defaultValue: "Feature",
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "layout",
          label: "Layout",
          defaultValue: "vertical",
          configs: {
            options: [
              { value: "vertical", label: "Vertical (Icon Top)" },
              { value: "horizontal", label: "Horizontal (Icon Left)" },
            ],
          },
        },
        {
          type: "range",
          name: "iconWidth",
          label: "Icon Width",
          defaultValue: 48,
          configs: {
            min: 24,
            max: 120,
            step: 4,
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
          defaultValue: 16,
          configs: {
            min: 12,
            max: 32,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "descriptionFontSize",
          label: "Description Font Size",
          defaultValue: 14,
          configs: {
            min: 10,
            max: 24,
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
          name: "bgColor",
          label: "Background Color",
          defaultValue: "#FFF5E6",
        },
        {
          type: "color",
          name: "iconColor",
          label: "Icon Color",
          defaultValue: "#FF6B35",
          helpText: "Note: Icon color applies to SVG icons. For image icons, use a colored icon image.",
        },
        {
          type: "color",
          name: "textColor",
          label: "Text Color",
          defaultValue: "#000000",
        },
      ],
    },
  ],
  presets: {
    icon: "https://via.placeholder.com/64",
    title: "Feature",
  },
});

