import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, sectionSettings } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";
import { CheckoutProvider } from "./checkout-context";

interface CheckoutData {
  step1Title?: string;
  step2Title?: string;
  bgColor?: string;
  gap?: number;
  padding?: number;
  maxWidth?: number;
  layout?: "vertical" | "horizontal";
}

type CheckoutProps = HydrogenComponentProps<CheckoutData>;

export const Checkout = forwardRef<HTMLElement, CheckoutProps>(
  (props, ref) => {
    const {
      step1Title = "Step 1: Bundle Of Choice",
      step2Title = "Step 2: Payment Information",
      bgColor = "#ffffff",
      gap = 10,
      padding = 10,
      maxWidth = 1280,
      layout = "horizontal",
      children,
      ...rest
    } = props as CheckoutData & typeof props;

    const animation = useAnimation();
    const isVertical = layout === "vertical";

    // Create responsive maxWidth style that only applies on lg (1024px) and above
    const responsiveMaxWidthStyle = maxWidth && maxWidth > 0 ? `
      .checkout-responsive {
        width: 100%;
      }
      @media (min-width: 1024px) {
        .checkout-responsive {
          max-width: ${maxWidth}px;
        }
      }
    ` : `
      .checkout-responsive {
        width: 100%;
      }
    `;

    return (
      <CheckoutProvider>
        <Section
          ref={ref}
          {...rest}
          style={{ backgroundColor: bgColor }}
          data-motion="fade-up"
          {...animation}
        >
          <style>{responsiveMaxWidthStyle}</style>
          <div
            className={`checkout-responsive mx-auto checkout-section-box ${
              isVertical
                ? "flex flex-col"
                : "grid grid-cols-1 lg:grid-cols-2"
            }`}
            style={{
              backgroundColor: bgColor,
              gap: `${gap}px`,
              padding: `${padding}px`,
            }}
          >
            {children}
          </div>
        </Section>
      </CheckoutProvider>
    );
  }
);

Checkout.displayName = "Checkout";

export default Checkout;

export const schema = createSchema({
  type: "checkout",
  title: "Checkout",
  childTypes: [
    "checkout-left",
    "checkout-right",
    // Payment-related components can also be added directly to checkout section
    "checkout--payment-security",
    "checkout--other-payment-methods",
    "checkout--money-back-guarantee",
  ],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "step1Title",
          label: "Step 1 Title",
          defaultValue: "Step 1: Bundle Of Choice",
        },
        {
          type: "text",
          name: "step2Title",
          label: "Step 2 Title",
          defaultValue: "Step 2: Payment Information",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "layout",
          label: "Layout Direction",
          defaultValue: "horizontal",
          configs: {
            options: [
              { value: "horizontal", label: "Horizontal (Side by Side)" },
              { value: "vertical", label: "Vertical (Stacked)" },
            ],
          },
        },
        {
          type: "range",
          name: "maxWidth",
          label: "Max Width",
          defaultValue: 1280,
          configs: {
            min: 0,
            max: 1920,
            step: 10,
            unit: "px",
          },
          helpText: "Maximum width on large screens (1024px and above). Set to 0 for unlimited width.",
        },
        {
          type: "range",
          name: "gap",
          label: "Gap",
          defaultValue: 10,
          configs: {
            min: 0,
            max: 40,
            step: 2,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "padding",
          label: "Padding",
          defaultValue: 10,
          configs: {
            min: 0,
            max: 40,
            step: 2,
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
          defaultValue: "#ffffff",
        },
      ],
    },
    ...sectionSettings,
  ],
  presets: {
    step1Title: "Step 1: Bundle Of Choice",
    step2Title: "Step 2: Payment Information",
    bgColor: "#ffffff",
    gap: 10,
    padding: 10,
    maxWidth: 1280,
    layout: "horizontal",
  },
});

