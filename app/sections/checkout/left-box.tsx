import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef, useMemo } from "react";
import { useCheckout } from "./checkout-context";

interface CheckoutLeftBoxData {
  stepTitle?: string;
  stepTitleColor?: string;
  stepTitleSize?: number;
}

type CheckoutLeftBoxProps = HydrogenComponentProps<CheckoutLeftBoxData>;

export const CheckoutLeftBox = forwardRef<HTMLDivElement, CheckoutLeftBoxProps>(
  (props, ref) => {
    const {
      stepTitle = "Step 1: Bundle Of Choice",
      stepTitleColor = "#000000",
      stepTitleSize = 18,
      children,
      ...rest
    } = props as CheckoutLeftBoxData & typeof props;

    const { hasSelectedProducts } = useCheckout();
    
    // Count product items (checkout--product-item)
    const productItemsCount = useMemo(() => {
      if (!children) return 0;
      const childrenArray = Array.isArray(children) ? children : [children];
      return childrenArray.filter((child: any) => 
        child?.type?.displayName === "CheckoutProductItem" ||
        child?.props?.__weaverseType === "checkout--product-item"
      ).length;
    }, [children]);

    const hasProductItems = productItemsCount > 0;
    const showWarning = hasProductItems && !hasSelectedProducts;

    return (
      <div
        ref={ref}
        {...rest}
        className="flex flex-col flex-1 leftbox min-h-[300px] lg:min-h-[500px]"
      >
        <div className="productList py-2.5">
          {/* Step Title */}
          <div
            className="border-b border-black pb-2 mb-4 border-b border-gray-300"
            style={{
              color: stepTitleColor,
              fontSize: `${stepTitleSize}px`,
            }}
          >
            <span className="step-title font-bold">{stepTitle}</span>
          </div>

          {/* Warning Message */}
          {showWarning && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
              Please select at least one product to continue.
            </div>
          )}

          {/* Product Items */}
          <div className="w-full mt-2.5 sm:mt-4">{children}</div>
        </div>
      </div>
    );
  }
);

CheckoutLeftBox.displayName = "CheckoutLeftBox";

export default CheckoutLeftBox;

export const schema = createSchema({
  type: "checkout-left",
  title: "Checkout Left Box",
  childTypes: ["checkout--product-item", "checkout--shipping-protection", "checkout--order-summary"],
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "stepTitle",
          label: "Step Title",
          defaultValue: "Step 1: Bundle Of Choice",
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
    stepTitle: "Step 1: Bundle Of Choice",
    stepTitleColor: "#000000",
    stepTitleSize: 18,
  },
});

