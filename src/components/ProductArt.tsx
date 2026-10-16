import type { Product } from "../contracts";
import { colorImages } from "../data/products";

export function ProductArt({
  product,
  className = "",
  color = "",
  view = 0,
}: {
  product: Product;
  className?: string;
  color?: string;
  view?: number;
}) {
  const colorIndex = colorImages[product.id]?.[color];
  const index = view === 0 && colorIndex !== undefined ? colorIndex : view;
  const src = product.images[index] || product.image;
  return (
    <img
      className={`product-art ${className}`}
      src={src}
      alt={`${product.name}${color ? ` in ${color}` : ""}${index > 0 ? ` — product view ${index + 1}` : ""}`}
      width="800"
      height="800"
      loading="lazy"
      decoding="async"
    />
  );
}
