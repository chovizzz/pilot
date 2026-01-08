import {
  createSchema,
  type ComponentLoaderArgs,
  type HydrogenComponentProps,
  type WeaverseImage,
} from "@weaverse/hydrogen";
import { ShopPayButton } from "@shopify/hydrogen";
import { forwardRef, useEffect, useRef, useMemo } from "react";
import type { GetShopPrimaryDomainQuery } from "storefront-api.generated";
import { Image } from "~/components/image";
import { useAnimation } from "~/hooks/use-animation";
import { useCheckout } from "./checkout-context";

const SHOP_QUERY = `#graphql
  query getShopPrimaryDomain {
    shop {
      primaryDomain {
        url
      }
    }
  }
` as const;

// PayPal SDK types
declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        style?: {
          layout?: "vertical" | "horizontal";
          color?: "gold" | "blue" | "silver" | "white" | "black";
          shape?: "rect" | "pill";
          label?: "paypal" | "checkout" | "buynow" | "pay" | "installment";
        };
        createOrder?: (data: any, actions: any) => Promise<string>;
        onApprove?: (data: any, actions: any) => Promise<void>;
      }) => {
        render: (selector: string) => void;
      };
    };
  }
}

interface CheckoutPaymentMethodItemData {
  usePaymentPlugin?: boolean;
  integrationType?: "paypal-sdk" | "shopify-integrated" | "custom";
  paymentPluginId?: string;
  paymentPluginContainerId?: string;
  paypalClientId?: string;
  shopifyPaymentType?: "paypal" | "google_pay" | "apple_pay" | "shopify_pay";
  buttonText?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonIcon?: WeaverseImage | string;
  buttonIconPosition?: "left" | "right" | "center";
  secondIcon?: WeaverseImage | string;
  showDivider?: boolean;
  dividerText?: string;
  cardInfo?: string;
  buttonSize?: number;
  padding?: number;
  borderRadius?: number;
  gap?: number;
}

type CheckoutPaymentMethodItemLoaderData = {
  storeDomain: string | null;
};

type CheckoutPaymentMethodItemProps = HydrogenComponentProps<
  Awaited<ReturnType<typeof loader>>
> &
  CheckoutPaymentMethodItemData;

export const CheckoutPaymentMethodItem = forwardRef<
  HTMLDivElement,
  CheckoutPaymentMethodItemProps
>((props, ref) => {
  const {
    loaderData,
    usePaymentPlugin = false,
    integrationType,
    paymentPluginId,
    paymentPluginContainerId,
    paypalClientId,
    shopifyPaymentType = "paypal",
    buttonText = "Pay with PayPal",
    buttonBgColor = "#FFC439",
    buttonTextColor = "#000000",
    buttonIcon,
    buttonIconPosition = "left",
    secondIcon,
    showDivider = false,
    dividerText,
    cardInfo,
    buttonSize = 16,
    padding = 12,
    borderRadius = 6,
    gap = 8,
    ...rest
  } = props;

  const animation = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const paypalLoadedRef = useRef(false);
  const shopifyInitializedRef = useRef(false);
  const { selectedProducts } = useCheckout();

  // Determine integration type (backward compatibility) - memoize to prevent re-renders
  const effectiveIntegrationType = useMemo(
    () => integrationType || (usePaymentPlugin ? "paypal-sdk" : "custom"),
    [integrationType, usePaymentPlugin]
  );

  // Get storeDomain from loader or fallback to window location
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

  // PayPal SDK Integration
  useEffect(() => {
    if (effectiveIntegrationType !== "paypal-sdk" || !paypalClientId || !paymentPluginContainerId) {
      return;
    }

    // Prevent re-initialization
    if (paypalLoadedRef.current) {
      return;
    }

    // Check if PayPal SDK is already loaded
    if (window.paypal) {
      paypalLoadedRef.current = true;
      try {
        window.paypal.Buttons({
          style: {
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
          },
          createOrder: (data, actions) => {
            // This will be handled by your checkout flow
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: "0.00", // This should be replaced with actual cart total
                },
              }],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              // Handle successful payment
              console.log("Payment successful:", details);
            });
          },
        }).render(`#${paymentPluginContainerId}`);
      } catch (error) {
        console.error("Error initializing PayPal button:", error);
        paypalLoadedRef.current = false; // Reset on error
      }
      return;
    }

    // Load PayPal SDK if not already loaded
    if (!document.querySelector(`script[src*="paypal.com/sdk"]`)) {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&components=buttons&currency=USD`;
      script.async = true;
      script.onload = () => {
        paypalLoadedRef.current = true;
        if (window.paypal) {
          const container = document.getElementById(paymentPluginContainerId);
          if (container) {
            try {
              window.paypal.Buttons({
                style: {
                  layout: "vertical",
                  color: "gold",
                  shape: "rect",
                  label: "paypal",
                },
                createOrder: (data, actions) => {
                  return actions.order.create({
                    purchase_units: [{
                      amount: {
                        value: "0.00",
                      },
                    }],
                  });
                },
                onApprove: (data, actions) => {
                  return actions.order.capture().then((details) => {
                    console.log("Payment successful:", details);
                  });
                },
              }).render(`#${paymentPluginContainerId}`);
            } catch (error) {
              console.error("Error initializing PayPal button:", error);
              paypalLoadedRef.current = false; // Reset on error
            }
          }
        }
      };
      script.onerror = () => {
        console.error("Failed to load PayPal SDK");
        paypalLoadedRef.current = false; // Reset on error
      };
      document.body.appendChild(script);
    }
  }, [effectiveIntegrationType, paypalClientId, paymentPluginContainerId]);

  // Shopify Integrated Payment Methods
  useEffect(() => {
    if (effectiveIntegrationType !== "shopify-integrated" || !paymentPluginContainerId) {
      return;
    }

    // Skip Shop Pay as it's handled separately with ShopPayButton component
    if (shopifyPaymentType === "shopify_pay") {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    // Prevent re-initialization
    if (shopifyInitializedRef.current) {
      return;
    }

    // Check if we have required data
    if (variantIdsAndQuantities.length === 0) {
      console.warn("No products selected for Shopify payment button");
      return;
    }

    if (!storeDomain) {
      console.warn("Store domain is required for Shopify payment button");
      return;
    }

    // Initialize Shopify payment button
    const initShopifyButton = () => {
      // Clear container
      container.innerHTML = "";
      
      // Try to create Web Component directly (they should be auto-loaded by Shopify)
      let webComponent: HTMLElement | null = null;
      
      try {
        if (shopifyPaymentType === "paypal") {
          webComponent = document.createElement("shopify-paypal-button");
        } else if (shopifyPaymentType === "google_pay") {
          webComponent = document.createElement("shopify-google-pay-button");
        } else if (shopifyPaymentType === "apple_pay") {
          webComponent = document.createElement("shopify-apple-pay-button");
        }

        if (webComponent) {
          // Set attributes
          webComponent.setAttribute("variant-ids-and-quantities", JSON.stringify(variantIdsAndQuantities));
          webComponent.setAttribute("store-domain", storeDomain);
          webComponent.style.width = "100%";
          
          container.appendChild(webComponent);
          shopifyInitializedRef.current = true;
          return;
        }
      } catch (error) {
        console.warn("Web Component creation failed, trying fallback method:", error);
      }

      // Fallback: Use DOM structure that Shopify scripts can initialize
      container.className = "shopify-payment-button";
      container.setAttribute("data-payment-method", shopifyPaymentType);
      container.setAttribute("data-variant-ids-and-quantities", JSON.stringify(variantIdsAndQuantities));
      container.setAttribute("data-store-domain", storeDomain);
      
      const buttonWrapper = document.createElement("div");
      buttonWrapper.className = "shopify-payment-button__button";
      buttonWrapper.setAttribute("data-payment-button", shopifyPaymentType);
      
      if (shopifyPaymentType === "paypal") {
        buttonWrapper.id = `paypal-button-${paymentPluginContainerId}`;
        container.setAttribute("data-paypal-button", "true");
      } else if (shopifyPaymentType === "google_pay") {
        buttonWrapper.id = `google-pay-button-${paymentPluginContainerId}`;
      } else if (shopifyPaymentType === "apple_pay") {
        buttonWrapper.id = `apple-pay-button-${paymentPluginContainerId}`;
      }
      
      container.appendChild(buttonWrapper);
      
      // Try to trigger Shopify's initialization
      // Wait a bit for any Shopify scripts to load
      setTimeout(() => {
        const event = new CustomEvent("shopify:payment:init", {
          detail: { 
            containerId: paymentPluginContainerId, 
            paymentType: shopifyPaymentType,
            variantIdsAndQuantities,
            storeDomain
          }
        });
        window.dispatchEvent(event);
        
        // Also try direct API if available
        const shopify = (window as any).Shopify;
        if (shopify?.checkout?.initializePaymentButtons) {
          try {
            shopify.checkout.initializePaymentButtons();
          } catch (e) {
            console.warn("Shopify checkout API not available:", e);
          }
        }
      }, 500);
    };

    // Initialize with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      initShopifyButton();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      shopifyInitializedRef.current = false;
    };
  }, [effectiveIntegrationType, shopifyPaymentType, paymentPluginContainerId, variantIdsAndQuantities, storeDomain]);

  // Prepare icon data
  const iconData: Partial<WeaverseImage> | undefined = buttonIcon
    ? typeof buttonIcon === "string"
      ? { url: buttonIcon, altText: "Payment icon" }
      : buttonIcon
    : undefined;

  // Prepare second icon data (e.g., for VISA after divider)
  const secondIconData: Partial<WeaverseImage> | undefined = secondIcon
    ? typeof secondIcon === "string"
      ? { url: secondIcon, altText: "Second payment icon" }
      : secondIcon
    : undefined;

  // If using Shopify Integrated with Shop Pay, use ShopPayButton component
  if (effectiveIntegrationType === "shopify-integrated" && shopifyPaymentType === "shopify_pay") {
    if (variantIdsAndQuantities.length === 0 || !storeDomain) {
      // Don't render if no products selected or no store domain
      return null;
    }
    return (
      <div ref={ref} {...rest} className="w-full" data-motion="fade-up" {...animation}>
        <div className="payment-info-box">
          <ShopPayButton
            width="100%"
            variantIdsAndQuantities={variantIdsAndQuantities}
            storeDomain={storeDomain}
          />
        </div>
      </div>
    );
  }

  // If using payment plugin (PayPal SDK or other Shopify Integrated), render container
  if (
    (effectiveIntegrationType === "paypal-sdk" || effectiveIntegrationType === "shopify-integrated") &&
    paymentPluginContainerId
  ) {
    return (
      <div ref={ref} {...rest} className="w-full" data-motion="fade-up" {...animation}>
        <div className="payment-info-box text-[0px]">
          <div
            ref={containerRef}
            id={paymentPluginContainerId}
            data-payment-plugin-id={paymentPluginId}
            data-integration-type={effectiveIntegrationType}
            data-shopify-payment-type={shopifyPaymentType}
            className="w-full"
            style={{
              minHeight: "48px",
            }}
          >
            {/* Payment plugin will inject the button here */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} {...rest} className="w-full" data-motion="fade-up" {...animation}>
      <div className="payment-info-box text-[0px]">
        <button
          className="w-full cursor-pointer border border-transparent rounded-md focus:outline-none flex items-center"
          style={{
            backgroundColor: buttonBgColor,
            color: buttonTextColor,
            fontSize: `${buttonSize}px`,
            padding: `${padding}px`,
            borderRadius: `${borderRadius}px`,
            gap: `${gap}px`,
            justifyContent: buttonIconPosition === "center" ? "center" : "flex-start",
          }}
        >
          {iconData && buttonIconPosition === "left" && (
            <div className="shrink-0 flex items-center">
              <Image
                data={iconData}
                alt="Payment icon"
                className="max-h-[24px] w-auto object-contain"
                loading="lazy"
                sizes="auto"
              />
            </div>
          )}

          {showDivider && dividerText && (
            <>
              <span className="shrink-0 font-medium">{dividerText}</span>
              <div
                className="h-4 w-px shrink-0 mx-1"
                style={{ backgroundColor: `${buttonTextColor}30` }}
              ></div>
              {secondIconData && (
                <div className="shrink-0 flex items-center">
                  <Image
                    data={secondIconData}
                    alt="Second payment icon"
                    className="max-h-[24px] w-auto object-contain"
                    loading="lazy"
                    sizes="auto"
                  />
                </div>
              )}
            </>
          )}

          {iconData && buttonIconPosition === "center" && (
            <div className="shrink-0 flex items-center">
              <Image
                data={iconData}
                alt="Payment icon"
                className="max-h-[24px] w-auto object-contain"
                loading="lazy"
                sizes="auto"
              />
            </div>
          )}

          <span className={buttonIconPosition === "center" ? "font-medium" : "flex-1 text-center font-medium"}>
            {buttonText}
          </span>

          {cardInfo && (
            <span className="shrink-0 text-sm opacity-90 ml-auto">{cardInfo}</span>
          )}

          {iconData && buttonIconPosition === "right" && (
            <div className="shrink-0 flex items-center ml-auto">
              <Image
                data={iconData}
                alt="Payment icon"
                className="max-h-[24px] w-auto object-contain"
                loading="lazy"
                sizes="auto"
              />
            </div>
          )}
        </button>
      </div>
    </div>
  );
});

CheckoutPaymentMethodItem.displayName = "CheckoutPaymentMethodItem";

export default CheckoutPaymentMethodItem;

export const loader = async (
  args: ComponentLoaderArgs<CheckoutPaymentMethodItemData>,
): Promise<CheckoutPaymentMethodItemLoaderData> => {
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
    console.error("Error loading shop domain:", error);
    return {
      storeDomain: null,
    };
  }
};

export const schema = createSchema({
  type: "checkout--payment-method-item",
  title: "Payment Method Item",
  settings: [
    {
      group: "Payment Integration",
      inputs: [
        {
          type: "select",
          name: "integrationType",
          label: "Integration Type",
          defaultValue: "custom",
          configs: {
            options: [
              { value: "custom", label: "Custom Button" },
              { value: "paypal-sdk", label: "PayPal SDK" },
              { value: "shopify-integrated", label: "Shopify Integrated" },
            ],
          },
          helpText: "Choose how to integrate the payment method. 'Shopify Integrated' uses payment providers enabled in Shopify Admin (Settings → Payments). This is the recommended way for PayPal, Google Pay, Apple Pay, etc. 'PayPal SDK' is for direct PayPal integration. 'Custom Button' is for custom payment flows.",
        },
        {
          type: "text",
          name: "paypalClientId",
          label: "PayPal Client ID",
          condition: (data: CheckoutPaymentMethodItemData) => data.integrationType === "paypal-sdk",
          helpText: "Your PayPal Client ID from PayPal Developer Dashboard (https://developer.paypal.com/)",
        },
        {
          type: "select",
          name: "shopifyPaymentType",
          label: "Shopify Payment Type",
          condition: (data: CheckoutPaymentMethodItemData) => data.integrationType === "shopify-integrated",
          defaultValue: "paypal",
          configs: {
            options: [
              { value: "paypal", label: "PayPal" },
              { value: "google_pay", label: "Google Pay" },
              { value: "apple_pay", label: "Apple Pay" },
              { value: "shopify_pay", label: "Shopify Pay" },
            ],
          },
          helpText: "Select the payment method type. Make sure it's enabled in your Shopify Admin → Settings → Payments. For PayPal, Google Pay, Apple Pay, these should be configured in Shopify's payment settings first.",
        },
        {
          type: "text",
          name: "paymentPluginContainerId",
          label: "Container ID",
          condition: (data: CheckoutPaymentMethodItemData) =>
            data.integrationType === "paypal-sdk" || data.integrationType === "shopify-integrated",
          defaultValue: "payment-button-container",
          helpText: "Unique ID for the container where the payment button will be rendered.",
        },
        {
          type: "switch",
          name: "usePaymentPlugin",
          label: "Use Payment Plugin (Legacy)",
          defaultValue: false,
          helpText: "Legacy option for backward compatibility. Use 'Integration Type' instead.",
        },
        {
          type: "text",
          name: "paymentPluginId",
          label: "Payment Plugin ID (Legacy)",
          condition: (data: CheckoutPaymentMethodItemData) =>
            data.usePaymentPlugin === true && !data.integrationType,
          helpText: "Legacy option. Use 'Integration Type' instead.",
        },
      ],
    },
    {
      group: "Content",
      inputs: [
        {
          type: "text",
          name: "buttonText",
          label: "Button Text",
          defaultValue: "Pay with PayPal",
          condition: (data: CheckoutPaymentMethodItemData) =>
            data.integrationType !== "paypal-sdk" &&
            data.integrationType !== "shopify-integrated" &&
            (!data.integrationType && !data.usePaymentPlugin),
          helpText: "Only used when not using a payment plugin",
        },
        {
          type: "image",
          name: "buttonIcon",
          label: "Button Icon/Logo",
          condition: (data: CheckoutPaymentMethodItemData) =>
            data.integrationType !== "paypal-sdk" &&
            data.integrationType !== "shopify-integrated" &&
            (!data.integrationType && !data.usePaymentPlugin),
          helpText: "Optional: Upload a payment provider logo or icon. Only used when not using a payment plugin",
        },
        {
          type: "select",
          name: "buttonIconPosition",
          label: "Icon Position",
          defaultValue: "left",
          condition: (data: CheckoutPaymentMethodItemData) =>
            data.integrationType !== "paypal-sdk" &&
            data.integrationType !== "shopify-integrated" &&
            (!data.integrationType && !data.usePaymentPlugin),
          configs: {
            options: [
              { value: "left", label: "Left" },
              { value: "right", label: "Right" },
              { value: "center", label: "Center" },
            ],
          },
        },
        {
          type: "image",
          name: "secondIcon",
          label: "Second Icon (After Divider)",
          condition: (data: CheckoutPaymentMethodItemData) =>
            data.integrationType !== "paypal-sdk" &&
            data.integrationType !== "shopify-integrated" &&
            (!data.integrationType && !data.usePaymentPlugin),
          helpText: "Optional: Second icon to display after divider (e.g., VISA logo). Only used when not using a payment plugin",
        },
        {
          type: "switch",
          name: "showDivider",
          label: "Show Divider",
          defaultValue: false,
          condition: (data: CheckoutPaymentMethodItemData) =>
            data.integrationType !== "paypal-sdk" &&
            data.integrationType !== "shopify-integrated" &&
            (!data.integrationType && !data.usePaymentPlugin),
          helpText: "Show a divider with text (e.g., for G Pay | VISA). Only used when not using a payment plugin",
        },
        {
          type: "text",
          name: "dividerText",
          label: "Divider Text",
          defaultValue: "G Pay",
          condition: (data: CheckoutPaymentMethodItemData) =>
            data.showDivider === true &&
            data.integrationType !== "paypal-sdk" &&
            data.integrationType !== "shopify-integrated" &&
            (!data.integrationType && !data.usePaymentPlugin),
        },
        {
          type: "text",
          name: "cardInfo",
          label: "Card Info",
          defaultValue: "... 2165",
          condition: (data: CheckoutPaymentMethodItemData) =>
            data.integrationType !== "paypal-sdk" &&
            data.integrationType !== "shopify-integrated" &&
            (!data.integrationType && !data.usePaymentPlugin),
          helpText: "Optional: Display saved card information (e.g., ... 2165). Only used when not using a payment plugin",
        },
      ],
    },
    {
      group: "Layout",
      inputs: [
        {
          type: "range",
          name: "padding",
          label: "Button Padding",
          defaultValue: 12,
          condition: (data: CheckoutPaymentMethodItemData) =>
            data.integrationType !== "paypal-sdk" &&
            data.integrationType !== "shopify-integrated" &&
            (!data.integrationType && !data.usePaymentPlugin),
          configs: {
            min: 8,
            max: 24,
            step: 2,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "borderRadius",
          label: "Border Radius",
          defaultValue: 6,
          condition: (data: CheckoutPaymentMethodItemData) =>
            data.integrationType !== "paypal-sdk" &&
            data.integrationType !== "shopify-integrated" &&
            (!data.integrationType && !data.usePaymentPlugin),
          configs: {
            min: 0,
            max: 16,
            step: 1,
            unit: "px",
          },
        },
        {
          type: "range",
          name: "gap",
          label: "Icon/Text Gap",
          defaultValue: 8,
          condition: (data: CheckoutPaymentMethodItemData) =>
            data.integrationType !== "paypal-sdk" &&
            data.integrationType !== "shopify-integrated" &&
            (!data.integrationType && !data.usePaymentPlugin),
          configs: {
            min: 4,
            max: 16,
            step: 2,
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
          name: "buttonSize",
          label: "Button Text Size",
          defaultValue: 16,
          condition: (data: CheckoutPaymentMethodItemData) =>
            data.integrationType !== "paypal-sdk" &&
            data.integrationType !== "shopify-integrated" &&
            (!data.integrationType && !data.usePaymentPlugin),
          configs: {
            min: 12,
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
          name: "buttonBgColor",
          label: "Button Background Color",
          defaultValue: "#FFC439",
          condition: (data: CheckoutPaymentMethodItemData) =>
            data.integrationType !== "paypal-sdk" &&
            data.integrationType !== "shopify-integrated" &&
            (!data.integrationType && !data.usePaymentPlugin),
        },
        {
          type: "color",
          name: "buttonTextColor",
          label: "Button Text Color",
          defaultValue: "#000000",
          condition: (data: CheckoutPaymentMethodItemData) =>
            data.integrationType !== "paypal-sdk" &&
            data.integrationType !== "shopify-integrated" &&
            (!data.integrationType && !data.usePaymentPlugin),
        },
      ],
    },
  ],
  presets: {
    integrationType: "custom",
    usePaymentPlugin: false,
    shopifyPaymentType: "paypal",
    buttonText: "Pay with PayPal",
    buttonBgColor: "#FFC439",
    buttonTextColor: "#000000",
    buttonIconPosition: "left",
    showDivider: false,
    buttonSize: 16,
    padding: 12,
    borderRadius: 6,
    gap: 8,
  },
});

