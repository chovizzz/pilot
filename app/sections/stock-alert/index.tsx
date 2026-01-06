import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";

interface StockAlertData {
  leftText?: string;
  rightText?: string;
  leftIcon?: WeaverseImage | string;
  leftIconWidth?: number;
  leftBgColor?: string;
  rightGradientStart?: string;
  rightGradientEnd?: string;
  leftTextColor?: string;
  rightTextColor?: string;
  leftTextSize?: number;
  rightTextSize?: number;
  scrollSpeed?: number;
  iconRotateSpeed?: number;
  sticky?: boolean;
}

type StockAlertProps = HydrogenComponentProps<StockAlertData>;

export const StockAlert = forwardRef<HTMLElement, StockAlertProps>(
  (props, ref) => {
    const {
      leftText = "Only 100 left",
      rightText = "Hurry before the price goes back up!",
      leftIcon,
      leftIconWidth = 12,
      leftBgColor = "#000000",
      rightGradientStart = "#ef7b2e",
      rightGradientEnd = "#fae2d2",
      leftTextColor = "#ffffff",
      rightTextColor = "#ffffff",
      leftTextSize = 14,
      rightTextSize = 14,
      scrollSpeed = 20,
      iconRotateSpeed = 3,
      sticky = false,
      ...rest
    } = props as StockAlertData & typeof props;

    const animation = useAnimation();

    // Extract image URL from WeaverseImage object or string
    const leftIconUrl = leftIcon 
      ? (typeof leftIcon === "string" ? leftIcon : leftIcon.url)
      : null;

    // Create marquee animation for scrolling text
    // Each text segment is 100% width, so we need to scroll 100% to fully move past the first segment
    const marqueeKeyframes = `@keyframes stock-alert-scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-100%); }
    }
    @keyframes stock-alert-icon-rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .stock-alert-left-section {
      clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%);
      z-index: 1;
    }
    .stock-alert-left-section::after {
      content: '';
      position: absolute;
      right: -12px;
      top: 0;
      bottom: 0;
      width: 0;
      height: 0;
      border-top: calc(100% / 2) solid transparent;
      border-bottom: calc(100% / 2) solid transparent;
      border-left: 12px solid ${leftBgColor};
      z-index: 2;
    }`;

    return (
      <Section ref={ref} {...rest}>
        <div
          className={`flex items-stretch leading-none ${
            sticky ? "sticky top-0 z-50" : ""
          }`}
          data-motion="fade-up"
          {...animation}
        >
          <style>{marqueeKeyframes}</style>
          {/* Left section - Black background with triangle */}
          <div
            className="py-2 px-3 font-bold flex items-center gap-2 shrink-0 relative stock-alert-left-section"
            style={{
              backgroundColor: leftBgColor,
              color: leftTextColor,
              fontSize: `${leftTextSize}px`,
            }}
          >
            {leftIconUrl && (
              <div className="shrink-0 flex items-center">
                <img
                  src={leftIconUrl}
                  alt=""
                  className="object-contain"
                  style={{
                    width: `${leftIconWidth}px`,
                    height: "auto",
                    maxHeight: "100%",
                    animation: `stock-alert-icon-rotate ${iconRotateSpeed}s linear infinite`,
                  }}
                />
              </div>
            )}
            <div>{leftText}</div>
          </div>
          {/* Right section - Orange gradient with scrolling text */}
          <div
            className="py-2 px-3 flex-1 flex items-center overflow-hidden relative"
            style={{
              backgroundImage: `linear-gradient(to right, ${rightGradientStart}, ${rightGradientEnd})`,
              color: rightTextColor,
              fontSize: `${rightTextSize}px`,
              marginLeft: "-12px",
              paddingLeft: "24px",
            }}
          >
            <div
              className="flex whitespace-nowrap"
              style={{
                animation: `stock-alert-scroll ${scrollSpeed}s linear infinite`,
              }}
            >
              <div className="w-full shrink-0 flex items-center justify-center">
                {rightText}
              </div>
              <div className="w-full shrink-0 flex items-center justify-center">
                {rightText}
              </div>
            </div>
          </div>
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
        {
          type: "range",
          name: "leftIconWidth",
          label: "Left Icon Width",
          defaultValue: 12,
          configs: {
            min: 8,
            max: 32,
            step: 1,
            unit: "px",
          },
          condition: (data: StockAlertData) => !!data.leftIcon,
          helpText: "Width of the left icon",
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
          name: "rightGradientStart",
          label: "Right Gradient Start Color",
          defaultValue: "#ef7b2e",
        },
        {
          type: "color",
          name: "rightGradientEnd",
          label: "Right Gradient End Color",
          defaultValue: "#fae2d2",
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
          defaultValue: 14,
          configs: {
            min: 10,
            max: 24,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "rightTextSize",
          label: "Right Text Size",
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
      group: "Layout",
      inputs: [
        {
          type: "switch",
          name: "sticky",
          label: "Sticky",
          defaultValue: false,
        },
        {
          type: "range",
          name: "scrollSpeed",
          label: "Scroll Speed",
          defaultValue: 20,
          configs: {
            min: 5,
            max: 60,
            step: 1,
            unit: "s",
          },
          helpText: "Animation duration for scrolling text (lower = faster)",
        },
        {
          type: "range",
          name: "iconRotateSpeed",
          label: "Icon Rotate Speed",
          defaultValue: 3,
          configs: {
            min: 1,
            max: 10,
            step: 0.5,
            unit: "s",
          },
          helpText: "Animation duration for icon rotation (lower = faster)",
        },
      ],
    },
  ],
  presets: {
    leftText: "Only 100 left",
    rightText: "Hurry before the price goes back up!",
    leftBgColor: "#000000",
    rightGradientStart: "#ef7b2e",
    rightGradientEnd: "#fae2d2",
    leftTextColor: "#ffffff",
    rightTextColor: "#ffffff",
    leftTextSize: 14,
    rightTextSize: 14,
    scrollSpeed: 20,
    iconRotateSpeed: 3,
    leftIconWidth: 12,
  },
});

