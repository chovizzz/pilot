import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Image } from "~/components/image";
import { useAnimation } from "~/hooks/use-animation";

interface CheckoutMoneyBackGuaranteeData {
  title?: string;
  description?: string;
  days?: number;
  badgeImage?: WeaverseImage | string;
  titleColor?: string;
  descriptionColor?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  bgColor?: string;
  padding?: number;
  layout?: "horizontal" | "vertical";
  badgeRatio?: number;
  badgeSize?: number;
}

type CheckoutMoneyBackGuaranteeProps =
  HydrogenComponentProps<CheckoutMoneyBackGuaranteeData>;

export const CheckoutMoneyBackGuarantee = forwardRef<
  HTMLDivElement,
  CheckoutMoneyBackGuaranteeProps
>((props, ref) => {
  const {
    title = "90 Day Money Back Guarantee",
    description = "Ensuring that our customers are 100% happy with every product they purchase from us is critically important to us. If you are not 100% satisfied with your purchase, you can return it for a full refund within 90 days of purchase.",
    days = 90,
    badgeImage,
    titleColor = "#000000",
    descriptionColor = "#666666",
    badgeBgColor = "#FFD700",
    badgeTextColor = "#000000",
    bgColor = "#ffffff",
    padding = 20,
    layout = "horizontal",
    badgeRatio = 30,
    badgeSize = 128,
    ...rest
  } = props as CheckoutMoneyBackGuaranteeData & typeof props;

  const animation = useAnimation();
  const isVertical = layout === "vertical";
  const contentRatio = 100 - badgeRatio;

  // Prepare badge image data
  const badgeImageData: Partial<WeaverseImage> | undefined = badgeImage
    ? typeof badgeImage === "string"
      ? { url: badgeImage, altText: "Money back guarantee badge" }
      : badgeImage
    : undefined;

  return (
    <div
      ref={ref}
      {...rest}
      className="money-back-guarantee-box"
      style={{
        backgroundColor: bgColor,
        padding: `${padding}px`,
      }}
      data-motion="fade-up"
      {...animation}
    >
      <>
        {isVertical && (
          <style>
            {`
              .money-back-guarantee-vertical .badge-container {
                width: ${badgeSize}px;
                height: ${badgeSize}px;
                min-width: ${badgeSize}px;
              }
            `}
          </style>
        )}
        <div
          className={`flex ${isVertical ? "flex-col items-center money-back-guarantee-vertical" : "flex-row items-start"} gap-2`}
        >
          {/* Badge */}
          <div
            className={isVertical ? "badge-container" : ""}
            style={
              isVertical
                ? {
                    width: `${badgeSize}px`,
                    height: `${badgeSize}px`,
                    minWidth: `${badgeSize}px`,
                  }
                : {
                    width: `${badgeRatio}%`,
                    flexShrink: 0,
                  }
            }
          >
            {badgeImageData ? (
              <Image
                data={badgeImageData}
                alt="Money back guarantee badge"
                className={`${isVertical ? "w-full h-full" : "w-full"} object-contain`}
                style={
                  isVertical
                    ? {
                        width: `${badgeSize}px`,
                        height: `${badgeSize}px`,
                      }
                    : {}
                }
                loading="lazy"
                sizes="auto"
              />
            ) : (
              <div
                className={`${isVertical ? "" : "w-full"} rounded-full flex flex-col items-center justify-center font-bold text-center`}
                style={{
                  width: isVertical ? `${badgeSize}px` : "100%",
                  height: isVertical ? `${badgeSize}px` : "auto",
                  aspectRatio: "1/1",
                  backgroundColor: badgeBgColor,
                  color: badgeTextColor,
                }}
              >
                <div className="text-xs sm:text-sm leading-tight">MONEY BACK</div>
                <div className="text-lg sm:text-2xl font-extrabold my-1">
                  {days} DAY
                </div>
                <div className="text-xs sm:text-sm leading-tight">GUARANTEE</div>
              </div>
            )}
          </div>

          {/* Content */}
          <div
            style={
              isVertical
                ? { width: "100%" }
                : {
                    width: `${contentRatio}%`,
                    flex: 1,
                  }
            }
          >
            <h3
              className="font-bold mb-2 text-lg sm:text-xl"
              style={{ color: titleColor }}
            >
              {title}
            </h3>
            <p
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: descriptionColor }}
            >
              {description}
            </p>
          </div>
        </div>
      </>
    </div>
  );
});

CheckoutMoneyBackGuarantee.displayName = "CheckoutMoneyBackGuarantee";

export default CheckoutMoneyBackGuarantee;

export const schema = createSchema({
  type: "checkout--money-back-guarantee",
  title: "Money Back Guarantee",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "title",
          label: "Title",
          defaultValue: "90 Day Money Back Guarantee",
        },
        {
          type: "textarea",
          name: "description",
          label: "Description",
          defaultValue:
            "Ensuring that our customers are 100% happy with every product they purchase from us is critically important to us. If you are not 100% satisfied with your purchase, you can return it for a full refund within 90 days of purchase.",
        },
        {
          type: "range",
          name: "days",
          label: "Days",
          defaultValue: 90,
          configs: {
            min: 7,
            max: 365,
            step: 1,
          },
        },
      ],
    },
    {
      group: "Images",
      inputs: [
        {
          type: "image",
          name: "badgeImage",
          label: "Badge Image",
          helpText: "Optional: Upload a custom badge image. If not provided, a default badge will be generated.",
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
          defaultValue: "horizontal",
          configs: {
            options: [
              { value: "horizontal", label: "Horizontal (Badge Left)" },
              { value: "vertical", label: "Vertical (Badge Top)" },
            ],
          },
        },
        {
          type: "range",
          name: "badgeRatio",
          label: "Badge Width Ratio (Horizontal Layout)",
          defaultValue: 30,
          configs: {
            min: 10,
            max: 50,
            step: 5,
            unit: "%",
          },
          helpText: "Percentage of width for badge in horizontal layout. Content will take the remaining space.",
          condition: (data: CheckoutMoneyBackGuaranteeData) =>
            data.layout === "horizontal",
        },
        {
          type: "range",
          name: "badgeSize",
          label: "Badge Size (Vertical Layout)",
          defaultValue: 128,
          configs: {
            min: 80,
            max: 200,
            step: 8,
            unit: "px",
          },
          helpText: "Size of the badge in vertical layout",
          condition: (data: CheckoutMoneyBackGuaranteeData) =>
            data.layout === "vertical",
        },
        {
          type: "range",
          name: "padding",
          label: "Padding",
          defaultValue: 20,
          configs: {
            min: 0,
            max: 60,
            step: 5,
            unit: "px",
          },
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
          defaultValue: "#666666",
        },
        {
          type: "color",
          name: "badgeBgColor",
          label: "Badge Background Color",
          defaultValue: "#FFD700",
        },
        {
          type: "color",
          name: "badgeTextColor",
          label: "Badge Text Color",
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "bgColor",
          label: "Background Color",
          defaultValue: "#ffffff",
        },
      ],
    },
  ],
  presets: {
    title: "90 Day Money Back Guarantee",
    description:
      "Ensuring that our customers are 100% happy with every product they purchase from us is critically important to us. If you are not 100% satisfied with your purchase, you can return it for a full refund within 90 days of purchase.",
    days: 90,
    titleColor: "#000000",
    descriptionColor: "#666666",
    badgeBgColor: "#FFD700",
    badgeTextColor: "#000000",
    bgColor: "#ffffff",
    padding: 20,
    layout: "horizontal",
    badgeRatio: 30,
    badgeSize: 128,
  },
});

