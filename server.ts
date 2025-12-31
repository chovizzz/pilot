import * as remixBuild from "virtual:react-router/server-build"; // Virtual entry point for the app
import { storefrontRedirect } from "@shopify/hydrogen";
import { createRequestHandler } from "@shopify/hydrogen/oxygen";
import { createHydrogenRouterContext } from "~/.server/context";

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const hydrogenContext = await createHydrogenRouterContext(
        request,
        env,
        executionContext,
      );

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const response = await handleRequest(request);

      if (hydrogenContext.session.isPending) {
        response.headers.set(
          "Set-Cookie",
          await hydrogenContext.session.commit(),
        );
      }

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error("Server error:", error);
      
      // In preview/production, provide more detailed error info
      const isProduction = process.env.NODE_ENV === "production";
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      // Log full error details for debugging
      console.error("Error details:", {
        message: errorMessage,
        stack: errorStack,
        name: error instanceof Error ? error.name : "Unknown",
      });
      
      // Return detailed error in development/preview, generic in production
      if (!isProduction) {
        return new Response(
          JSON.stringify({
            error: "An unexpected error occurred",
            message: errorMessage,
            stack: errorStack,
          }, null, 2),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      
      return new Response("An unexpected error occurred", { status: 500 });
    }
  },
};
