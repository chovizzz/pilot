import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from "@shopify/hydrogen";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";

import { getWeaverseCsp } from "~/weaverse/csp";

/**
 * Enhanced user identification for Axon Pixel
 * When the _axwrt cookie is present in the request, set the axwrt cookie in the response
 * This improves user identification accuracy for Axon Pixel tracking
 */
function setAxonUserIdentificationCookie(
  request: Request,
  responseHeaders: Headers,
  cookieDomain?: string,
) {
  // Parse cookies from request
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return;
  }

  // Extract _axwrt cookie value
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const axwrtCookie = cookies.find((c) => c.startsWith("_axwrt="));
  
  if (!axwrtCookie) {
    return;
  }

  // Extract the cookie value (everything after "=")
  const axwrtValue = axwrtCookie.split("=").slice(1).join("=");
  
  if (!axwrtValue) {
    return;
  }

  // Calculate expiration date (1 year from now)
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  // Determine domain
  // Domain should be the site domain prefixed with a period (e.g., .mysite.com)
  // Note: do not include "www"
  let domain = "";
  if (cookieDomain) {
    // If cookieDomain is provided, use it directly (should already be in the correct format)
    // If it doesn't start with a period, add it
    domain = cookieDomain.startsWith(".") ? cookieDomain : `.${cookieDomain}`;
    // Remove www. prefix if present
    domain = domain.replace(/^\.www\./, ".");
  } else {
    // Fallback: extract from request URL
    const url = new URL(request.url);
    let hostname = url.hostname;
    // Remove www. prefix if present
    hostname = hostname.replace(/^www\./, "");
    // Prefix with period
    domain = `.${hostname}`;
  }

  // Build Set-Cookie header
  // Format: axwrt=<value>; Expires=<date>; Domain=<domain>; Path=/; SameSite=Lax
  const cookieString = `axwrt=${axwrtValue}; Expires=${expirationDate.toUTCString()}; Domain=${domain}; Path=/; SameSite=Lax`;

  // Set the cookie in response headers
  responseHeaders.append("Set-Cookie", cookieString);
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    ...getWeaverseCsp(request, context),
    shop: {
      checkoutDomain:
        context.env?.PUBLIC_CHECKOUT_DOMAIN || context.env?.PUBLIC_STORE_DOMAIN,
      storeDomain: context.env?.PUBLIC_STORE_DOMAIN,
    },
  });

  // Set Axon Pixel enhanced user identification cookie
  // This should be done before rendering to ensure the cookie is set on all responses
  // Use PUBLIC_STORE_COOKIE_DOMAIN if set, otherwise fallback to PUBLIC_STORE_DOMAIN
  const cookieDomain = context.env?.PUBLIC_STORE_COOKIE_DOMAIN || context.env?.PUBLIC_STORE_DOMAIN;
  setAxonUserIdentificationCookie(
    request,
    responseHeaders,
    cookieDomain,
  );

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get("user-agent"))) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");
  // TODO: change to Content-Security-Policy when you ready with your CSP configs.
  responseHeaders.set("Content-Security-Policy-Report-Only", header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
