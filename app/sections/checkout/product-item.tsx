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
import { Image, getProductOptions } from "@shopify/hydrogen";
import * as Select from "@radix-ui/react-select";
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import { PRODUCT_QUERY } from "~/graphql/queries";
import { useAnimation } from "~/hooks/use-animation";
import { useCheckout } from "./checkout-context";

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
  // Use useMemo to stabilize object reference and prevent infinite loops
  const productImageData: Partial<WeaverseImage> | undefined = useMemo(() => {
    if (shopifyProduct) {
      if (selectedVariant?.image) {
        return {
          url: selectedVariant.image.url,
          altText: selectedVariant.image.altText || shopifyProduct.title || "Product",
          width: selectedVariant.image.width,
          height: selectedVariant.image.height,
        };
      }
      if (shopifyProduct.featuredImage) {
        return {
          url: shopifyProduct.featuredImage.url,
          altText: shopifyProduct.featuredImage.altText || shopifyProduct.title || "Product",
        };
      }
      if (shopifyProduct.media?.nodes?.[0]?.previewImage) {
        return {
          url: shopifyProduct.media.nodes[0].previewImage.url,
          altText: shopifyProduct.media.nodes[0].previewImage.altText || shopifyProduct.title || "Product",
          width: shopifyProduct.media.nodes[0].previewImage.width,
          height: shopifyProduct.media.nodes[0].previewImage.height,
        };
      }
      return undefined;
    }
    if (productImage) {
      return typeof productImage === "string"
        ? { url: productImage, altText: productTag || "Product" }
        : productImage;
    }
    return undefined;
  }, [
    shopifyProduct?.id,
    selectedVariant?.image?.url,
    shopifyProduct?.featuredImage?.url,
    shopifyProduct?.media?.nodes?.[0]?.previewImage?.url,
    productImage,
    productTag,
  ]);

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
      // Include all necessary fields including imageUrl for analytics
      addProduct({
        id: productId,
        title: displayTag || "",
        variant: displayVariant || "",
        variantId: shopifyVariantId,
        price: displaySalesPrice || "",
        compareAtPrice: displayMarketPrice,
        quantity: itemQuantity,
        // Include analytics fields
        ...(shopifyProduct && {
          vendor: shopifyProduct.vendor || "",
          productType: (shopifyProduct as any).productType || "",
          handle: shopifyProduct.handle || "",
          tags: shopifyProduct.tags || [],
        }),
        ...(imageUrl && { imageUrl }),
        ...(productUrl && { productUrl }),
        ...(selectedVariant?.sku && { sku: selectedVariant.sku }),
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

  // Memoize product URL and image URL to prevent unnecessary recalculations
  const productUrl = useMemo(() => {
    if (!shopifyProduct?.handle || !selectedVariant?.id) return "";
    const variantId = selectedVariant.id.split("/").pop();
    return `/products/${shopifyProduct.handle}${variantId ? `?variant=${variantId}` : ""}`;
  }, [shopifyProduct?.handle, selectedVariant?.id]);

  const imageUrl = useMemo(() => {
    return selectedVariant?.image?.url
      || shopifyProduct?.featuredImage?.url
      || shopifyProduct?.media?.nodes?.[0]?.previewImage?.url
      || (productImageData && typeof productImageData === "object" && productImageData.url ? productImageData.url : "")
      || "";
  }, [
    selectedVariant?.image?.url,
    shopifyProduct?.featuredImage?.url,
    shopifyProduct?.media?.nodes?.[0]?.previewImage?.url,
    productImageData?.url,
  ]);

  // Memoize variant display string
  const currentDisplayVariant = useMemo(() => {
    if (!selectedVariant) return "";
    return selectedVariant.selectedOptions && selectedVariant.selectedOptions.length > 0
      ? selectedVariant.selectedOptions
          .map((opt: { name: string; value: string }) => `${opt.name}: ${opt.value}`)
          .join(" | ")
      : selectedVariant.title || "";
  }, [selectedVariant?.selectedOptions, selectedVariant?.title]);

  // Update product in context when variant, price, or quantity changes (only if selected)
  useEffect(() => {
    if (!isSelected || !shopifyProduct || !selectedVariant) return;

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
      vendor: shopifyProduct.vendor || "",
      productType: (shopifyProduct as any).productType || "",
      handle: shopifyProduct.handle || "",
      productUrl: productUrl,
      imageUrl: imageUrl,
      sku: selectedVariant.sku || null,
      tags: shopifyProduct.tags || [],
    });
  }, [
    isSelected,
    productId,
    displayTag,
    selectedVariant?.id,
    selectedVariant?.price?.amount,
    selectedVariant?.price?.currencyCode,
    selectedVariant?.compareAtPrice?.amount,
    selectedVariant?.compareAtPrice?.currencyCode,
    selectedVariant?.sku,
    currentDisplayVariant,
    salesPriceKey,
    marketPriceKey,
    itemQuantity,
    addProduct,
    shopifyProduct?.id,
    shopifyProduct?.vendor,
    (shopifyProduct as any)?.productType,
    shopifyProduct?.handle,
    shopifyProduct?.tags,
    productUrl,
    imageUrl,
  ]);

  // Get product options for separate dropdowns (Color, Size, etc.)
  const productOptions = useMemo(() => {
    if (!shopifyProduct || !selectedVariant) return [];
    return getProductOptions({
      ...shopifyProduct,
      selectedOrFirstAvailableVariant: selectedVariant,
    });
  }, [shopifyProduct, selectedVariant]);

  // Handle option change
  const handleOptionChange = (optionName: string, optionValue: string) => {
    if (!shopifyProduct || !selectedVariant) return;
    
    // Find the option value object
    const option = productOptions.find(opt => opt.name === optionName);
    if (!option) return;
    
    const optionValueObj = option.optionValues.find(val => val.name === optionValue);
    if (!optionValueObj || !optionValueObj.available) return;
    
    // Use firstSelectableVariant if available
    if (optionValueObj.firstSelectableVariant) {
      setSelectedVariant(optionValueObj.firstSelectableVariant);
    }
  };

  return (
    <div
      ref={ref}
      {...rest}
      className={`group relative flex flex-col gap-4 rounded-xl border-2 transition-all duration-300 mb-4 p-4 sm:p-5 cursor-pointer ${
        isSelected
          ? "shadow-lg scale-[1.02]"
          : "shadow-sm hover:shadow-md hover:scale-[1.01]"
      }`}
      style={{
        backgroundColor: isSelected ? selectedBgColor : "#ffffff",
        borderColor: isSelected ? selectedBorderColor : borderColor,
      }}
      onClick={() => handleSelectionChange(!isSelected)}
      data-motion="fade-up"
      {...animation}
    >
      {/* Top Row: Checkbox, Image, and Product Info */}
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="flex items-start pt-1 shrink-0">
          <div className="relative flex items-center justify-center">
            <input
              name="product"
              type="checkbox"
              checked={isSelected}
              onChange={(e) => handleSelectionChange(e.target.checked)}
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 cursor-pointer transition-all duration-200 accent-green-600 hover:accent-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              style={{
                borderColor: isSelected ? selectedBorderColor : borderColor,
              }}
            />
            {isSelected && (
              <svg
                className="absolute w-3 h-3 sm:w-4 sm:h-4 text-white pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Product Image */}
        {productImageData && (
          <div className="relative shrink-0">
            <div
              className={`relative overflow-hidden rounded-lg transition-all duration-300 aspect-square ${
                isSelected ? "ring-2 ring-offset-2" : ""
              }`}
              style={
                isSelected
                  ? ({
                      "--tw-ring-color": selectedBorderColor,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              <Image
                data={productImageData}
                alt={displayTag || ""}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                sizes="(max-width: 640px) 80px, 96px"
                aspectRatio="1/1"
              />
            </div>
          </div>
        )}

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          {/* Product Tag */}
          {displayTag && (
            <div className="mb-2">
              <span
                className="inline-block px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm"
                style={{
                  backgroundColor: productTagBgColor,
                  color: productTagColor,
                }}
              >
                {displayTag}
              </span>
            </div>
          )}

          {/* Prices */}
          <div className="flex items-baseline gap-2 mb-3">
            {displaySalesPrice && (
              <div
                className="font-bold text-xl sm:text-2xl"
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
                className="line-through text-sm sm:text-base opacity-70"
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

          {/* Variant Selectors - Separate Dropdowns for each option (Color, Size, etc.) */}
          {shopifyProduct && selectedVariant && productOptions.length > 0 ? (
            <div
              className="flex flex-wrap gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              {productOptions.map((option) => {
                const selectedValue = selectedVariant.selectedOptions?.find(
                  (opt) => opt.name === option.name
                )?.value || "";
                
                return (
                  <div key={option.name} className="shrink-0">
                    <label className="block text-xs font-medium mb-1" style={{ color: variantTextColor }}>
                      {option.name}
                    </label>
                    <Select.Root
                      value={selectedValue}
                      onValueChange={(value) => {
                        handleOptionChange(option.name, value);
                      }}
                    >
                      <Select.Trigger
                        className="inline-flex h-10 items-center justify-between gap-2 pl-3 pr-3 py-2 border-2 rounded-lg text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 min-w-[120px]"
                        style={{
                          borderColor: borderColor,
                        }}
                      >
                        <Select.Value placeholder="Select..." />
                        <Select.Icon className="shrink-0">
                          <CaretDownIcon size={16} />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content
                          className="overflow-hidden bg-white rounded-lg shadow-lg border-2 z-50"
                          style={{
                            borderColor: borderColor,
                          }}
                          position="popper"
                          sideOffset={4}
                        >
                          <Select.Viewport className="p-1">
                            {option.optionValues.map((value) => (
                              <Select.Item
                                key={value.name}
                                value={value.name}
                                disabled={!value.available}
                                className="relative flex items-center justify-between px-3 py-2 pr-8 text-sm font-medium rounded-md outline-none cursor-pointer hover:bg-gray-100 focus:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed data-highlighted:bg-gray-100"
                              >
                                <Select.ItemText>
                                  {value.name} {!value.available ? "(Unavailable)" : ""}
                                </Select.ItemText>
                                <Select.ItemIndicator className="inline-flex ml-2 items-center justify-center">
                                  <CheckIcon size={16} />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>
                  </div>
                );
              })}
            </div>
          ) : displayVariant ? (
            <div
              className="mb-3 text-sm sm:text-base font-medium"
              style={{ color: variantTextColor }}
            >
              {displayVariant}
            </div>
          ) : null}
        </div>
      </div>

      {/* Bottom Row: Quantity Selector */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
        <label className="text-sm font-medium text-gray-700">Quantity:</label>
        <div className="flex items-center border-2 rounded-lg overflow-hidden bg-white shadow-sm w-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleQuantityChange(-1);
            }}
            disabled={itemQuantity <= 1}
            className="h-10 w-10 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
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
            className="w-14 h-10 text-center text-base font-semibold border-x-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent"
            min="1"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleQuantityChange(1);
            }}
            className="h-10 w-10 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
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

