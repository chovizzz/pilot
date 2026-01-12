import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef, useState, useEffect, useMemo } from "react";
import { useCheckout } from "./checkout-context";

interface CheckoutShippingProtectionData {
  label?: string;
  price?: string;
  checked?: boolean;
  textColor?: string;
}

type CheckoutShippingProtectionProps =
  HydrogenComponentProps<CheckoutShippingProtectionData>;

export const CheckoutShippingProtection = forwardRef<
  HTMLDivElement,
  CheckoutShippingProtectionProps
>((props, ref) => {
  const {
    label = "Shipping protection",
    price = "$1.99",
    checked = false,
    textColor = "#777777",
    ...rest
  } = props as CheckoutShippingProtectionData & typeof props;

  const { setInsurancePrice, setIsInsuranceSelected } = useCheckout();
  const [isChecked, setIsChecked] = useState(checked);

  // Parse price from props and sync to context
  const parsedPrice = useMemo(() => {
    if (price) {
      // Parse price string like "$1.99" to { amount: "1.99", currencyCode: "USD" }
      const priceMatch = price.match(/\$?([\d.]+)/);
      if (priceMatch) {
        const amount = priceMatch[1];
        const currencyCode = price.includes("$") ? "USD" : "USD"; // Default to USD, can be enhanced
        return { amount, currencyCode };
      }
    }
    return null;
  }, [price]);

  // Sync insurance price to context when price changes
  useEffect(() => {
    if (parsedPrice) {
      setInsurancePrice(parsedPrice);
    }
  }, [parsedPrice, setInsurancePrice]);

  // Sync selection state to context
  useEffect(() => {
    setIsInsuranceSelected(isChecked);
  }, [isChecked, setIsInsuranceSelected]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div ref={ref} {...rest} className="freightInsurance-content">
      <label className="rowitemsbox cursor-pointer py-3.5 flex items-center">
        <input
          type="checkbox"
          id="shippingInsurance"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="w-4 h-4 text-green-700 border border-gray-300 cursor-pointer shrink-0"
        />
        <div className="flex w-full betweenbox advanceMethodName-line cursor-pointer items-center">
          <label
            htmlFor="shippingInsurance"
            className="ml-2 text-gray-900 flex flex-1 advanceMethodName-label cursor-pointer items-center"
          >
            <div
              className="flex items-center gap-1 text-sm whitespace-nowrap"
              style={{ color: textColor }}
            >
              <span>{label}</span>
              <span>{price}</span>
              <div className="relative inline-block shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                  />
                </svg>
              </div>
            </div>
          </label>
        </div>
      </label>
    </div>
  );
});

CheckoutShippingProtection.displayName = "CheckoutShippingProtection";

export default CheckoutShippingProtection;

export const schema = createSchema({
  type: "checkout--shipping-protection",
  title: "Shipping Protection",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "label",
          label: "Label",
          defaultValue: "Shipping protection",
        },
        {
          type: "text",
          name: "price",
          label: "Price",
          defaultValue: "$1.99",
        },
        {
          type: "switch",
          name: "checked",
          label: "Checked by Default",
          defaultValue: false,
        },
      ],
    },
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "textColor",
          label: "Text Color",
          defaultValue: "#777777",
        },
      ],
    },
  ],
  presets: {
    label: "Shipping protection",
    price: "$1.99",
    checked: false,
    textColor: "#777777",
  },
});

