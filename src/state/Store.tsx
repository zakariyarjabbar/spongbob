import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { CartItem, Customer, DemoOrder } from "../contracts";
import { getProduct } from "../data/products";

const STORAGE_KEY = "sponge-world-store";
const STORAGE_VERSION = 1;
const MAX_QUANTITY = 99;
const cents = (amount: number) => Math.round(amount * 100);
const itemKey = (productId: string, color: string, size: string) =>
  JSON.stringify([productId, color, size]);
interface SavedStore {
  cart: CartItem[];
  wishlist: string[];
  orders: DemoOrder[];
}
interface StoreContextValue extends SavedStore {
  count: number;
  subtotal: number;
  toast: string | null;
  addItem: (
    productId: string,
    quantity?: number,
    color?: string,
    size?: string,
  ) => boolean;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  toggleWishlist: (id: string) => void;
  clearCart: () => void;
  placeOrder: (
    customer: Customer,
    shippingMethod: string,
    shipping: number,
  ) => DemoOrder;
  notify: (message: string) => void;
}
const StoreContext = createContext<StoreContextValue | null>(null);
const emptyStore = (): SavedStore => ({ cart: [], wishlist: [], orders: [] });

function validateItem(raw: unknown): CartItem | undefined {
  if (!raw || typeof raw !== "object") return;
  const item = raw as Partial<CartItem>;
  if (
    typeof item.productId !== "string" ||
    typeof item.color !== "string" ||
    typeof item.size !== "string" ||
    !Number.isInteger(item.quantity) ||
    item.quantity! < 1 ||
    item.quantity! > MAX_QUANTITY
  )
    return;
  const product = getProduct(item.productId);
  if (
    !product ||
    !product.inStock ||
    (product.colors.length
      ? !product.colors.some((option) => option.name === item.color)
      : item.color !== "") ||
    (product.sizes.length
      ? !product.sizes.includes(item.size)
      : item.size !== "")
  )
    return;
  return {
    key: itemKey(item.productId, item.color, item.size),
    productId: item.productId,
    quantity: item.quantity!,
    color: item.color,
    size: item.size,
  };
}
const customerFields: (keyof Customer)[] = [
  "name",
  "email",
  "phone",
  "address",
  "city",
  "postalCode",
  "country",
  "notes",
];
function normalizeCustomer(raw: unknown): Customer | undefined {
  if (!raw || typeof raw !== "object") return;
  const value = raw as Record<string, unknown>;
  if (
    !customerFields.every(
      (field) =>
        typeof value[field] === "string" &&
        (value[field] as string).length <= 2000,
    )
  )
    return;
  const customer = Object.fromEntries(
    customerFields.map((field) => [field, (value[field] as string).trim()]),
  ) as unknown as Customer;
  if (
    !customer.name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
    !customer.phone ||
    !customer.address ||
    !customer.city ||
    !customer.country
  )
    return;
  return customer;
}
function subtotalCents(items: CartItem[]): number {
  return items.reduce(
    (total, item) =>
      total + cents(getProduct(item.productId)!.price) * item.quantity,
    0,
  );
}
function readStore(): SavedStore {
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "null",
    );
    if (
      !raw ||
      typeof raw !== "object" ||
      (raw as { version?: number }).version !== STORAGE_VERSION
    )
      return emptyStore();
    const saved = raw as Partial<SavedStore>;
    const validatedCart = Array.isArray(saved.cart)
      ? saved.cart
          .map(validateItem)
          .filter((item): item is CartItem => Boolean(item))
      : [];
    const merged = new Map<string, CartItem>();
    for (const item of validatedCart.slice(0, 200)) {
      const existing = merged.get(item.key);
      merged.set(item.key, {
        ...item,
        quantity: Math.min(
          MAX_QUANTITY,
          item.quantity + (existing?.quantity || 0),
        ),
      });
    }
    const wishlist = Array.isArray(saved.wishlist)
      ? [
          ...new Set(
            saved.wishlist.filter(
              (id): id is string =>
                typeof id === "string" && Boolean(getProduct(id)),
            ),
          ),
        ]
      : [];
    const orders: DemoOrder[] = [];
    if (Array.isArray(saved.orders))
      for (const rawOrder of saved.orders.slice(0, 30)) {
        if (!rawOrder || typeof rawOrder !== "object") continue;
        const order = rawOrder as Partial<DemoOrder>;
        const customer = normalizeCustomer(order.customer);
        if (
          !customer ||
          typeof order.id !== "string" ||
          !/^SW-[A-Z0-9-]{5,50}$/.test(order.id) ||
          typeof order.createdAt !== "string" ||
          !Number.isFinite(Date.parse(order.createdAt)) ||
          typeof order.shippingMethod !== "string" ||
          order.shippingMethod.length > 100 ||
          typeof order.shipping !== "number" ||
          !Number.isFinite(order.shipping) ||
          order.shipping < 0 ||
          order.shipping > 100 ||
          !Array.isArray(order.items) ||
          !order.items.length
        )
          continue;
        const items = order.items
          .map(validateItem)
          .filter((item): item is CartItem => Boolean(item));
        if (items.length !== order.items.length) continue;
        const subtotal = subtotalCents(items) / 100;
        const total = (cents(subtotal) + cents(order.shipping)) / 100;
        if (order.subtotal !== subtotal || order.total !== total) continue;
        orders.push({
          id: order.id,
          items,
          customer,
          shipping: order.shipping,
          subtotal,
          total,
          createdAt: order.createdAt,
          shippingMethod: order.shippingMethod,
        });
      }
    return { cart: [...merged.values()], wishlist, orders };
  } catch {
    return emptyStore();
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SavedStore>(readStore);
  const stateRef = useRef(state);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const notify = useCallback((message: string) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast(message);
    toastTimeout.current = setTimeout(() => setToast(null), 3400);
  }, []);
  useEffect(
    () => () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    },
    [],
  );
  const commit = useCallback((next: SavedStore) => {
    stateRef.current = next;
    setState(next);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: STORAGE_VERSION, ...state }),
      );
    } catch {
      /* The session still works if browser storage is unavailable or full. */
    }
  }, [state]);

  const addItem = useCallback(
    (productId: string, quantity = 1, color = "", size = "") => {
      const product = getProduct(productId);
      if (!product || !product.inStock) {
        notify("This treasure is currently out of stock.");
        return false;
      }
      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > MAX_QUANTITY
      ) {
        notify("Choose a quantity from 1 to 99.");
        return false;
      }
      const selectedColor =
        color || (product.colors.length === 1 ? product.colors[0].name : "");
      const selectedSize =
        size || (product.sizes.length === 1 ? product.sizes[0] : "");
      if (
        product.colors.length &&
        !product.colors.some((option) => option.name === selectedColor)
      ) {
        notify("Pick your color first.");
        return false;
      }
      if (product.sizes.length && !product.sizes.includes(selectedSize)) {
        notify("Pick your size first.");
        return false;
      }
      if (
        (!product.colors.length && selectedColor) ||
        (!product.sizes.length && selectedSize)
      ) {
        notify("Choose an available product option.");
        return false;
      }
      const key = itemKey(productId, selectedColor, selectedSize);
      const current = stateRef.current;
      const existing = current.cart.find((item) => item.key === key);
      if ((existing?.quantity || 0) + quantity > MAX_QUANTITY) {
        notify("You can add up to 99 of each treasure.");
        return false;
      }
      const cart = existing
        ? current.cart.map((item) =>
            item.key === key
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        : [
            ...current.cart,
            {
              key,
              productId,
              quantity,
              color: selectedColor,
              size: selectedSize,
            },
          ];
      commit({ ...current, cart });
      notify(`${product.name} added to your cart!`);
      return true;
    },
    [commit, notify],
  );
  const removeItem = useCallback(
    (key: string) => {
      const current = stateRef.current;
      commit({
        ...current,
        cart: current.cart.filter((item) => item.key !== key),
      });
    },
    [commit],
  );
  const updateQuantity = useCallback(
    (key: string, quantity: number) => {
      if (quantity === 0) {
        removeItem(key);
        return;
      }
      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > MAX_QUANTITY
      ) {
        notify("Choose a quantity from 1 to 99.");
        return;
      }
      const current = stateRef.current;
      commit({
        ...current,
        cart: current.cart.map((item) =>
          item.key === key ? { ...item, quantity } : item,
        ),
      });
    },
    [commit, notify, removeItem],
  );
  const toggleWishlist = useCallback(
    (id: string) => {
      if (!getProduct(id)) return;
      const current = stateRef.current;
      const removing = current.wishlist.includes(id);
      commit({
        ...current,
        wishlist: removing
          ? current.wishlist.filter((item) => item !== id)
          : [...current.wishlist, id],
      });
      notify(
        removing ? "Removed from your favorites." : "Saved to your favorites!",
      );
    },
    [commit, notify],
  );
  const clearCart = useCallback(
    () => commit({ ...stateRef.current, cart: [] }),
    [commit],
  );
  const placeOrder = useCallback(
    (
      rawCustomer: Customer,
      shippingMethod: string,
      shipping: number,
    ): DemoOrder => {
      const current = stateRef.current;
      if (!current.cart.length)
        throw new Error(
          "Your cart is empty. Add a treasure before placing an order.",
        );
      const customer = normalizeCustomer(rawCustomer);
      if (!customer)
        throw new Error(
          "Please complete your name, email, phone number and shipping address.",
        );
      const currentSubtotal = subtotalCents(current.cart) / 100;
      const expectedShipping =
        shippingMethod === "Express shipping"
          ? 12
          : shippingMethod === "Standard shipping"
            ? currentSubtotal >= 75
              ? 0
              : 5
            : undefined;
      if (
        expectedShipping === undefined ||
        !Number.isFinite(shipping) ||
        cents(shipping) !== cents(expectedShipping)
      )
        throw new Error("Choose an available shipping method.");
      const items = current.cart.map(validateItem);
      if (items.some((item) => !item))
        throw new Error(
          "An item in your cart is no longer available. Please review your cart.",
        );
      const validatedItems = items as CartItem[];
      const subtotal = subtotalCents(validatedItems) / 100;
      const shippingAmount = cents(shipping) / 100;
      const token =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID().slice(0, 8).toUpperCase()
          : Math.random().toString(36).slice(2, 10).toUpperCase();
      const order: DemoOrder = {
        id: `SW-${Date.now().toString(36).toUpperCase()}-${token}`,
        items: validatedItems,
        customer,
        shipping: shippingAmount,
        subtotal,
        total: (cents(subtotal) + cents(shippingAmount)) / 100,
        createdAt: new Date().toISOString(),
        shippingMethod: shippingMethod.trim(),
      };
      commit({
        ...current,
        cart: [],
        orders: [order, ...current.orders].slice(0, 30),
      });
      notify("Your demo order is confirmed!");
      return order;
    },
    [commit, notify],
  );
  const count = state.cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = subtotalCents(state.cart) / 100;
  return (
    <StoreContext.Provider
      value={{
        ...state,
        count,
        subtotal,
        toast,
        addItem,
        updateQuantity,
        removeItem,
        toggleWishlist,
        clearCart,
        placeOrder,
        notify,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider.");
  return context;
}
