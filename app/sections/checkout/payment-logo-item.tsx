import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Image } from "~/components/image";
import { useAnimation } from "~/hooks/use-animation";

interface CheckoutPaymentLogoItemData {
  logo?: WeaverseImage | string;
  altText?: string;
  padding?: number;
  bgColor?: string;
  hoverBgColor?: string;
  borderRadius?: number;
}

type CheckoutPaymentLogoItemProps =
  HydrogenComponentProps<CheckoutPaymentLogoItemData>;

export const CheckoutPaymentLogoItem = forwardRef<
  HTMLDivElement,
  CheckoutPaymentLogoItemProps
>((props, ref) => {
  const {
    logo,
    altText = "Payment method logo",
    padding = 12,
    bgColor = "#f9fafb",
    hoverBgColor = "#f3f4f6",
    borderRadius = 8,
    ...rest
  } = props as CheckoutPaymentLogoItemData & typeof props;

  const animation = useAnimation();

  const logoData: Partial<WeaverseImage> | undefined = logo
    ? typeof logo === "string"
      ? { url: logo, altText }
      : logo
    : undefined;

  if (!logoData) return null;

  return (
    <div
      ref={ref}
      {...rest}
      className="flex items-center justify-center transition-colors"
      style={{
        padding: `${padding}px`,
        backgroundColor: bgColor,
        borderRadius: `${borderRadius}px`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverBgColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = bgColor;
      }}
      data-motion="fade-up"
      {...animation}
    >
      <Image
        data={logoData}
        alt={altText}
        className="max-w-full h-auto max-h-10 object-contain"
        loading="lazy"
        sizes="auto"
      />
    </div>
  );
});

CheckoutPaymentLogoItem.displayName = "CheckoutPaymentLogoItem";

export default CheckoutPaymentLogoItem;

export const schema = createSchema({
  type: "checkout--payment-logo-item",
  title: "Payment Logo",
  settings: [
    {
      group: "Image",
      inputs: [
        {
          type: "image",
          name: "logo",
          label: "Logo",
        },
        {
          type: "text",
          name: "altText",
          label: "Alt Text",
          defaultValue: "Payment method logo",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "padding",
          label: "Padding",
          defaultValue: 12,
          configs: {
            min: 0,
            max: 40,
            step: 2,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "borderRadius",
          label: "Border Radius",
          defaultValue: 8,
          configs: {
            min: 0,
            max: 20,
            step: 1,
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
          name: "bgColor",
          label: "Background Color",
          defaultValue: "#f9fafb",
        },
        {
          type: "color",
          name: "hoverBgColor",
          label: "Hover Background Color",
          defaultValue: "#f3f4f6",
        },
      ],
    },
  ],
  presets: {
    altText: "Payment method logo",
    padding: 12,
    bgColor: "#f9fafb",
    hoverBgColor: "#f3f4f6",
    borderRadius: 8,
  },
});

