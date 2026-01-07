import { useEffect, useState, useCallback } from "react";

export interface UseDrawerOptions {
  /**
   * Initial open state
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Whether to prevent body scroll when drawer is open
   * @default true
   */
  preventBodyScroll?: boolean;
  /**
   * Callback when drawer opens
   */
  onOpen?: () => void;
  /**
   * Callback when drawer closes
   */
  onClose?: () => void;
}

export interface UseDrawerReturn {
  /**
   * Whether the drawer is open
   */
  isOpen: boolean;
  /**
   * Open the drawer
   */
  open: () => void;
  /**
   * Close the drawer
   */
  close: () => void;
  /**
   * Toggle the drawer open/close state
   * @param open - Optional boolean to set specific state, otherwise toggles
   */
  toggle: (open?: boolean) => void;
}

/**
 * Hook for managing drawer/modal open/close state
 * 
 * @example
 * ```tsx
 * const { isOpen, open, close, toggle } = useDrawer({
 *   defaultOpen: false,
 *   preventBodyScroll: true,
 *   onOpen: () => console.log('Drawer opened'),
 *   onClose: () => console.log('Drawer closed'),
 * });
 * 
 * return (
 *   <button onClick={open}>Open Drawer</button>
 *   {isOpen && <Drawer onClose={close}>Content</Drawer>}
 * );
 * ```
 */
export function useDrawer(options: UseDrawerOptions = {}): UseDrawerReturn {
  const {
    defaultOpen = false,
    preventBodyScroll = true,
    onOpen,
    onClose,
  } = options;

  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(
    (open?: boolean) => {
      if (open !== undefined) {
        if (open) {
          setIsOpen(true);
          onOpen?.();
        } else {
          setIsOpen(false);
          onClose?.();
        }
      } else {
        setIsOpen((prev) => {
          const newState = !prev;
          if (newState) {
            onOpen?.();
          } else {
            onClose?.();
          }
          return newState;
        });
      }
    },
    [onOpen, onClose],
  );

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (preventBodyScroll) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, preventBodyScroll]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

