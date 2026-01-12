import {
  createSchema,
  type ComponentLoaderArgs,
  type HydrogenComponentProps,
  type WeaverseImage,
  type WeaverseProduct,
} from "@weaverse/hydrogen";
import { Money } from "@shopify/hydrogen";
import { forwardRef, useState, useEffect, useId, useMemo } from "react";
import type { ProductQuery, ProductVariantFragment } from "storefront-api.generated";
import { Image } from "~/components/image";
import { PRODUCT_QUERY } from "~/graphql/queries";
import { useAnimation } from "~/hooks/use-animation";
import { useCheckout } from "./checkout-context";
import { VariantSelector } from "~/components/product/variant-selector";

interface CheckoutProductItemData {
  product?: WeaverseProduct;
  productImage?: WeaverseImage | string;
  productTag?: string;
  productTagColor?: string;
  productTagBgColor?: string;
  productVariant?: string;
  salesPrice?: string;
  marketPrice?: string;
  selected?: boolean;
  quantity?: number;
  borderColor?: string;
  selectedBorderColor?: string;
  selectedBgColor?: string;
  variantTextColor?: string;
  salesPriceColor?: string;
  marketPriceColor?: string;
  defaultVariantOptions?: string; // JSON string of selectedOptions: [{name: "Color", value: "Red"}, {name: "Size", value: "Large"}]
}

type CheckoutProductItemLoaderData = {
  product: ProductQuery["product"] | null;
};

type CheckoutProductItemProps = HydrogenComponentProps<
  CheckoutProductItemLoaderData
> &
  CheckoutProductItemData & {
    ref?: React.Ref<HTMLDivElement>;
  };

export const CheckoutProductItem = forwardRef<
  HTMLDivElement,
  CheckoutProductItemProps
>((props, ref) => {
  const {
    loaderData,
    product: weaverseProduct,
    productImage,
    productTag,
    productTagColor = "#ffffff",
    productTagBgColor = "#00afee",
    productVariant,
    salesPrice,
    marketPrice,
    selected = false,
    quantity = 1,
    borderColor = "#e5e7eb",
    selectedBorderColor = "#d9eef3",
    selectedBgColor = "#d9eef3",
    variantTextColor = "#000000",
    salesPriceColor = "#e60000",
    marketPriceColor = "#000000",
    ...rest
  } = props;

  const [isSelected, setIsSelected] = useState(selected);
  const [itemQuantity, setItemQuantity] = useState(quantity);
  const animation = useAnimation();
  const { addProduct, removeProduct, updateProductQuantity } = useCheckout();
  const productId = useId();

  // Get product data from loader (Shopify product) or manual input
  const shopifyProduct = loaderData?.product;
  
  // State for selected variant - initialize with loader's selected variant (from defaultVariantOptions) or first available variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantFragment | null>(
    shopifyProduct?.selectedOrFirstAvailableVariant || null
  );
  
  // Update selected variant when product changes (use loader's selected variant if configured)
  useEffect(() => {
    if (shopifyProduct?.selectedOrFirstAvailableVariant) {
      // Use the variant returned by loader (which respects defaultVariantOptions if configured)
      setSelectedVariant(shopifyProduct.selectedOrFirstAvailableVariant);
    }
  }, [shopifyProduct?.selectedOrFirstAvailableVariant?.id]);
  
  // If product is associated, use selected variant; otherwise use manual input
  const variant = selectedVariant || shopifyProduct?.selectedOrFirstAvailableVariant;
  
  // Product tag/title: prioritize product title
  const displayTag = shopifyProduct?.title || productTag;
  
  // Product variant: prioritize product variant options
  const displayVariant = shopifyProduct
    ? variant?.selectedOptions && variant.selectedOptions.length > 0
      ? variant.selectedOptions
          .map((opt: { name: string; value: string }) => `${opt.name}: ${opt.value}`)
          .join(" | ")
      : variant?.title || productVariant || ""
    : productVariant || "";
  
  // Get product image from selected variant or product or manual input
  const productImageData: Partial<WeaverseImage> | undefined = shopifyProduct
    ? (selectedVariant?.image
        ? {
            url: selectedVariant.image.url,
            altText: selectedVariant.image.altText || shopifyProduct.title || "Product",
            width: selectedVariant.image.width,
            height: selectedVariant.image.height,
          }
        : shopifyProduct.featuredImage
          ? {
              url: shopifyProduct.featuredImage.url,
              altText: shopifyProduct.featuredImage.altText || shopifyProduct.title || "Product",
            }
          : shopifyProduct.media?.nodes?.[0]?.previewImage
            ? {
                url: shopifyProduct.media.nodes[0].previewImage.url,
                altText: shopifyProduct.media.nodes[0].previewImage.altText || shopifyProduct.title || "Product",
                width: shopifyProduct.media.nodes[0].previewImage.width,
                height: shopifyProduct.media.nodes[0].previewImage.height,
              }
            : undefined)
    : productImage
      ? typeof productImage === "string"
        ? { url: productImage, altText: productTag || "Product" }
        : productImage
      : undefined;

  // Get prices from Shopify product or manual input
  // Prioritize product variant price if product is associated
  // Use useMemo to stabilize object references and prevent infinite loops
  const displaySalesPrice = useMemo(() => {
    if (shopifyProduct && variant?.price) {
      return { amount: variant.price.amount, currencyCode: variant.price.currencyCode };
    }
    return salesPrice || undefined;
  }, [shopifyProduct, variant?.price?.amount, variant?.price?.currencyCode, salesPrice]);

  const displayMarketPrice = useMemo(() => {
    if (shopifyProduct && variant?.compareAtPrice) {
      return { amount: variant.compareAtPrice.amount, currencyCode: variant.compareAtPrice.currencyCode };
    }
    return marketPrice || undefined;
  }, [shopifyProduct, variant?.compareAtPrice?.amount, variant?.compareAtPrice?.currencyCode, marketPrice]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, itemQuantity + delta);
    setItemQuantity(newQuantity);
    if (isSelected) {
      updateProductQuantity(productId, newQuantity);
    }
  };

  // Get Shopify variant ID for ShopPayButton - use selected variant
  const shopifyVariantId = selectedVariant?.id || shopifyProduct?.selectedOrFirstAvailableVariant?.id;

  const handleSelectionChange = (selected: boolean) => {
    setIsSelected(selected);
    if (selected) {
      addProduct({
        id: productId,
        title: displayTag || "",
        variant: displayVariant || "",
        variantId: shopifyVariantId,
        price: displaySalesPrice || "",
        compareAtPrice: displayMarketPrice,
        quantity: itemQuantity,
      });
    } else {
      removeProduct(productId);
    }
  };

  // Update product in context when quantity changes (only if selected)
  useEffect(() => {
    if (isSelected) {
      updateProductQuantity(productId, itemQuantity);
    }
  }, [isSelected, itemQuantity, productId, updateProductQuantity]);

  // Update product data in context when price/variant changes (only if selected)
  // Use stringified price objects to compare, or compare specific properties
  const salesPriceKey = useMemo(() => {
    if (typeof displaySalesPrice === "object" && displaySalesPrice) {
      return `${displaySalesPrice.amount}-${displaySalesPrice.currencyCode}`;
    }
    return String(displaySalesPrice || "");
  }, [displaySalesPrice]);

  const marketPriceKey = useMemo(() => {
    if (typeof displayMarketPrice === "object" && displayMarketPrice) {
      return `${displayMarketPrice.amount}-${displayMarketPrice.currencyCode}`;
    }
    return String(displayMarketPrice || "");
  }, [displayMarketPrice]);

  // Update product in context when variant, price, or quantity changes (only if selected)
  useEffect(() => {
    if (isSelected && shopifyProduct && selectedVariant) {
      const currentDisplayVariant = selectedVariant.selectedOptions && selectedVariant.selectedOptions.length > 0
        ? selectedVariant.selectedOptions
            .map((opt: { name: string; value: string }) => `${opt.name}: ${opt.value}`)
            .join(" | ")
        : selectedVariant.title || "";
      const currentPrice = selectedVariant.price
        ? { amount: selectedVariant.price.amount, currencyCode: selectedVariant.price.currencyCode }
        : displaySalesPrice || "";
      const currentComparePrice = selectedVariant.compareAtPrice
        ? { amount: selectedVariant.compareAtPrice.amount, currencyCode: selectedVariant.compareAtPrice.currencyCode }
        : displayMarketPrice;
      addProduct({
        id: productId,
        title: displayTag || "",
        variant: currentDisplayVariant,
        variantId: selectedVariant.id,
        price: currentPrice,
        compareAtPrice: currentComparePrice,
        quantity: itemQuantity,
      });
    }
  }, [isSelected, productId, displayTag, selectedVariant?.id, salesPriceKey, marketPriceKey, itemQuantity, addProduct, shopifyProduct]);

  return (
    <div
      ref={ref}
      {...rest}
      className="relative flex items-center justify-between rounded-md product-hover product-row border mb-2.5 sm:mb-4 p-2 md:p-3 cursor-pointer"
      style={{
        backgroundColor: isSelected ? selectedBgColor : "transparent",
        borderColor: isSelected ? selectedBorderColor : borderColor,
        borderWidth: isSelected ? "3px" : "1px",
      }}
      onClick={() => handleSelectionChange(!isSelected)}
      data-motion="fade-up"
      {...animation}
    >
      <div className="flex items-center w-full cursor-pointer sm:w-3/4">
        {/* Checkbox */}
        <div className="flex items-center justify-center h-5 product-option mr-2.5 sm:mr-3">
          <div className="relative">
            <span className="absolute w-full h-full z-10 inline-block"></span>
            <input
              name="product"
              type="checkbox"
              checked={isSelected}
              onChange={(e) => handleSelectionChange(e.target.checked)}
              className="w-5 h-5 text-green-700 rounded border border-gray-300 cursor-pointer"
            />
          </div>
        </div>

        {/* Product Image */}
        {productImageData && (
          <Image
            data={productImageData}
            alt={displayTag || ""}
            className="ml-2.5 sm:ml-3 product-image h-[6.25rem] w-[6.25rem] object-cover rounded"
            loading="lazy"
            sizes="auto"
          />
        )}

        {/* Product Info */}
        <div className="ml-2.5 sm:ml-3 text-base leading-4 flex flex-col justify-around product-info flex-1">
          {/* Product Tag */}
          {displayTag && (
            <div className="mb-2 flex flex-wrap gap-1">
              <label
                className="px-2 py-1 rounded product-tag-info text-sm font-medium"
                style={{
                  backgroundColor: productTagBgColor,
                  color: productTagColor,
                }}
              >
                {displayTag}
              </label>
            </div>
          )}

          {/* Product Variant Selector or Display */}
          {shopifyProduct && selectedVariant ? (
            <div 
              className="product-variant-selector mb-2" 
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: "0.875rem" }}
            >
              <VariantSelector
                product={shopifyProduct}
                selectedVariant={selectedVariant}
                setSelectedVariant={(newVariant) => {
                  setSelectedVariant(newVariant);
                }}
              />
            </div>
          ) : displayVariant ? (
            <div
              className="text-gray-500 block leading-4 product-tag product-variant mb-1 text-base"
              style={{ color: variantTextColor }}
            >
              {displayVariant}
            </div>
          ) : null}

          {/* Prices */}
          <div className="flex text-base items-center">
            {displaySalesPrice && (
              <div
                className="font-bold sales-price text-xl"
                style={{ color: salesPriceColor }}
              >
                {typeof displaySalesPrice === "string" ? (
                  displaySalesPrice
                ) : (
                  <Money
                    data={displaySalesPrice}
                    withoutTrailingZeros
                    as="span"
                  />
                )}
              </div>
            )}
            {displayMarketPrice && (
              <div
                className="line-through ml-1 market-price text-sm"
                style={{ color: marketPriceColor }}
              >
                {typeof displayMarketPrice === "string" ? (
                  displayMarketPrice
                ) : (
                  <Money
                    data={displayMarketPrice}
                    withoutTrailingZeros
                    as="span"
                  />
                )}
              </div>
            )}
          </div>

          {/* Mobile Quantity Selector */}
          <div className="input-num-none w-28 py-0 sm:py-2 border border-gray-200 mt-1 rounded-md items-center justify-center flex sm:hidden">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(-1);
              }}
              className="h-6 w-6 flex items-center justify-center cursor-pointer text-gray-200 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 12H6"
                />
              </svg>
            </button>
            <input
              type="number"
              value={itemQuantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setItemQuantity(Math.max(1, val));
              }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full w-16 border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-500 text-center sm:text-sm"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleQuantityChange(1);
              }}
              className="h-6 w-6 flex items-center justify-center cursor-pointer text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Quantity Selector */}
      <div className="input-num-none w-28 py-0 sm:py-2 border border-gray-200 rounded-md items-center justify-center hidden sm:flex">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleQuantityChange(-1);
          }}
          className="h-6 w-6 flex items-center justify-center cursor-pointer text-gray-200 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 12H6"
            />
          </svg>
        </button>
        <input
          type="number"
          value={itemQuantity}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 1;
            setItemQuantity(Math.max(1, val));
          }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-full w-16 border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-500 text-center sm:text-sm"
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleQuantityChange(1);
          }}
          className="h-6 w-6 flex items-center justify-center cursor-pointer text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
});

CheckoutProductItem.displayName = "CheckoutProductItem";

export default CheckoutProductItem;

export const loader = async (
  args: ComponentLoaderArgs<CheckoutProductItemData>,
): Promise<CheckoutProductItemLoaderData> => {
  const { weaverse, data } = args;
  const { storefront } = weaverse;
  if (!data.product) {
    return { product: null };
  }
  const productHandle = data.product.handle;
  
  // Parse default variant options from text string
  // Supports multiple formats:
  // 1. Simple format: "Color: Red, Size: Large"
  // 2. JSON format: [{"name": "Color", "value": "Red"}, {"name": "Size", "value": "Large"}]
  // 3. Line-separated format: "Color: Red\nSize: Large"
  let selectedOptions: Array<{ name: string; value: string }> = [];
  if (data.defaultVariantOptions) {
    const text = data.defaultVariantOptions.trim();
    if (text) {
      // Try JSON format first
      if (text.startsWith('[') || text.startsWith('{')) {
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            selectedOptions = parsed.filter(
              (opt: any) => opt && typeof opt.name === "string" && typeof opt.value === "string"
            ).map((opt: any) => ({ name: opt.name, value: opt.value }));
          }
        } catch (e) {
          // Fall through to simple format parsing
        }
      }
      
      // If JSON parsing failed or not JSON, try simple format
      if (selectedOptions.length === 0) {
        // Split by comma or newline
        const pairs = text.split(/[,\n]/).map(s => s.trim()).filter(s => s);
        for (const pair of pairs) {
          // Match "Name: Value" format
          const match = pair.match(/^(.+?):\s*(.+)$/);
          if (match) {
            const name = match[1].trim();
            const value = match[2].trim();
            if (name && value) {
              selectedOptions.push({ name, value });
            }
          }
        }
      }
    }
  }
  
  const { product } = await storefront.query<ProductQuery>(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      selectedOptions,
      language: storefront.i18n.language,
      country: storefront.i18n.country,
    },
  });

  return { product };
};

export const schema = createSchema({
  type: "checkout--product-item",
  title: "Product Item",
  settings: [
    {
      group: "Content",
      inputs: [
        {
          label: "Select product",
          type: "product",
          name: "product",
          shouldRevalidate: true,
        },
        {
          type: "image",
          name: "productImage",
          label: "Product Image",
          helpText: "Only used if no product is selected",
        },
        {
          type: "text",
          name: "productTag",
          label: "Product Tag",
          defaultValue: "💨 Compact",
          helpText: "Only used if no product is selected",
        },
        {
          type: "textarea",
          name: "productVariant",
          label: "Product Variant",
          defaultValue: '30W | ⌀16.5" | E26/E27/B22 | 3speeds | White',
        },
        {
          type: "text",
          name: "salesPrice",
          label: "Sales Price",
          defaultValue: "$29.99",
        },
        {
          type: "text",
          name: "marketPrice",
          label: "Market Price",
          defaultValue: "$59.98",
        },
        {
          type: "switch",
          name: "selected",
          label: "Selected by Default",
          defaultValue: false,
        },
        {
          type: "range",
          name: "quantity",
          label: "Default Quantity",
          defaultValue: 1,
          configs: {
            min: 1,
            max: 10,
            step: 1,
          },
        },
        {
          type: "textarea",
          name: "defaultVariantOptions",
          label: "Default Variant Options",
          placeholder: "Color: Red, Size: Large",
          helpText: 'Simple format: "Color: Red, Size: Large" or one per line. Also supports JSON format.',
          condition: (data: any) => !!data.product,
        },
      ],
    },
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "productTagBgColor",
          label: "Tag Background Color",
          defaultValue: "#00afee",
        },
        {
          type: "color",
          name: "productTagColor",
          label: "Tag Text Color",
          defaultValue: "#ffffff",
        },
        {
          type: "color",
          name: "borderColor",
          label: "Border Color",
          defaultValue: "#e5e7eb",
        },
        {
          type: "color",
          name: "selectedBorderColor",
          label: "Selected Border Color",
          defaultValue: "#d9eef3",
        },
        {
          type: "color",
          name: "selectedBgColor",
          label: "Selected Background Color",
          defaultValue: "#d9eef3",
        },
        {
          type: "color",
          name: "variantTextColor",
          label: "Variant Text Color",
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
    productTag: "💨 Compact",
    productVariant: '30W | ⌀16.5" | E26/E27/B22 | 3speeds | White',
    salesPrice: "$29.99",
    marketPrice: "$59.98",
    selected: false,
    quantity: 1,
    productTagBgColor: "#00afee",
    productTagColor: "#ffffff",
    borderColor: "#e5e7eb",
    selectedBorderColor: "#d9eef3",
    selectedBgColor: "#d9eef3",
    variantTextColor: "#000000",
    salesPriceColor: "#e60000",
    marketPriceColor: "#000000",
  },
});

