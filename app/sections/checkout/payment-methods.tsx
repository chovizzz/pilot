import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";

interface CheckoutPaymentMethodsData {
  checkoutButtonText?: string;
  checkoutButtonColor?: string;
  checkoutButtonBgColor?: string;
  checkoutButtonSize?: number;
  showOtherMethodsText?: boolean;
  otherMethodsText?: string;
  columns?: 1 | 2;
  gap?: number;
}

type CheckoutPaymentMethodsProps =
  HydrogenComponentProps<CheckoutPaymentMethodsData>;

export const CheckoutPaymentMethods = forwardRef<
  HTMLDivElement,
  CheckoutPaymentMethodsProps
>((props, ref) => {
  const {
    checkoutButtonText = "Checkout",
    checkoutButtonColor = "#ffffff",
    checkoutButtonBgColor = "#00af57",
    checkoutButtonSize = 20,
    showOtherMethodsText = true,
    otherMethodsText = "OR CHECKOUT WITH OTHER METHODS",
    columns = 2,
    gap = 10,
    children,
    ...rest
  } = props as CheckoutPaymentMethodsData & typeof props;

  const gridCols = columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-2";

  return (
    <div ref={ref} {...rest} className="flex flex-col express-checkout-box-section">
      {/* Express Checkout Buttons */}
      {children && (
        <div
          className={`grid express-checkout-box ${gridCols}`}
          style={{ gap: `${gap}px` }}
        >
          {children}
        </div>
      )}

      {/* Other Methods Separator */}
      {showOtherMethodsText && (
        <div className="relative text-center font-medium uppercase py-3 px-0 my-1.5 overflow-hidden w-full text-xs leading-6 express-checkout-box-text">
          <div className="hidden sm:block absolute left-0 top-1/2 w-[50px] h-px bg-[#d9d9d9] -translate-y-1/2"></div>
          <span className="relative z-10 payment-other-text">{otherMethodsText}</span>
          <div className="hidden sm:block absolute right-0 top-1/2 w-[50px] h-px bg-[#d9d9d9] -translate-y-1/2"></div>
        </div>
      )}

      {/* Checkout Button */}
      <div className="order-3 checkoutSection">
        <div className="centerbox checkout-button-section">
          <button
            id="checkout-button"
            className="w-full max-h-[80px] cursor-pointer centerbox bg-black border border-transparent rounded-md py-3 px-8 focus:outline-none sm:order-last"
            style={{
              backgroundColor: checkoutButtonBgColor,
              color: checkoutButtonColor,
              fontSize: `${checkoutButtonSize}px`,
            }}
          >
            <div className="flex flex-col justify-center items-center">
              <span className="block">{checkoutButtonText}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
});

CheckoutPaymentMethods.displayName = "CheckoutPaymentMethods";

export default CheckoutPaymentMethods;

export const schema = createSchema({
  type: "checkout--payment-methods",
  title: "Payment Methods",
  childTypes: ["checkout--payment-method-item"],
  helpText: "Add payment method items below. Each item can either use a payment plugin (recommended) or be a custom button. For payment plugins, enable 'Use Payment Plugin' in the item settings and provide the plugin ID and container ID.",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "checkoutButtonText",
          label: "Checkout Button Text",
          defaultValue: "Checkout",
        },
        {
          type: "switch",
          name: "showOtherMethodsText",
          label: "Show Other Methods Text",
          defaultValue: true,
        },
        {
          type: "text",
          name: "otherMethodsText",
          label: "Other Methods Text",
          defaultValue: "OR CHECKOUT WITH OTHER METHODS",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "select",
          name: "columns",
          label: "Columns",
          defaultValue: 2,
          configs: {
            options: [
              { value: 1, label: "1 Column" },
              { value: 2, label: "2 Columns" },
            ],
          },
          helpText: "Number of columns for payment method buttons",
        },
        {
          type: "range",
          name: "gap",
          label: "Gap",
          defaultValue: 10,
          configs: {
            min: 4,
            max: 24,
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
          name: "checkoutButtonBgColor",
          label: "Button Background Color",
          defaultValue: "#00af57",
        },
        {
          type: "color",
          name: "checkoutButtonColor",
          label: "Button Text Color",
          defaultValue: "#ffffff",
        },
      ],
    },
    {
      group: "Typography",
      inputs: [
        {
          type: "range",
          name: "checkoutButtonSize",
          label: "Button Text Size",
          defaultValue: 20,
          configs: {
            min: 14,
            max: 24,
            step: 1,
            unit: "px",
          },
        },
      ],
    },
  ],
  presets: {
    checkoutButtonText: "Checkout",
    checkoutButtonBgColor: "#00af57",
    checkoutButtonColor: "#ffffff",
    checkoutButtonSize: 20,
    showOtherMethodsText: true,
    otherMethodsText: "OR CHECKOUT WITH OTHER METHODS",
    columns: 2,
    gap: 10,
  },
});

