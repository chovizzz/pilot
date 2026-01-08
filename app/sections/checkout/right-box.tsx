import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef } from "react";

interface CheckoutRightBoxData {
  stepTitle?: string;
  stepTitleColor?: string;
  stepTitleSize?: number;
}

type CheckoutRightBoxProps = HydrogenComponentProps<CheckoutRightBoxData>;

export const CheckoutRightBox = forwardRef<HTMLDivElement, CheckoutRightBoxProps>(
  (props, ref) => {
    const {
      stepTitle = "Step 2: Payment Information",
      stepTitleColor = "#000000",
      stepTitleSize = 18,
      children,
      ...rest
    } = props as CheckoutRightBoxData & typeof props;

    return (
      <div
        ref={ref}
        {...rest}
      >
        <div className="paymentList py-2.5 flex flex-col flex-1 rightbox">
          {/* Step Title */}
          <div
            className="border-b border-black pb-2 order-1"
            style={{
              color: stepTitleColor,
              fontSize: `${stepTitleSize}px`,
            }}
          >
            <span className="step-title font-bold">{stepTitle}</span>
          </div>

          {/* Payment Content */}
          <div className="sm:col-span-3 mt-4 order-2 payment-section">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

CheckoutRightBox.displayName = "CheckoutRightBox";

export default CheckoutRightBox;

export const schema = createSchema({
  type: "checkout-right",
  title: "Checkout Right Box",
  childTypes: [
    "checkout--payment-methods",
    "checkout--payment-security",
    "checkout--other-payment-methods",
    "checkout--money-back-guarantee",
    "checkout--payment-logo-item",
    "checkout--security-logo-item",
  ],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "stepTitle",
          label: "Step Title",
          defaultValue: "Step 2: Payment Information",
        },
      ],
    },
    {
      group: "Typography",
      inputs: [
        {
          type: "range",
          name: "stepTitleSize",
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
          name: "stepTitleColor",
          label: "Title Color",
          defaultValue: "#000000",
        },
      ],
    },
  ],
  presets: {
    stepTitle: "Step 2: Payment Information",
    stepTitleColor: "#000000",
    stepTitleSize: 18,
  },
});

