import { Heart, ShoppingCart, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../contracts";
import { formatPrice } from "../data/products";
import { useStore } from "../state/Store";
import { ProductArt } from "./ProductArt";
import "./product-card.css";

export function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWishlist, addItem } = useStore();
  const saved = wishlist.includes(product.id);
  const requiresOptions = product.sizes.length > 1 || product.colors.length > 1;
  return (
    <article className="product-card">
      <div
        className="product-card-picture"
        style={{ backgroundColor: product.background }}
      >
        <Link
          className="product-card-image-link"
          to={`/product/${product.id}`}
          aria-label={`View ${product.name}`}
        >
          <ProductArt product={product} />
        </Link>
        {product.badge ? (
          <span
            className={`product-card-badge ${product.isNew ? "product-card-badge-new" : ""}`}
          >
            {product.badge}
          </span>
        ) : null}
        <button
          type="button"
          className={`product-card-heart ${saved ? "is-saved" : ""}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label={`${saved ? "Remove" : "Save"} ${product.name} ${saved ? "from" : "to"} favorites`}
          aria-pressed={saved}
        >
          <Heart
            size={18}
            fill={saved ? "currentColor" : "none"}
            strokeWidth={1.8}
          />
        </button>
        <span className="product-card-flower" aria-hidden="true">
          ✿
        </span>
      </div>
      <div className="product-card-body">
        <span className="product-card-type">{product.category}</span>
        <Link className="product-card-name" to={`/product/${product.id}`}>
          {product.name}
        </Link>
        <div className="product-card-bottom">
          <strong>{formatPrice(product.price)}</strong>
          {requiresOptions ? (
            <Link
              className="product-card-cart"
              to={`/product/${product.id}`}
              aria-label={`Choose options for ${product.name}`}
            >
              <ShoppingCart size={18} strokeWidth={2} />
              <ArrowUpRight className="product-card-option-arrow" size={10} />
            </Link>
          ) : (
            <button
              type="button"
              className="product-card-cart"
              disabled={!product.inStock}
              onClick={() => addItem(product.id)}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart size={18} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
