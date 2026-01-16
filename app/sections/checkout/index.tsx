import { createSchema, type HydrogenComponentProps } from "@weaverse/hydrogen";
import { forwardRef, useEffect, useRef } from "react";
import { Section, sectionSettings } from "~/components/section";
import { useAnimation } from "~/hooks/use-animation";
import { CheckoutProvider, useCheckout } from "./checkout-context";
import { trackAxonEvent } from "~/utils/axon-pixel";

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

// Inner component that can use checkout context
function CheckoutContent({
  ref,
  ...props
}: CheckoutProps & { ref?: React.Ref<HTMLElement> }) {
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
  const { selectedProducts } = useCheckout();
  const hasReportedRef = useRef<Set<string>>(new Set());

  // Track view_item and add_to_cart events when products are present
  useEffect(() => {
    if (selectedProducts.length === 0) {
      return;
    }

    // Determine currency from first product
    const firstProduct = selectedProducts[0];
    const currency = firstProduct.price
      ? typeof firstProduct.price === "object"
        ? firstProduct.price.currencyCode
        : "USD"
      : "USD";

    // Track view_item event for each product (only once per product)
    selectedProducts.forEach((product) => {
      const productKey = `view_${product.id}`;
      if (!hasReportedRef.current.has(productKey)) {
        const productPrice = product.price as
          | { amount: string; currencyCode?: string }
          | string
          | null
          | undefined;

        const priceAmount = productPrice != null
          ? typeof productPrice === "object"
            ? parseFloat(productPrice.amount || "0")
            : parseFloat(String(productPrice).replace(/[^0-9.-]+/g, "")) || 0
          : 0;

        const priceCurrency = productPrice != null && typeof productPrice === "object" && productPrice.currencyCode
          ? productPrice.currencyCode
          : currency;

        // Use standard GTM/GA4 format for view_item event with extended Shopify data
        trackAxonEvent("view_item", {
          currency: priceCurrency,
          value: priceAmount,
          items: [
            {
              item_id: product.variantId || product.id || "",
              item_name: product.title || "",
              item_variant: product.variant || "",
              item_brand: product.vendor || "",
              item_category: product.productType || "",
              item_category2: product.tags?.[0] || "",
              item_category3: product.tags?.[1] || "",
              item_category4: product.tags?.[2] || "",
              item_category5: product.tags?.[3] || "",
              price: priceAmount,
              quantity: 1,
              // Additional Shopify fields
              ...(product.sku && { item_sku: product.sku }),
              ...(product.imageUrl && { item_image_url: product.imageUrl }),
              ...(product.productUrl && { item_url: product.productUrl }),
            },
          ],
        });

        hasReportedRef.current.add(productKey);
      }
    });

    // Track add_to_cart event for each product
    selectedProducts.forEach((product) => {
      const cartKey = `cart_${product.id}_${product.quantity}`;
      if (!hasReportedRef.current.has(cartKey)) {
        const productPrice = product.price as
          | { amount: string; currencyCode?: string }
          | string
          | null
          | undefined;

        const priceAmount = productPrice != null
          ? typeof productPrice === "object"
            ? parseFloat(productPrice.amount || "0")
            : parseFloat(String(productPrice).replace(/[^0-9.-]+/g, "")) || 0
          : 0;

        const priceCurrency = productPrice != null && typeof productPrice === "object" && productPrice.currencyCode
          ? productPrice.currencyCode
          : currency;

        const totalValue = priceAmount * (product.quantity || 1);

        // Use standard GTM/GA4 format for add_to_cart event with extended Shopify data
        trackAxonEvent("add_to_cart", {
          currency: priceCurrency,
          value: totalValue,
          items: [
            {
              item_id: product.variantId || product.id || "",
              item_name: product.title || "",
              item_variant: product.variant || "",
              item_brand: product.vendor || "",
              item_category: product.productType || "",
              item_category2: product.tags?.[0] || "",
              item_category3: product.tags?.[1] || "",
              item_category4: product.tags?.[2] || "",
              item_category5: product.tags?.[3] || "",
              price: priceAmount,
              quantity: product.quantity || 1,
              // Additional Shopify fields
              ...(product.sku && { item_sku: product.sku }),
              ...(product.imageUrl && { item_image_url: product.imageUrl }),
              ...(product.productUrl && { item_url: product.productUrl }),
            },
          ],
        });

        hasReportedRef.current.add(cartKey);
      }
    });
  }, [selectedProducts]);

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
  );
}

export const Checkout = forwardRef<HTMLElement, CheckoutProps>(
  (props, ref) => {
    return (
      <CheckoutProvider>
        <CheckoutContent ref={ref} {...props} />
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

