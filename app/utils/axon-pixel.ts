/**
 * Helper function to track Axon Pixel events
 * @param eventName - The name of the event (e.g., "page_view", "add_to_cart", "begin_checkout", "purchase")
 * @param eventData - Optional event data object (required for all events except "page_view")
 */
export function trackAxonEvent(eventName: string, eventData?: any) {
  if (typeof window === "undefined" || !(window as any).axon) {
    return;
  }

  // page_view is the only event that doesn't require event_data
  if (eventName === "page_view") {
    (window as any).axon("track", eventName);
    return;
  }

  // For all other events, event_data is required
  // If eventData is null, undefined, or empty object, don't send the event
  if (!eventData || (typeof eventData === "object" && Object.keys(eventData).length === 0)) {
    console.warn(`Axon Pixel: Event "${eventName}" requires event_data but none was provided. Skipping event.`);
    return;
  }

  // Send event with event_data
  (window as any).axon("track", eventName, eventData);
}

