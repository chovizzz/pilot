import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Image } from "~/components/image";
import { useAnimation } from "~/hooks/use-animation";

interface CheckoutSecurityLogoItemData {
  logo?: WeaverseImage | string;
  altText?: string;
  padding?: number;
  bgColor?: string;
  hoverBgColor?: string;
  borderRadius?: number;
}

type CheckoutSecurityLogoItemProps =
  HydrogenComponentProps<CheckoutSecurityLogoItemData>;

export const CheckoutSecurityLogoItem = forwardRef<
  HTMLDivElement,
  CheckoutSecurityLogoItemProps
>((props, ref) => {
  const {
    logo,
    altText = "Security logo",
    padding = 8,
    bgColor = "#f9fafb",
    hoverBgColor = "#f3f4f6",
    borderRadius = 4,
    ...rest
  } = props as CheckoutSecurityLogoItemData & typeof props;

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
        className="max-w-full h-auto max-h-12 object-contain"
        loading="lazy"
        sizes="auto"
      />
    </div>
  );
});

CheckoutSecurityLogoItem.displayName = "CheckoutSecurityLogoItem";

export default CheckoutSecurityLogoItem;

export const schema = createSchema({
  type: "checkout--security-logo-item",
  title: "Security Logo",
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
          defaultValue: "Security logo",
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
          defaultValue: 8,
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
          defaultValue: 4,
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
    altText: "Security logo",
    padding: 8,
    bgColor: "#f9fafb",
    hoverBgColor: "#f3f4f6",
    borderRadius: 4,
  },
});

