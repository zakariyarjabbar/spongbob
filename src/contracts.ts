export type Category =
  | "T-Shirts"
  | "Hoodies"
  | "Hats"
  | "Plushies"
  | "Accessories"
  | "Home & Living"
  | "Collectibles";
export type Character =
  | "SpongeBob"
  | "Patrick"
  | "Squidward"
  | "Mr. Krabs"
  | "Sandy"
  | "Plankton"
  | "Gary";
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  character: Character;
  image: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  inStock: boolean;
  featured: boolean;
  isNew: boolean;
  badge?: string;
  background: string;
  createdAt: number;
}
export interface CartItem {
  key: string;
  productId: string;
  quantity: number;
  color: string;
  size: string;
}
export interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
}
export interface DemoOrder {
  id: string;
  items: CartItem[];
  customer: Customer;
  shipping: number;
  subtotal: number;
  total: number;
  createdAt: string;
  shippingMethod: string;
}
