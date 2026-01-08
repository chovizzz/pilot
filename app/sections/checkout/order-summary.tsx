import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { Money } from "@shopify/hydrogen";
import { forwardRef, useMemo } from "react";
import { useCheckout } from "./checkout-context";

interface CheckoutOrderSummaryData {
  summaryTitle?: string;
  productTitle?: string;
  productQuantity?: string;
  productPrice?: string;
  productMarketPrice?: string;
  shippingLabel?: string;
  shippingPrice?: string;
  insuranceLabel?: string;
  insurancePrice?: string;
  totalLabel?: string;
  totalPrice?: string;
  textColor?: string;
  priceColor?: string;
  salesPriceColor?: string;
  marketPriceColor?: string;
}

type CheckoutOrderSummaryProps =
  HydrogenComponentProps<CheckoutOrderSummaryData>;

export const CheckoutOrderSummary = forwardRef<
  HTMLDivElement,
  CheckoutOrderSummaryProps
>((props, ref) => {
  const {
    summaryTitle = "Product",
    productTitle,
    productQuantity,
    productPrice,
    productMarketPrice,
    shippingLabel = "Shipping",
    shippingPrice,
    insuranceLabel = "Shipping protection",
    insurancePrice,
    totalLabel = "Total",
    totalPrice,
    textColor = "#000000",
    priceColor = "#000000",
    salesPriceColor = "#e60000",
    marketPriceColor = "#000000",
    ...rest
  } = props as CheckoutOrderSummaryData & typeof props;

  const { selectedProducts, getTotalPrice } = useCheckout();
  
  // Calculate totals from selected products - memoize to prevent unnecessary recalculations
  const calculatedTotal = useMemo(() => getTotalPrice(), [getTotalPrice]);
  const totalQuantity = useMemo(() => {
    return selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
  }, [selectedProducts]);

  // Calculate total price from all selected products
  const displayTotalPrice = calculatedTotal || totalPrice;

  return (
    <div ref={ref} {...rest} className="checkoutSummary py-2.5 sm:py-4">
      {/* Summary Header */}
      <div className="flex flex-row justify-between items-center font-bold mb-2.5">
        <div className="capitalize summary-top-left" style={{ color: textColor }}>
          {summaryTitle}
        </div>
        <div className="capitalize summary-top-right" style={{ color: textColor }}>
          price
        </div>
      </div>

      {/* Product Details */}
      <div className="border-t border-b border-gray-200 my-2.5 py-2.5">
        {/* Display each selected product individually */}
        {selectedProducts.length > 0 ? (
          selectedProducts.map((product, index) => {
            const productPrice = product.price;
            const productComparePrice = product.compareAtPrice;
            const productVariant = product.variant || product.title;
            
            // Calculate price for this product (price * quantity)
            const price = typeof productPrice === "object"
              ? parseFloat(productPrice.amount)
              : parseFloat(String(productPrice).replace(/[^0-9.-]+/g, "")) || 0;
            const total = price * product.quantity;
            const currencyCode = typeof productPrice === "object"
              ? productPrice.currencyCode
              : "USD";
            const itemTotalPrice = { amount: total.toFixed(2), currencyCode };

            return (
              <div key={product.id || index} className="flex flex-row justify-between items-center mb-2.5">
                <div className="flex justify-between items-center w-full">
                  <div className="text-gray-900 flex flex-col text-sm">
                    <span className="variant-title" style={{ color: textColor }}>
                      {productVariant}
                    </span>
                  </div>
                  <div
                    className="text-gray-900 pl-2.5 min-w-[50px] text-right summary-qty text-sm"
                    style={{ color: textColor }}
                  >
                    X {product.quantity}
                  </div>
                </div>
                <div>
                  <div
                    className="pl-2.5 min-w-[100px] text-right font-bold whitespace-nowrap sales-price text-xl"
                    style={{ color: salesPriceColor }}
                  >
                    {typeof productPrice === "string" ? (
                      productPrice
                    ) : typeof productPrice === "object" ? (
                      <Money
                        data={itemTotalPrice as any}
                        withoutTrailingZeros
                        as="span"
                      />
                    ) : null}
                  </div>
                  {productComparePrice && (
                    <div
                      className="pl-2.5 min-w-[100px] text-right line-through market-price text-sm"
                      style={{ color: marketPriceColor }}
                    >
                      {typeof productComparePrice === "string" ? (
                        productComparePrice
                      ) : typeof productComparePrice === "object" && "amount" in productComparePrice ? (
                        <Money
                          data={productComparePrice as any}
                          withoutTrailingZeros
                          as="span"
                        />
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          // Fallback to manual input when no products selected
          (productTitle || productPrice) && (
            <div className="flex flex-row justify-between items-center mb-2.5">
              <div className="flex justify-between items-center w-full">
                <div className="text-gray-900 flex flex-col text-sm">
                  <span className="variant-title" style={{ color: textColor }}>
                    {productTitle}
                  </span>
                </div>
                {productQuantity && (
                  <div
                    className="text-gray-900 pl-2.5 min-w-[50px] text-right summary-qty text-sm"
                    style={{ color: textColor }}
                  >
                    {productQuantity}
                  </div>
                )}
              </div>
              <div>
                {productPrice && (
                  <div
                    className="pl-2.5 min-w-[100px] text-right font-bold whitespace-nowrap sales-price text-xl"
                    style={{ color: salesPriceColor }}
                  >
                    {productPrice}
                  </div>
                )}
                {productMarketPrice && (
                  <div
                    className="pl-2.5 min-w-[100px] text-right line-through market-price text-sm"
                    style={{ color: marketPriceColor }}
                  >
                    {productMarketPrice}
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* Shipping */}
        {shippingPrice && (
          <div className="flex flex-row justify-between items-center text-sm summary-shipping-row">
            <div className="flex flex-col shipping-row">
              <span
                className="summary-shipping-row-left text-sm"
                style={{ color: textColor }}
              >
                {shippingLabel}
              </span>
            </div>
            <div
              className="summary-shipping-right has-shipping text-sm"
              style={{ color: priceColor }}
            >
              {shippingPrice}
            </div>
          </div>
        )}

        {/* Insurance */}
        {insurancePrice && (
          <div className="flex flex-row justify-between items-center text-sm mt-2.5 summary-insurance-row">
            <div className="summary-insurance-left text-sm" style={{ color: textColor }}>
              {insuranceLabel}
            </div>
            <div
              className="summary-insurance-right text-sm"
              style={{ color: priceColor }}
            >
              {insurancePrice}
            </div>
          </div>
        )}
      </div>

      {/* Total */}
      {displayTotalPrice && (
        <div className="flex flex-row justify-between items-center summary-bottom-row">
          <div className="font-bold summary-bottom-left" style={{ color: textColor }}>
            {totalLabel}
          </div>
          <div className="summary-bottom-right pl-2.5" style={{ color: priceColor }}>
            {typeof displayTotalPrice === "string" ? (
              displayTotalPrice
            ) : displayTotalPrice && typeof displayTotalPrice === "object" && "amount" in displayTotalPrice ? (
              <Money
                data={displayTotalPrice as any}
                withoutTrailingZeros
                as="span"
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
});

CheckoutOrderSummary.displayName = "CheckoutOrderSummary";

export default CheckoutOrderSummary;

export const schema = createSchema({
  type: "checkout--order-summary",
  title: "Order Summary",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "summaryTitle",
          label: "Summary Title",
          defaultValue: "Product",
        },
        {
          type: "textarea",
          name: "productTitle",
          label: "Product Title",
          defaultValue: '30W | ⌀16.5" | E26/E27/B22 | 3speeds | White',
        },
        {
          type: "text",
          name: "productQuantity",
          label: "Product Quantity",
          defaultValue: "X 1",
        },
        {
          type: "text",
          name: "productPrice",
          label: "Product Price",
          defaultValue: "$29.99",
        },
        {
          type: "text",
          name: "productMarketPrice",
          label: "Product Market Price",
          defaultValue: "$59.98",
        },
        {
          type: "text",
          name: "shippingLabel",
          label: "Shipping Label",
          defaultValue: "Shipping",
        },
        {
          type: "text",
          name: "shippingPrice",
          label: "Shipping Price",
          defaultValue: "$5.99",
        },
        {
          type: "text",
          name: "insuranceLabel",
          label: "Insurance Label",
          defaultValue: "Shipping protection",
        },
        {
          type: "text",
          name: "insurancePrice",
          label: "Insurance Price",
          defaultValue: "$1.99",
        },
        {
          type: "text",
          name: "totalLabel",
          label: "Total Label",
          defaultValue: "Total",
        },
        {
          type: "text",
          name: "totalPrice",
          label: "Total Price",
          defaultValue: "$37.97",
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
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "priceColor",
          label: "Price Color",
          defaultValue: "#000000",
        },
        {
          type: "color",
          name: "salesPriceColor",
          label: "Sales Price Color",
          defaultValue: "#e60000",
        },
        {
          type: "color",
          name: "marketPriceColor",
          label: "Market Price Color",
          defaultValue: "#000000",
        },
      ],
    },
  ],
  presets: {
    summaryTitle: "Product",
    productTitle: '30W | ⌀16.5" | E26/E27/B22 | 3speeds | White',
    productQuantity: "X 1",
    productPrice: "$29.99",
    productMarketPrice: "$59.98",
    shippingLabel: "Shipping",
    shippingPrice: "$5.99",
    insuranceLabel: "Shipping protection",
    insurancePrice: "$1.99",
    totalLabel: "Total",
    totalPrice: "$37.97",
    textColor: "#000000",
    priceColor: "#000000",
    salesPriceColor: "#e60000",
    marketPriceColor: "#000000",
  },
});

