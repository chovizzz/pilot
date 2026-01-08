import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { useAnimation } from "~/hooks/use-animation";

interface CheckoutOtherPaymentMethodsData {
  title?: string;
  titleColor?: string;
  titleSize?: number;
  bgColor?: string;
  padding?: number;
  gap?: number;
  columns?: number;
}

type CheckoutOtherPaymentMethodsProps =
  HydrogenComponentProps<CheckoutOtherPaymentMethodsData>;

export const CheckoutOtherPaymentMethods = forwardRef<
  HTMLDivElement,
  CheckoutOtherPaymentMethodsProps
>((props, ref) => {
  const {
    title = "We also provide other payment methods for you.",
    titleColor = "#000000",
    titleSize = 18,
    bgColor = "#ffffff",
    padding = 20,
    gap = 12,
    columns = 5,
    children,
    ...rest
  } = props as CheckoutOtherPaymentMethodsData & typeof props;

  const animation = useAnimation();

  // Responsive grid columns
  const gridColsClass = {
    3: "grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
    5: "grid-cols-3 sm:grid-cols-4 md:grid-cols-5",
    6: "grid-cols-3 sm:grid-cols-4 md:grid-cols-6",
  }[columns] || "grid-cols-3 sm:grid-cols-4 md:grid-cols-5";

  return (
    <div
      ref={ref}
      {...rest}
      className="other-payment-methods-box"
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

      {/* Payment Logos Grid */}
      {children && (
        <div
          className={`grid ${gridColsClass} gap-4`}
          style={{ gap: `${gap}px` }}
        >
          {children}
        </div>
      )}
    </div>
  );
});

CheckoutOtherPaymentMethods.displayName = "CheckoutOtherPaymentMethods";

export default CheckoutOtherPaymentMethods;

export const schema = createSchema({
  type: "checkout--other-payment-methods",
  title: "Other Payment Methods",
  childTypes: ["checkout--payment-logo-item"],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "title",
          label: "Title",
          defaultValue: "We also provide other payment methods for you.",
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
          name: "bgColor",
          label: "Background Color",
          defaultValue: "#ffffff",
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
        {
          type: "range",
          name: "gap",
          label: "Logo Gap",
          defaultValue: 12,
          configs: {
            min: 4,
            max: 24,
            step: 2,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    title: "We also provide other payment methods for you.",
    titleColor: "#000000",
    bgColor: "#ffffff",
    padding: 20,
    gap: 12,
    columns: 5,
  },
});

