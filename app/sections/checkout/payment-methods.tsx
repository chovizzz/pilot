import {
  createSchema,
  type ComponentLoaderArgs,
  type HydrogenComponentProps,
} from "@weaverse/hydrogen";
import { ShopPayButton } from "@shopify/hydrogen";
import { forwardRef, useMemo, useEffect, useRef, useCallback } from "react";
import type { GetShopPrimaryDomainQuery } from "storefront-api.generated";
import { useCheckout } from "./checkout-context";
import { trackAxonEvent } from "~/utils/axon-pixel";

const SHOP_QUERY = `#graphql
  query getShopPrimaryDomain {
    shop {
      primaryDomain {
        url
      }
    }
  }
` as const;

interface CheckoutPaymentMethodsData {
  checkoutButtonText?: string;
  checkoutButtonColor?: string;
  checkoutButtonBgColor?: string;
  checkoutButtonSize?: number;
  showOtherMethodsText?: boolean;
  otherMethodsText?: string;
  columns?: "1" | "2";
  gap?: number;
}

type CheckoutPaymentMethodsLoaderData = {
  storeDomain: string | null;
};

type CheckoutPaymentMethodsProps = HydrogenComponentProps<
  Awaited<ReturnType<typeof loader>>
> &
  CheckoutPaymentMethodsData;

export const CheckoutPaymentMethods = forwardRef<
  HTMLDivElement,
  CheckoutPaymentMethodsProps
>((props, ref) => {
  const {
    loaderData,
    checkoutButtonText = "Checkout",
    checkoutButtonColor = "#ffffff",
    checkoutButtonBgColor = "#00af57",
    checkoutButtonSize = 20,
    showOtherMethodsText = true,
    otherMethodsText = "OR CHECKOUT WITH OTHER METHODS",
    columns = "2",
    gap = 10,
    children,
    ...rest
  } = props as CheckoutPaymentMethodsProps;

  const { selectedProducts, getTotalPrice } = useCheckout();
  const hasTriggeredBeginCheckout = useRef(false);
  const checkoutButtonSectionRef = useRef<HTMLDivElement>(null);

  const gridCols = columns === "1" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-2";

  // Get storeDomain from loader or fallback
  const storeDomain = useMemo(() => {
    if (loaderData?.storeDomain) {
      return loaderData.storeDomain;
    }
    // Fallback: try to extract from window location
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      if (hostname.includes("myshopify.com")) {
        return hostname;
      }
      const metaStoreDomain = document.querySelector('meta[name="shopify-store-domain"]');
      if (metaStoreDomain) {
        return metaStoreDomain.getAttribute("content") || "";
      }
    }
    return "";
  }, [loaderData?.storeDomain]);

  // Prepare variantIdsAndQuantities for ShopPayButton
  const variantIdsAndQuantities = useMemo(() => {
    return selectedProducts
      .filter(p => p.variantId) // Only include products with Shopify variant IDs
      .map(p => ({
        id: p.variantId!,
        quantity: p.quantity,
      }));
  }, [selectedProducts]);

  const canCheckout = variantIdsAndQuantities.length > 0 && storeDomain;

  // Trigger begin_checkout event when payment button is clicked
  const triggerBeginCheckout = useCallback(() => {
    if (hasTriggeredBeginCheckout.current || selectedProducts.length === 0) {
      return;
    }

    const totalPrice = getTotalPrice();
    const checkoutData = {
      event: "begin_checkout",
      currency: totalPrice?.currencyCode || "USD",
      value: totalPrice ? parseFloat(totalPrice.amount) : 0,
      items: selectedProducts.map((product) => {
        const price = typeof product.price === "object"
          ? parseFloat(product.price.amount)
          : parseFloat(String(product.price).replace(/[^0-9.-]+/g, "")) || 0;
        return {
          item_id: product.variantId || product.id,
          item_name: product.title,
          item_variant: product.variant,
          price: price,
          quantity: product.quantity,
        };
      }),
    };
    window.dataLayer?.push(checkoutData);
    // Track Axon Pixel begin_checkout event
    trackAxonEvent("begin_checkout", {
      currency: checkoutData.currency,
      value: checkoutData.value,
      items: checkoutData.items.map((item) => ({
        item_id: item.item_id,
        item_name: item.item_name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
    hasTriggeredBeginCheckout.current = true;
    console.log("CustomAnalytics - Begin checkout:", checkoutData);
  }, [selectedProducts, getTotalPrice]);

  useEffect(() => {
    if (!canCheckout || selectedProducts.length === 0) {
      return;
    }

    const handlePaymentClick = (e: MouseEvent) => {
      // Check if click is on ShopPayButton or any payment button
      const target = e.target as HTMLElement;
      const isPaymentButton = 
        target.closest('shop-pay-button') ||
        target.closest('shopify-paypal-button') ||
        target.closest('shopify-google-pay-button') ||
        target.closest('shopify-apple-pay-button') ||
        target.closest('.checkout-button-section') ||
        target.closest('button[data-payment-button]') ||
        target.closest('[data-payment-plugin-id]') ||
        target.id === 'checkout-button' ||
        (target.tagName === 'BUTTON' && target.closest('.express-checkout-box-section'));

      if (isPaymentButton) {
        triggerBeginCheckout();
      }
    };

    // Listen for clicks on the document (event delegation with capture phase)
    document.addEventListener('click', handlePaymentClick, true);

    // Use MutationObserver to watch for ShopPayButton being added to DOM
    const observer = new MutationObserver(() => {
      const shopPayButton = checkoutButtonSectionRef.current?.querySelector('shop-pay-button');
      if (shopPayButton && !shopPayButton.hasAttribute('data-checkout-listener')) {
        shopPayButton.setAttribute('data-checkout-listener', 'true');
        shopPayButton.addEventListener('click', triggerBeginCheckout, { once: true });
      }
    });

    // Observe the checkout button section for changes
    if (checkoutButtonSectionRef.current) {
      observer.observe(checkoutButtonSectionRef.current, {
        childList: true,
        subtree: true,
      });
    }

    // Also check immediately in case button is already rendered
    const shopPayButton = checkoutButtonSectionRef.current?.querySelector('shop-pay-button');
    if (shopPayButton && !shopPayButton.hasAttribute('data-checkout-listener')) {
      shopPayButton.setAttribute('data-checkout-listener', 'true');
      shopPayButton.addEventListener('click', triggerBeginCheckout, { once: true });
    }

    return () => {
      document.removeEventListener('click', handlePaymentClick, true);
      observer.disconnect();
    };
  }, [canCheckout, selectedProducts.length, triggerBeginCheckout]);

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

      {/* Checkout Button - Using ShopPayButton */}
      <div className="order-3 checkoutSection">
        <div ref={checkoutButtonSectionRef} className="centerbox checkout-button-section">
          {canCheckout ? (
            <ShopPayButton
              width="100%"
              variantIdsAndQuantities={variantIdsAndQuantities}
              storeDomain={storeDomain}
            />
          ) : (
            <button
              id="checkout-button"
              className="w-full max-h-[80px] cursor-pointer centerbox bg-black border border-transparent rounded-md py-3 px-8 focus:outline-none sm:order-last disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: checkoutButtonBgColor,
                color: checkoutButtonColor,
                fontSize: `${checkoutButtonSize}px`,
              }}
              disabled
            >
              <div className="flex flex-col justify-center items-center">
                <span className="block">{checkoutButtonText}</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

CheckoutPaymentMethods.displayName = "CheckoutPaymentMethods";

export default CheckoutPaymentMethods;

export const loader = async (
  args: ComponentLoaderArgs<CheckoutPaymentMethodsData>,
): Promise<CheckoutPaymentMethodsLoaderData> => {
  const { weaverse } = args;
  const { storefront } = weaverse;
  try {
    const { shop } = await storefront.query<GetShopPrimaryDomainQuery>(
      SHOP_QUERY,
      { cache: storefront.CacheLong() },
    );
    return {
      storeDomain: shop?.primaryDomain?.url || null,
    };
  } catch (error) {
    console.error("Error fetching shop primary domain:", error);
    return {
      storeDomain: null,
    };
  }
};

export const schema = createSchema({
  type: "checkout--payment-methods",
  title: "Payment Methods",
  childTypes: ["checkout--payment-method-item"],
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
          defaultValue: "2",
          configs: {
            options: [
              { value: "1", label: "1 Column" },
              { value: "2", label: "2 Columns" },
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
    columns: "2",
    gap: 10,
  },
});

