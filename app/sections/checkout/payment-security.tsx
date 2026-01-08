import { createSchema, type HydrogenComponentProps, type WeaverseImage } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Image } from "~/components/image";
import { useAnimation } from "~/hooks/use-animation";

interface CheckoutPaymentSecurityData {
  title?: string;
  titleColor?: string;
  titleSize?: number;
  securityPoints?: string[] | string;
  securityPointColor?: string;
  checkIcon?: WeaverseImage | string;
  checkIconColor?: string;
  checkIconSize?: number;
  bgColor?: string;
  padding?: number;
  columns?: number;
  gap?: number;
}

type CheckoutPaymentSecurityProps =
  HydrogenComponentProps<CheckoutPaymentSecurityData>;

export const CheckoutPaymentSecurity = forwardRef<
  HTMLDivElement,
  CheckoutPaymentSecurityProps
>((props, ref) => {
  const {
    title = "Pay confidently with our secure methods",
    titleColor = "#000000",
    titleSize = 18,
    securityPoints = [
      "Card information is secure and uncompromised",
      "Sakerplus follows the Payment Card Industry Data Security Standard (PCI DSS) and other security standards when handling card data",
      "All data is encrypted",
      "Sakerplus never sells your card information",
    ],
    securityPointColor = "#000000",
    checkIcon,
    checkIconColor = "#10b981",
    checkIconSize = 20,
    bgColor = "#ffffff",
    padding = 20,
    columns = 5,
    gap = 16,
    children,
    ...rest
  } = props as CheckoutPaymentSecurityData & typeof props;

  // Handle securityPoints as string or array
  const pointsArray = Array.isArray(securityPoints)
    ? securityPoints
    : typeof securityPoints === "string"
      ? securityPoints.split("\n").filter((p) => p.trim())
      : [];

  const animation = useAnimation();

  // Prepare check icon data
  const checkIconData: Partial<WeaverseImage> | undefined = checkIcon
    ? typeof checkIcon === "string"
      ? { url: checkIcon, altText: "Check icon" }
      : checkIcon
    : undefined;

  return (
    <div
      ref={ref}
      {...rest}
      className="payment-security-box"
      style={{
        backgroundColor: bgColor,
        padding: `${padding}px`,
      }}
      data-motion="fade-up"
      {...animation}
    >
      {/* Title */}
      <h3
        className="font-bold mb-4"
        style={{
          color: titleColor,
          fontSize: `${titleSize}px`,
        }}
      >
        {title}
      </h3>

      {/* Security Points */}
      <div className="mb-6 space-y-3">
        {pointsArray.map((point, index) => (
          <div key={index} className="flex items-start">
            {checkIconData ? (
              <div
                className="mr-3 mt-0.5 shrink-0"
                style={{
                  width: `${checkIconSize}px`,
                  height: `${checkIconSize}px`,
                }}
              >
                <Image
                  data={checkIconData}
                  alt="Check icon"
                  className="w-full h-full object-contain"
                  style={{
                    width: `${checkIconSize}px`,
                    height: `${checkIconSize}px`,
                  }}
                  loading="lazy"
                  sizes="auto"
                />
              </div>
            ) : (
              <svg
                className="mr-3 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{
                  color: checkIconColor,
                  width: `${checkIconSize}px`,
                  height: `${checkIconSize}px`,
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            <p
              className="text-sm leading-relaxed"
              style={{ color: securityPointColor }}
            >
              {point}
            </p>
          </div>
        ))}
      </div>

      {/* Security Logos Grid */}
      {children && (
        <>
          <style>
            {`
              .payment-security-logos-grid {
                grid-template-columns: repeat(3, minmax(0, 1fr));
              }
              @media (min-width: 640px) {
                .payment-security-logos-grid {
                  grid-template-columns: repeat(${columns}, minmax(0, 1fr));
                }
              }
            `}
          </style>
          <div
            className="payment-security-logos-grid grid gap-4"
            style={{ gap: `${gap}px` }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
});

CheckoutPaymentSecurity.displayName = "CheckoutPaymentSecurity";

export default CheckoutPaymentSecurity;

export const schema = createSchema({
  type: "checkout--payment-security",
  title: "Payment Security",
  childTypes: ["checkout--security-logo-item"],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "title",
          label: "Title",
          defaultValue: "Pay confidently with our secure methods",
        },
        {
          type: "textarea",
          name: "securityPoints",
          label: "Security Points",
          defaultValue: [
            "Card information is secure and uncompromised",
            "Sakerplus follows the Payment Card Industry Data Security Standard (PCI DSS) and other security standards when handling card data",
            "All data is encrypted",
            "Sakerplus never sells your card information",
          ].join("\n"),
          helpText: "Enter each point on a new line",
        },
        {
          type: "image",
          name: "checkIcon",
          label: "Check Icon",
          helpText: "Optional: Upload a custom check icon. If not provided, a default SVG checkmark will be used.",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "columns",
          label: "Columns",
          defaultValue: 5,
          configs: {
            min: 3,
            max: 6,
            step: 1,
          },
          helpText: "Number of columns on large screens",
        },
        {
          type: "range",
          name: "gap",
          label: "Logo Gap",
          defaultValue: 16,
          configs: {
            min: 4,
            max: 24,
            step: 2,
            unit: "px",
          },
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
      group: "Typography",
      inputs: [
        {
          type: "range",
          name: "titleSize",
          label: "Title Size",
          defaultValue: 18,
          configs: {
            min: 14,
            max: 24,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
    {
      group: "Check Icon",
      inputs: [
        {
          type: "range",
          name: "checkIconSize",
          label: "Icon Size",
          defaultValue: 20,
          configs: {
            min: 12,
            max: 32,
            step: 2,
            unit: "px",
          },
        },
        {
          type: "color",
          name: "checkIconColor",
          label: "Icon Color (SVG only)",
          defaultValue: "#10b981",
          helpText: "Only applies when using default SVG icon, not custom uploaded image",
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
          name: "securityPointColor",
          label: "Text Color",
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
    title: "Pay confidently with our secure methods",
    securityPoints: [
      "Card information is secure and uncompromised",
      "Sakerplus follows the Payment Card Industry Data Security Standard (PCI DSS) and other security standards when handling card data",
      "All data is encrypted",
      "Sakerplus never sells your card information",
    ].join("\n"),
    titleColor: "#000000",
    securityPointColor: "#000000",
    checkIconColor: "#10b981",
    checkIconSize: 20,
    bgColor: "#ffffff",
    padding: 20,
    columns: 5,
    gap: 16,
  },
});

