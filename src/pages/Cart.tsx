import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ProductArt } from "../components/ProductArt";
import { Flower, StarDoodle } from "../components/Decor";
import { formatPrice, getProduct } from "../data/products";
import { useStore } from "../state/Store";
import "./commerce.css";

export default function Cart() {
  const { cart, count, subtotal, updateQuantity, removeItem } = useStore();
  const subtotalCents = Math.round(subtotal * 100);
  const shippingCents = subtotalCents >= 7500 ? 0 : 500;
  const remainingCents = Math.max(0, 7500 - subtotalCents);

  return (
    <main className="commerce-page container">
      <nav className="commerce-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span aria-current="page">Your cart</span>
      </nav>
      <div className="commerce-heading">
        <div>
          <h1 className="page-title">
            Your Cart
            <Flower className="commerce-title-flower" />
          </h1>
          <p>A little Bikini Bottom happiness, coming right up.</p>
        </div>
        <span className="cart-item-count">
          {count} {count === 1 ? "happy find" : "happy finds"}
        </span>
      </div>

      {cart.length === 0 ? (
        <section className="commerce-empty" aria-labelledby="empty-cart-title">
          <div className="empty-bag">
            <ShoppingBag size={62} strokeWidth={1.5} />
            <StarDoodle className="empty-bag-spark" />
          </div>
          <h2 className="section-title" id="empty-cart-title">
            A little empty in here!
          </h2>
          <p>
            Your next favorite thing is waiting down in Bikini Bottom.
            <br />
            Let's fill this bag with something fun.
          </p>
          <Link to="/shop" className="button">
            Dive into the shop <ArrowRight size={18} />
          </Link>
        </section>
      ) : (
        <div className="commerce-layout cart-layout">
          <section className="cart-items" aria-label="Cart items">
            <div className="cart-table-heading">
              <span>Good stuff</span>
              <span>Quantity & total</span>
            </div>
            {cart.map((item) => {
              const product = getProduct(item.productId);
              if (!product) return null;
              return (
                <article className="cart-row" key={item.key}>
                  <Link
                    to={`/product/${product.id}`}
                    className="cart-product-image"
                    aria-label={`View ${product.name}`}
                  >
                    <ProductArt product={product} color={item.color} />
                  </Link>
                  <div className="cart-product-info">
                    <Link
                      to={`/product/${product.id}`}
                      className="cart-product-name"
                    >
                      {product.name}
                    </Link>
                    <p className="cart-unit-price">
                      {formatPrice(product.price)}
                    </p>
                    <p className="cart-variant">
                      {[item.color, item.size].filter(Boolean).join(" / ") ||
                        product.category}
                    </p>
                    <button
                      className="cart-remove-mobile text-action"
                      onClick={() => removeItem(item.key)}
                      type="button"
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="cart-quantity">
                    <div
                      className="quantity-control"
                      role="group"
                      aria-label={`Quantity for ${product.name}`}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.key, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        aria-label={`Decrease quantity of ${product.name}`}
                      >
                        <Minus size={14} />
                      </button>
                      <span aria-live="polite">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.key, item.quantity + 1)
                        }
                        disabled={item.quantity >= 99}
                        aria-label={`Increase quantity of ${product.name}`}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <strong className="cart-line-total">
                      {formatPrice(
                        (Math.round(product.price * 100) * item.quantity) / 100,
                      )}
                    </strong>
                  </div>
                  <button
                    type="button"
                    className="icon-button cart-remove"
                    onClick={() => removeItem(item.key)}
                    aria-label={`Remove ${product.name} from cart`}
                  >
                    <Trash2 size={19} />
                  </button>
                </article>
              );
            })}
            <div className="cart-bottom-links">
              <Link to="/shop" className="commerce-back">
                <ArrowLeft size={17} /> Continue shopping
              </Link>
              <span>
                <ShoppingBag size={15} /> Saved here for your next visit
              </span>
            </div>
          </section>

          <aside className="order-sidebar" aria-label="Order summary">
            <div className="order-summary-panel">
              <h2 className="section-title">Order Summary</h2>
              <div className="shipping-milestone">
                <p>
                  {remainingCents > 0 ? (
                    <>
                      <Truck size={18} />
                      <span>
                        You're{" "}
                        <strong>{formatPrice(remainingCents / 100)}</strong>{" "}
                        from free shipping!
                      </span>
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      <span>
                        Hooray! You've unlocked <strong>free shipping.</strong>
                      </span>
                    </>
                  )}
                </p>
                <div
                  className="shipping-meter"
                  role="progressbar"
                  aria-label="Progress toward free standard shipping"
                  aria-valuemin={0}
                  aria-valuemax={75}
                  aria-valuenow={Math.min(75, subtotal)}
                >
                  <span
                    style={{ width: `${Math.min(100, subtotalCents / 75)}%` }}
                  />
                </div>
              </div>
              <dl className="order-totals">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(subtotalCents / 100)}</dd>
                </div>
                <div>
                  <dt>Standard shipping</dt>
                  <dd>
                    {shippingCents ? (
                      formatPrice(shippingCents / 100)
                    ) : (
                      <span className="free-shipping">FREE</span>
                    )}
                  </dd>
                </div>
                <div className="order-grand-total">
                  <dt>
                    Total <span>USD</span>
                  </dt>
                  <dd>{formatPrice((subtotalCents + shippingCents) / 100)}</dd>
                </div>
              </dl>
              <Link to="/checkout" className="button checkout-button">
                Proceed to Checkout <ArrowRight size={19} />
              </Link>
              <p className="demo-payment-note">
                Demo checkout · no payment collected
              </p>
            </div>
            <div className="cart-help">
              <Truck size={21} />
              <div>
                <strong>A little shipping scoop</strong>
                <p>
                  Standard shipping is $5, or free on orders $75+. Choose
                  express at checkout.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
