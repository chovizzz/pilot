import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";

interface FeatureIconsItemData {
  icon?: WeaverseImage | string;
  title?: string;
  description?: string;
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
    bgColor = "#FFF5E6",
    iconColor = "#FF6B35",
    textColor = "#000000",
  } = props as FeatureIconsItemData & typeof props;
  const animation = useAnimation();

  // Extract image URL from WeaverseImage object or string
  const iconUrl = icon 
    ? (typeof icon === "string" ? icon : icon.url)
    : null;

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center p-6 rounded-lg"
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      data-motion="fade-up"
      {...animation}
    >
      {iconUrl && (
        <div className="mb-4 flex items-center justify-center">
          <img
            src={iconUrl}
            alt={title || ""}
            className="w-12 h-12 object-contain"
          />
        </div>
      )}
      {title && (
        <h3 
          className="font-semibold text-base mb-2"
          style={{ color: textColor }}
        >
          {title}
        </h3>
      )}
      {description && (
        <p 
          className="text-sm leading-relaxed"
          style={{ color: textColor }}
        >
          {description}
        </p>
      )}
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
          type: "richtext",
          name: "description",
          label: "Description",
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

