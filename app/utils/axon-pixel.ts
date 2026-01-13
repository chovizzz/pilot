/**
 * Helper function to track Axon Pixel events
 * @param eventName - The name of the event (e.g., "page_view", "add_to_cart", "begin_checkout", "purchase")
 * @param eventData - Optional event data object
 */
export function trackAxonEvent(eventName: string, eventData?: any) {
  if (typeof window !== "undefined" && (window as any).axon) {
    if (eventData) {
      (window as any).axon("track", eventName, eventData);
    } else {
      (window as any).axon("track", eventName);
    }
  }
}

