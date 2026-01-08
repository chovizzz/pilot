import {
  createSchema,
  type ComponentLoaderArgs,
  type HydrogenComponentProps,
  type WeaverseImage,
  type WeaverseProduct,
} from "@weaverse/hydrogen";
import { Money } from "@shopify/hydrogen";
import { forwardRef, useState, useEffect, useId, useMemo } from "react";
import type { ProductQuery } from "storefront-api.generated";
import { Image } from "~/components/image";
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
  
  // If product is associated, use product data; otherwise use manual input
  const variant = shopifyProduct?.selectedOrFirstAvailableVariant;
  
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
  
  // Get product image from Shopify product or manual input
  const productImageData: Partial<WeaverseImage> | undefined = shopifyProduct
    ? shopifyProduct.featuredImage
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
        : undefined
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

  // Get Shopify variant ID for ShopPayButton
  const shopifyVariantId = shopifyProduct?.selectedOrFirstAvailableVariant?.id;

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

  useEffect(() => {
    if (isSelected) {
      addProduct({
        id: productId,
        title: displayTag || "",
        variant: displayVariant || "",
        variantId: shopifyVariantId,
        price: displaySalesPrice || "",
        compareAtPrice: displayMarketPrice,
        quantity: itemQuantity,
      });
    }
  }, [isSelected, productId, displayTag, displayVariant, shopifyVariantId, salesPriceKey, marketPriceKey, itemQuantity, addProduct]);

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

          {/* Product Variant */}
          {displayVariant && (
            <div
              className="text-gray-500 block leading-4 product-tag product-variant mb-1 text-base"
              style={{ color: variantTextColor }}
            >
              {displayVariant}
            </div>
          )}

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
  const { product } = await storefront.query<ProductQuery>(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      selectedOptions: [],
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

