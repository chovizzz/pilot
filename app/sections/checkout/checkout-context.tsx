import { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";

export interface SelectedProduct {
  id: string;
  title: string;
  variant: string;
  variantId?: string; // Shopify variant ID for ShopPayButton
  price: { amount: string; currencyCode: string } | string;
  compareAtPrice?: { amount: string; currencyCode: string } | string;
  quantity: number;
}

interface CheckoutContextType {
  selectedProducts: SelectedProduct[];
  addProduct: (product: SelectedProduct) => void;
  removeProduct: (id: string) => void;
  updateProductQuantity: (id: string, quantity: number) => void;
  getTotalPrice: () => { amount: string; currencyCode: string } | null;
  hasSelectedProducts: boolean;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

  const addProduct = useCallback((product: SelectedProduct) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        // Update existing product completely
        return prev.map((p) =>
          p.id === product.id ? product : p
        );
      }
      return [...prev, product];
    });
  }, []);

  const removeProduct = useCallback((id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateProductQuantity = useCallback((id: string, quantity: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, quantity) } : p))
    );
  }, []);

  // Create a stable key for selectedProducts to use as dependency
  const selectedProductsKey = useMemo(() => {
    return selectedProducts.map(p => 
      `${p.id}-${p.quantity}-${typeof p.price === "object" ? `${p.price.amount}-${p.price.currencyCode}` : p.price}`
    ).join("|");
  }, [selectedProducts]);

  const getTotalPrice = useCallback(() => {
    if (selectedProducts.length === 0) return null;

    const currencyCode = selectedProducts[0].price
      ? typeof selectedProducts[0].price === "object"
        ? selectedProducts[0].price.currencyCode
        : "USD"
      : "USD";

    const total = selectedProducts.reduce((sum, product) => {
      const price = typeof product.price === "object"
        ? parseFloat(product.price.amount)
        : parseFloat(String(product.price).replace(/[^0-9.-]+/g, "")) || 0;
      return sum + price * product.quantity;
    }, 0);

    return {
      amount: total.toFixed(2),
      currencyCode,
    };
  }, [selectedProducts, selectedProductsKey]);

  return (
    <CheckoutContext.Provider
      value={{
        selectedProducts,
        addProduct,
        removeProduct,
        updateProductQuantity,
        getTotalPrice,
        hasSelectedProducts: selectedProducts.length > 0,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within CheckoutProvider");
  }
  return context;
}

