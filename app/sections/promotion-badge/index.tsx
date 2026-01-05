import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";

interface PromotionBadgeData {
  topText?: string;
  bottomText?: string;
  backgroundColor?: string;
  textColor?: string;
  size?: "small" | "medium" | "large";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  offsetX?: number;
  offsetY?: number;
}

type PromotionBadgeProps = HydrogenComponentProps<PromotionBadgeData>;

export const PromotionBadge = forwardRef<HTMLDivElement, PromotionBadgeProps>(
  (props, ref) => {
    const {
      topText,
      bottomText,
      backgroundColor = "#FF6B35",
      textColor = "#FFFFFF",
      size = "medium",
      position = "top-right",
      offsetX = 0,
      offsetY = 0,
    } = props;

    const animation = useAnimation();

    const sizeClasses = {
      small: "w-20 h-20 text-xs",
      medium: "w-24 h-24 text-sm",
      large: "w-32 h-32 text-base",
    };

    const positionClasses = {
      "top-left": "top-4 left-4",
      "top-right": "top-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "bottom-right": "bottom-4 right-4",
      center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    };

    return (
      <div
        ref={ref}
        className={`absolute ${positionClasses[position]} z-10 flex flex-col items-center justify-center rounded-full font-bold text-center shadow-lg`}
        style={{
          backgroundColor,
          color: textColor,
          width: size === "small" ? "80px" : size === "medium" ? "96px" : "128px",
          height: size === "small" ? "80px" : size === "medium" ? "96px" : "128px",
          transform: position === "center" 
            ? "translate(-50%, -50%)" 
            : `translate(${offsetX}px, ${offsetY}px)`,
        }}
        data-motion="fade-up"
        {...animation}
      >
        {topText && (
          <div className="text-xs leading-tight mb-0.5">{topText}</div>
        )}
        {bottomText && (
          <div className="text-xs leading-tight font-extrabold">{bottomText}</div>
        )}
      </div>
    );
  }
);

PromotionBadge.displayName = "PromotionBadge";

export default PromotionBadge;

export const schema = createSchema({
  type: "promotion-badge",
  title: "Promotion Badge",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "topText",
          label: "Top Text",
          defaultValue: "LIMITED TIME ONLY",
        },
        {
          type: "text",
          name: "bottomText",
          label: "Bottom Text",
          defaultValue: "SAVE UP TO 50%",
        },
      ],
    },
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "backgroundColor",
          label: "Background Color",
          defaultValue: "#FF6B35",
        },
        {
          type: "color",
          name: "textColor",
          label: "Text Color",
          defaultValue: "#FFFFFF",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "size",
          label: "Size",
          defaultValue: "medium",
          configs: {
            options: [
              { value: "small", label: "Small" },
              { value: "medium", label: "Medium" },
              { value: "large", label: "Large" },
            ],
          },
        },
        {
          type: "select",
          name: "position",
          label: "Position",
          defaultValue: "top-right",
          configs: {
            options: [
              { value: "top-left", label: "Top Left" },
              { value: "top-right", label: "Top Right" },
              { value: "bottom-left", label: "Bottom Left" },
              { value: "bottom-right", label: "Bottom Right" },
              { value: "center", label: "Center" },
            ],
          },
        },
        {
          type: "range",
          name: "offsetX",
          label: "Offset X",
          defaultValue: 0,
          configs: {
            min: -50,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "offsetY",
          label: "Offset Y",
          defaultValue: 0,
          configs: {
            min: -50,
            max: 50,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    topText: "LIMITED TIME ONLY",
    bottomText: "SAVE UP TO 50%",
    backgroundColor: "#FF6B35",
    textColor: "#FFFFFF",
    size: "medium",
    position: "top-right",
  },
});

