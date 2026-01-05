import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";

interface StockAlertData {
  leftText?: string;
  rightText?: string;
  leftIcon?: WeaverseImage | string;
  leftBgColor?: string;
  rightBgColor?: string;
  leftTextColor?: string;
  rightTextColor?: string;
  leftTextSize?: number;
  rightTextSize?: number;
  sticky?: boolean;
}

type StockAlertProps = HydrogenComponentProps<StockAlertData>;

export const StockAlert = forwardRef<HTMLElement, StockAlertProps>(
  (props, ref) => {
    const {
      leftText = "Only 37 left",
      rightText = "Hurry before the price goes back up!",
      leftIcon,
      leftBgColor = "#ff0000",
      rightBgColor = "#000000",
      leftTextColor = "#ffffff",
      rightTextColor = "#ffffff",
      leftTextSize = 18,
      rightTextSize = 18,
      sticky = false,
      ...rest
    } = props as StockAlertData & typeof props;

    const animation = useAnimation();

    // Extract image URL from WeaverseImage object or string
    const leftIconUrl = leftIcon 
      ? (typeof leftIcon === "string" ? leftIcon : leftIcon.url)
      : null;

    return (
      <Section ref={ref} {...rest}>
        <div
          className={`flex items-center justify-between gap-4 px-4 py-3 ${
            sticky ? "sticky top-0 z-50" : ""
          }`}
          style={{
            backgroundColor: leftBgColor,
            background: `linear-gradient(to right, ${leftBgColor} 0%, ${rightBgColor} 100%)`,
          }}
          data-motion="fade-up"
          {...animation}
        >
          <div className="flex items-center gap-2">
            {leftIconUrl && (
              <img
                src={leftIconUrl}
                alt=""
                className="w-6 h-6 object-contain"
                style={{ width: 24, height: 24 }}
              />
            )}
            <span
              style={{
                color: leftTextColor,
                fontSize: `${leftTextSize}px`,
                fontWeight: 600,
              }}
            >
              {leftText}
            </span>
          </div>
          <span
            style={{
              color: rightTextColor,
              fontSize: `${rightTextSize}px`,
              fontWeight: 500,
            }}
          >
            {rightText}
          </span>
        </div>
      </Section>
    );
  }
);

StockAlert.displayName = "StockAlert";

export default StockAlert;

export const schema = createSchema({
  type: "stock-alert",
  title: "Stock Alert",
  limit: 1,
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "leftText",
          label: "Left Text",
          defaultValue: "Only 37 left",
        },
        {
          type: "text",
          name: "rightText",
          label: "Right Text",
          defaultValue: "Hurry before the price goes back up!",
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
          name: "leftBgColor",
          label: "Left Background Color",
          defaultValue: "#ff0000",
        },
        {
          type: "color",
          name: "rightBgColor",
          label: "Right Background Color",
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "leftTextColor",
          label: "Left Text Color",
          defaultValue: "#ffffff",
        },
        {
          type: "color",
          name: "rightTextColor",
          label: "Right Text Color",
          defaultValue: "#ffffff",
        },
      ],
    },
    {
      group: "Typography",
      inputs: [
        {
          type: "range",
          name: "leftTextSize",
          label: "Left Text Size",
          defaultValue: 18,
          configs: {
            min: 12,
            max: 32,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "rightTextSize",
          label: "Right Text Size",
          defaultValue: 18,
          configs: {
            min: 12,
            max: 32,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "switch",
          name: "sticky",
          label: "Sticky",
          defaultValue: false,
        },
      ],
    },
  ],
  presets: {
    leftText: "Only 37 left",
    rightText: "Hurry before the price goes back up!",
    leftBgColor: "#ff0000",
    rightBgColor: "#000000",
    leftTextColor: "#ffffff",
    rightTextColor: "#ffffff",
  },
});

