/**
 * Mapping from Shopify product types/tags to Axon Pixel category IDs
 * Reference: https://support.axon.ai/en/growth/promoting-your-websites/axon-pixel-integration/events-and-objects/#category-ids
 * 
 * IMPORTANT: All category IDs must be valid integers from Axon's official category directory.
 * Axon has thousands of categories with multiple levels of subcategories.
 * This mapping includes common categories and their subcategories with specific IDs.
 * 
 * Matching priority: Most specific subcategory → Parent category → Default
 * 
 * Note: This is a partial mapping. For complete category list, refer to Axon documentation.
 * You should expand this mapping based on your actual product catalog.
 */
const CATEGORY_ID_MAP: Record<string, number> = {
  // ===== Apparel & Accessories (166) =====
  // Clothing (1604) - Parent category
  "Clothing": 1604,
  "Apparel": 1604,
  "Fashion": 1604,
  "Clothing & Intimates": 1604,
  "Clothing & intimates": 1604,
  
  // Activewear (5322)
  "Activewear": 5322,
  "Sportswear": 5322,
  "Athletic Wear": 5322,
  "Workout Clothes": 5322,
  "Gym Wear": 5322,
  
  // Baby & Toddler Clothing (182)
  "Baby & Toddler Clothing": 182,
  "Baby Clothing": 182,
  "Toddler Clothing": 182,
  "Infant Clothing": 182,
  "Baby & Toddler": 182,
  
  // ===== Underwear & Socks (213) =====
  // Underwear & Socks - Parent category
  "Underwear & Socks": 213,
  "Underwear and Socks": 213,
  
  // Bras (214)
  "Bras": 214,
  "Bra": 214,
  "Brassiere": 214,
  "Brassieres": 214,
  "文胸": 214, // Chinese: Bra
  "胸罩": 214, // Chinese: Bra
  "内衣文胸": 214, // Chinese: Lingerie Bra
  
  // Hosiery (215)
  "Hosiery": 215,
  "Stockings": 215,
  "Tights": 215,
  "Pantyhose": 215,
  
  // Socks (209)
  "Socks": 209,
  "Sock": 209,
  
  // Underwear (2562)
  "Underwear": 2562,
  "Briefs": 2562,
  "Boxers": 2562,
  "Boxer Briefs": 2562,
  "Panties": 2562,
  "Panty": 2562,
  "Underpants": 2562,
  "内裤": 2562, // Chinese: Underwear/Panties
  "内衣物": 2562, // Chinese: Underwear
  
  // Lingerie (1772)
  "Lingerie": 1772,
  "Intimates": 1772,
  "内衣": 1772, // Chinese: Lingerie
  
  // Lingerie Accessories (2563) - Parent category
  "Lingerie Accessories": 2563,
  
  // Garter Belts (2160)
  "Garter Belts": 2160,
  "Garter Belt": 2160,
  
  // Garters (1675)
  "Garters": 1675,
  "Garter": 1675,
  
  // Shapewear (1578)
  "Shapewear": 1578,
  "Shape Wear": 1578,
  "Body Shapers": 1578,
  "Compression Garments": 1578,
  
  // Long Johns (1807)
  "Long Johns": 1807,
  "Long John": 1807,
  "Thermal Underwear": 1807,
  
  // Undershirts (2745)
  "Undershirts": 2745,
  "Undershirt": 2745,
  "Undervest": 2745,
  "Vest": 2745,
  
  // Petticoats & Pettipants (2963)
  "Petticoats": 2963,
  "Petticoat": 2963,
  "Pettipants": 2963,
  "Pettipant": 2963,
  
  // Underwear Slips (5834)
  "Underwear Slips": 5834,
  "Underwear Slip": 5834,
  "Slips": 5834,
  "Slip": 5834,
  
  // Jock Straps (5327)
  "Jock Straps": 5327,
  "Jock Strap": 5327,
  "Athletic Supporter": 5327,
  
  // Toddler Underwear (5621) - For children's products
  "Toddler Underwear": 5621,
  "Kids Underwear": 5621,
  "Children Underwear": 5621,
  
  // Uniforms (2306)
  "Uniforms": 2306,
  "Work Uniforms": 2306,
  "School Uniforms": 2306,
  
  // Wedding & Bridal Party Dresses (5441)
  "Wedding Dresses": 5441,
  "Bridal Dresses": 5441,
  "Wedding & Bridal Party Dresses": 5441,
  "Bridal": 5441,
  
  // Clothing Accessories (167)
  "Clothing Accessories": 167,
  "Accessories": 167,
  
  // Sunglasses (178)
  "Sunglasses": 178,
  "Sunglass": 178,
  
  // Hats (173)
  "Hats": 173,
  "Hat": 173,
  "Cap": 173,
  "Caps": 173,
  
  // Handbags, Wallets & Cases (6551/6552)
  "Handbags": 3032,
  "Handbag": 3032,
  "Purse": 3032,
  "Purses": 3032,
  
  // Wallets & Money Clips (2668)
  "Wallets": 2668,
  "Wallet": 2668,
  "Money Clips": 2668,
  "Money Clip": 2668,
  
  // Shoes (187)
  "Shoes": 187,
  "Shoe": 187,
  "Footwear": 187,
  "Sneakers": 187,
  "Boots": 187,
  "Shoes & Accessories": 187,
  
  // Jewelry (188)
  "Jewelry": 188,
  "Jewellery": 188,
  "Jewel": 188,
  "Necklace": 188,
  "Ring": 188,
  "Earrings": 188,
  "Bracelet": 188,
  
  // Watches
  "Watches": 188, // Often grouped with Jewelry
  "Watch": 188,
  
  // ===== Beauty & Personal Care =====
  "Beauty": 1604, // Parent category, use specific subcategory if available
  "Personal Care": 1604,
  "Cosmetics": 1604,
  "Skincare": 1604,
  "Hair Care": 1604,
  "Makeup": 1604,
  "Personal Care Products": 1604,
  
  // ===== Electronics =====
  "Electronics": 1604, // Parent category, use specific subcategory if available
  "Computers": 1604,
  "Computer": 1604,
  "Mobile Phones": 1604,
  "Phone": 1604,
  "Smartphone": 1604,
  "Audio": 1604,
  "Cameras": 1604,
  "Camera": 1604,
  "TV & Video": 1604,
  "TV": 1604,
  "Television": 1604,
  
  // ===== Home & Furniture =====
  "Home & Furniture": 1604,
  "Furniture": 1604,
  "Home Decor": 1604,
  "Home Decorating": 1604,
  "Kitchen & Dining": 1604,
  "Kitchen": 1604,
  "Dining": 1604,
  "Bedding": 1604,
  "Household Essentials": 1604,
  "Home": 1604,
  
  // ===== Health & Wellness =====
  "Health & Wellness": 1604,
  "Health & wellness": 1604,
  "Health": 1604,
  "Wellness": 1604,
  "Fitness": 1604,
  "Sports": 1604,
  "Outdoor": 1604,
  "Sports & Outdoors": 1604,
  
  // ===== Kids & Baby =====
  "Kids & Baby": 1604,
  "Kids & baby": 1604,
  "Baby": 1604,
  "Kids": 1604,
  "Children": 1604,
  "Toys & Recreation": 1604,
  "Toys & recreation": 1604,
  "Toys": 1604,
  "Toy": 1604,
  
  // ===== Grocery & Food =====
  "Grocery": 1604,
  "Food": 1604,
  "Beverages": 1604,
  "Food & Beverages": 1604,
  "Food & Drinks": 1604,
  
  // ===== Pets =====
  "Pets": 1604,
  "Pet Supplies": 1604,
  "Pet": 1604,
  "Pet Products": 1604,
  
  // ===== Digital Services =====
  "Digital Services": 1604,
  "Digital services": 1604,
  "Software": 1604,
  "Digital": 1604,
  "Digital Products": 1604,
};

/**
 * Get Axon Pixel category ID from Shopify product type
 * Reference: https://support.axon.ai/en/growth/promoting-your-websites/axon-pixel-integration/events-and-objects/#category-ids
 * 
 * Matching strategy (priority order):
 * 1. Exact match (case-insensitive)
 * 2. Most specific subcategory match (longest key that contains or is contained by the input)
 * 3. Tag-based match (from product tags)
 * 4. Default fallback (1604 - Clothing, a common parent category)
 * 
 * @param productType - Product type from Shopify (e.g., "Activewear", "Baby Clothing")
 * @param tags - Product tags array (optional, for additional matching)
 * @returns A valid Axon category ID (number, must be > 0)
 */
export function getCategoryId(productType?: string, tags?: string[]): number {
  // Default category ID for general/unknown products
  // Using 1604 (Clothing) as a common parent category
  const DEFAULT_CATEGORY_ID = 1604;

  const findBestMatch = (input: string): number | null => {
    if (!input || !input.trim()) return null;
    
    const normalizedInput = input.trim().toLowerCase();
    const keys = Object.keys(CATEGORY_ID_MAP);
    
    // 1. Exact match (case-insensitive)
    const exactMatch = keys.find(
      key => key.toLowerCase() === normalizedInput
    );
    if (exactMatch) {
      return CATEGORY_ID_MAP[exactMatch];
    }
    
    // 2. Most specific match (longest key that matches)
    // Prefer longer, more specific matches over shorter, generic ones
    const matches = keys
      .filter(key => {
        const normalizedKey = key.toLowerCase();
        return normalizedInput.includes(normalizedKey) || 
               normalizedKey.includes(normalizedInput);
      })
      .sort((a, b) => b.length - a.length); // Sort by length (longest first)
    
    if (matches.length > 0) {
      return CATEGORY_ID_MAP[matches[0]];
    }
    
    return null;
  };

  // Try to match product type first
  if (productType) {
    const match = findBestMatch(productType);
    if (match !== null) {
      return match;
    }
  }

  // Try to match from tags (check all tags, return first match)
  if (tags && tags.length > 0) {
    for (const tag of tags) {
      const match = findBestMatch(tag);
      if (match !== null) {
        return match;
      }
    }
  }

  // Return default if no match found
  return DEFAULT_CATEGORY_ID;
}

/**
 * Required fields for Axon Pixel items
 * Reference: https://support.axon.ai/en/growth/promoting-your-websites/axon-pixel-integration/events-and-objects/
 * 
 * Note: quantity is always required and must not be null. Defaults to 1 if missing or invalid.
 */
const REQUIRED_ITEM_FIELDS = new Set([
  "item_variant_id",
  "item_id",
  "item_name",
  "price",
  "image_url",
  "item_category_id",
  "quantity", // Always required, must not be null
]);

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === "string") {
    return value.trim() === "";
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }
  return false;
}

/**
 * Clean item object by removing empty optional fields
 * Required fields are always kept, even if empty
 * @param item - Item object to clean
 * @param isViewItem - Whether this is for view_item event
 * @returns Cleaned item object
 */
function cleanItem(item: any, isViewItem = false): any {
  const cleaned: any = {};
  const requiredFields = new Set(REQUIRED_ITEM_FIELDS);
  
  // Quantity is always required, even for view_item event
  // Don't remove it from required fields
  
  // Always include required fields, even if empty (if they exist in item)
  // Required fields are kept as-is, even if value is empty string
  for (const field of requiredFields) {
    if (field in item) {
      cleaned[field] = item[field];
    }
  }
  
  // Ensure quantity is always present and not null/undefined
  // Default to 1 if missing or invalid
  if (!("quantity" in cleaned) || cleaned.quantity === null || cleaned.quantity === undefined) {
    cleaned.quantity = typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1;
  } else if (typeof cleaned.quantity !== "number" || cleaned.quantity <= 0) {
    // If quantity exists but is invalid (not a number or <= 0), set to 1
    cleaned.quantity = 1;
  }
  
  // Include optional fields only if they are not empty
  for (const [key, value] of Object.entries(item)) {
    if (!requiredFields.has(key) && !isEmpty(value)) {
      cleaned[key] = value;
    }
  }
  
  return cleaned;
}

/**
 * Clean event data by removing empty optional fields
 * @param eventData - Event data object to clean
 * @param eventName - Event name to determine field requirements
 * @returns Cleaned event data object
 */
function cleanEventData(eventData: any, eventName: string): any {
  if (!eventData || typeof eventData !== "object") {
    return eventData;
  }
  
  const cleaned: any = {};
  const isViewItem = eventName === "view_item";
  
  // Clean top-level fields (currency, value, etc.)
  for (const [key, value] of Object.entries(eventData)) {
    if (key === "items" && Array.isArray(value)) {
      // Clean items array
      cleaned.items = value.map((item: any) => cleanItem(item, isViewItem));
    } else if (!isEmpty(value)) {
      // Include non-empty optional fields
      cleaned[key] = value;
    }
  }
  
  return cleaned;
}

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

  // Ensure items array has valid category_id if present
  // Get all valid category IDs from the mapping
  const validCategoryIds = new Set(Object.values(CATEGORY_ID_MAP));
  
  if (eventData.items && Array.isArray(eventData.items)) {
    eventData.items = eventData.items.map((item: any) => {
      const existingCategoryId = item.item_category_id;
      
      // Always recalculate if:
      // 1. item_category_id is missing, 0, or undefined
      // 2. item_category_id is not in our valid category IDs (likely a product ID or invalid value)
      // 3. item_category_id is a very large number (likely a Shopify product/variant ID, typically > 100000)
      const shouldRecalculate = 
        existingCategoryId === 0 || 
        existingCategoryId === undefined || 
        existingCategoryId === null ||
        !validCategoryIds.has(existingCategoryId) ||
        (typeof existingCategoryId === 'number' && existingCategoryId > 100000);
      
      if (shouldRecalculate) {
        const correctCategoryId = getCategoryId(item.product_type, item.tags);
        item.item_category_id = correctCategoryId;
        
        // Log warning if we're replacing an invalid category ID
        if (existingCategoryId && existingCategoryId !== 0 && existingCategoryId !== undefined) {
          console.warn(
            `Axon Pixel: Replaced invalid category_id ${existingCategoryId} with ${correctCategoryId} for product "${item.item_name || item.item_id}". ` +
            `This may have been a product ID. Please ensure item_category_id uses valid Axon category IDs.`
          );
        }
      }
      
      return item;
    });
  }

  // Clean event data: remove empty optional fields, keep required fields
  const cleanedEventData = cleanEventData(eventData, eventName);

  // Send event with cleaned event_data
  (window as any).axon("track", eventName, cleanedEventData);
}

