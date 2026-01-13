/** biome-ignore-all lint/suspicious/noConsole: use console.log for debugging */
import {
  AnalyticsEvent,
  type CartUpdatePayload,
  type PageViewPayload,
  type ProductViewPayload,
  Script,
  useAnalytics,
  useNonce,
} from "@shopify/hydrogen";
import { useEffect } from "react";
import { useRouteLoaderData } from "react-router";
import type { RootLoader } from "~/root";
import { trackAxonEvent } from "~/utils/axon-pixel";

export function CustomAnalytics() {
  const { subscribe, canTrack } = useAnalytics();
  const nonce = useNonce();
  const rootData = useRouteLoaderData<RootLoader>("root");

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation> --- IGNORE ---
  useEffect(() => {
    setTimeout(() => {
      const isTrackingAllowed = canTrack();
      console.log("CustomAnalytics - isTrackingAllowed", isTrackingAllowed);
    }, 1000);
    let dataToSentToGTM: any = {};
    // Standard events
    subscribe(AnalyticsEvent.PAGE_VIEWED, (data: PageViewPayload) => {
      console.log("CustomAnalytics - Page viewed:", data);
      dataToSentToGTM = {
        event: "page_viewed",
        page_url: data.url,
      };
      window.dataLayer?.push(dataToSentToGTM);
      // Track Axon Pixel page_view event
      trackAxonEvent("page_view");
    });
    subscribe(AnalyticsEvent.PRODUCT_VIEWED, (data: ProductViewPayload) => {
      console.log("CustomAnalytics - Product viewed:", data);
      dataToSentToGTM = {
        event: "product_viewed",
        product_id: data.products?.[0]?.id,
        product_name: data.products?.[0]?.title,
        product_price: data.products?.[0]?.price,
        product_url: data.products?.[0]?.url,
      };
      window.dataLayer?.push(dataToSentToGTM);
      // Track Axon Pixel view_item event
      const product = data.products?.[0];
      if (product && product.price != null) {
        // TypeScript type guard: we've already checked product.price != null
        const productPrice = product.price as string | { amount: string; currencyCode?: string };
        const price = typeof productPrice === "object"
          ? parseFloat(productPrice.amount || "0")
          : parseFloat(String(productPrice).replace(/[^0-9.-]+/g, "")) || 0;
        const currency = typeof productPrice === "object" && productPrice.currencyCode
          ? productPrice.currencyCode
          : "USD";
        trackAxonEvent("view_item", {
          currency: currency,
          value: price,
          items: [
            {
              item_id: product.id,
              item_name: product.title,
              price: price,
              quantity: 1,
            },
          ],
        });
      }
    });
    subscribe(AnalyticsEvent.COLLECTION_VIEWED, (data) => {
      console.log("CustomAnalytics - Collection viewed:", data);
    });
    subscribe(AnalyticsEvent.CART_VIEWED, (data) => {
      console.log("CustomAnalytics - Cart viewed:", data);
    });
    subscribe(AnalyticsEvent.CART_UPDATED, (data: CartUpdatePayload) => {
      console.log("CustomAnalytics - Cart updated:", data);
      dataToSentToGTM = {
        event: "cart_updated",
        cart_id: data.cart?.id,
        cart_total: data.cart?.cost?.totalAmount?.amount,
        cart_total_quantity: data.cart?.totalQuantity,
      };
      window.dataLayer?.push(dataToSentToGTM);
    });
    subscribe(AnalyticsEvent.PRODUCT_ADD_TO_CART, (data: any) => {
      console.log("CustomAnalytics - Product added to cart:", data);
      // Track Axon Pixel add_to_cart event
      if (data.products?.[0]) {
        const product = data.products[0];
        if (product.price != null) {
          const productPrice = product.price as string | { amount: string; currencyCode?: string };
          const price = typeof productPrice === "object"
            ? parseFloat(productPrice.amount || "0")
            : parseFloat(String(productPrice).replace(/[^0-9.-]+/g, "")) || 0;
          const currency = typeof productPrice === "object" && productPrice.currencyCode
            ? productPrice.currencyCode
            : data.currency || "USD";
          trackAxonEvent("add_to_cart", {
            currency: currency,
            value: price * (product.quantity || 1),
            items: [
              {
                item_id: product.id,
                item_name: product.title,
                price: price,
                quantity: product.quantity || 1,
              },
            ],
          });
        }
      }
    });
    subscribe(AnalyticsEvent.PRODUCT_REMOVED_FROM_CART, (data) => {
      console.log("CustomAnalytics - Product removed from cart:", data);
    });
    subscribe(AnalyticsEvent.SEARCH_VIEWED, (data) => {
      console.log("CustomAnalytics - Search viewed:", data);
    });

    // Custom events
    subscribe(AnalyticsEvent.CUSTOM_EVENT, (data) => {
      console.log("CustomAnalytics - CUSTOM_EVENT:", data);
    });
  }, []);

  const id = rootData?.googleGtmID;
  const axonEventKey = rootData?.axonEventKey;

  return (
    <>
      {/* Initialize GTM container */}
      {id && (
        <>
          <script
            nonce={nonce}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: `
                  dataLayer = window.dataLayer || [];

                  function gtag(){
                    dataLayer.push(arguments)
                  };

                  gtag('js', new Date());
                  gtag({'gtm.start': new Date().getTime(),event:'gtm.js'})
                  gtag('config', "${id}");
              `,
            }}
          />
          <Script async src={`https://www.googletagmanager.com/gtm.js?id=${id}`} />
        </>
      )}

      {/* Initialize Axon Pixel */}
      {axonEventKey && (
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              var AXON_EVENT_KEY="${axonEventKey}";
              !function(e,r){var t=["https://s.axon.ai/pixel.js","https://res4.applovin.com/p/l/loader.iife.js"];if(!e.axon){var a=e.axon=function(){a.performOperation?a.performOperation.apply(a,arguments):a.operationQueue.push(arguments)};a.operationQueue=[],a.ts=Date.now(),a.eventKey=AXON_EVENT_KEY;for(var n=r.getElementsByTagName("script")[0],o=0;o<t.length;o++){var i=r.createElement("script");i.async=!0,i.src=t[o],n.parentNode.insertBefore(i,n)}}}(window,document);
              axon("init");
            `,
          }}
        />
      )}
    </>
  );
}
