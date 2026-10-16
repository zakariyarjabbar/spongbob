import {
  ArrowRight,
  Check,
  CheckCircle2,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ProductArt } from "../components/ProductArt";
import { StarDoodle } from "../components/Decor";
import { formatPrice, getProduct } from "../data/products";
import { useStore } from "../state/Store";
import "./commerce.css";

export default function Confirmation() {
  const { id } = useParams();
  const { orders } = useStore();
  const order = orders.find((item) => item.id === id);

  if (!order)
    return (
      <main className="commerce-page container">
        <section className="commerce-empty">
          <div className="empty-bag">
            <Package size={62} strokeWidth={1.5} />
          </div>
          <h1 className="page-title">That order drifted away</h1>
          <p>
            We couldn't find that demo order in this browser.
            <br />
            Your order history lives on the device where you placed it.
          </p>
          <Link className="button" to="/shop">
            Back to the shop <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    );

  const purchasedCount = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  return (
    <main className="commerce-page confirmation-page container">
      <section
        className="confirmation-hero"
        aria-labelledby="confirmation-title"
      >
        <div className="confirmation-illustration">
          <StarDoodle className="confirmation-star star-one" />
          <StarDoodle className="confirmation-star star-two" />
          <img
            src="/assets/hero.png"
            alt="SpongeBob celebrating with a big smile"
          />
          <span className="confirmation-check">
            <Check size={28} strokeWidth={3} />
          </span>
        </div>
        <div className="confirmation-message">
          <h1 className="page-title" id="confirmation-title">
            Order <span>confirmed!</span>
          </h1>
          <p>
            Well, this calls for a happy dance.
            <br />
            Thanks for taking a little trip to SpongeWorld!
          </p>
          <div className="confirmation-order-badge">
            <CheckCircle2 size={21} />
            <div>
              <span>Demo order created</span>
              <strong>#{order.id}</strong>
            </div>
          </div>
          <p className="confirmation-demo-disclosure">
            This is a demo order. No payment was collected and no items will
            ship.
          </p>
          <Link to="/shop" className="button">
            Keep the good vibes going <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <div className="confirmation-details">
        <section
          className="confirmation-purchased"
          aria-labelledby="purchased-heading"
        >
          <div className="confirmation-section-heading">
            <h2 className="section-title" id="purchased-heading">
              <ShoppingBag size={24} /> Your happy haul
            </h2>
            <span>
              {purchasedCount} {purchasedCount === 1 ? "item" : "items"}
            </span>
          </div>
          <div className="receipt-items">
            {order.items.map((item) => {
              const product = getProduct(item.productId);
              return (
                <div className="receipt-item" key={item.key}>
                  <div className="receipt-art">
                    {product ? (
                      <ProductArt product={product} color={item.color} />
                    ) : (
                      <Package size={30} />
                    )}
                  </div>
                  <div>
                    <strong>{product?.name || "Catalog item"}</strong>
                    <p>{[item.color, item.size].filter(Boolean).join(" / ")}</p>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  {product && (
                    <strong>
                      {formatPrice(
                        (Math.round(product.price * 100) * item.quantity) / 100,
                      )}
                    </strong>
                  )}
                </div>
              );
            })}
          </div>
          <dl className="order-totals receipt-totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            <div>
              <dt>{order.shippingMethod}</dt>
              <dd>{order.shipping ? formatPrice(order.shipping) : "FREE"}</dd>
            </div>
            <div className="order-grand-total">
              <dt>
                Demo total <span>USD</span>
              </dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </section>
        <aside
          className="confirmation-shipping"
          aria-labelledby="shipping-details-heading"
        >
          <h2 className="section-title" id="shipping-details-heading">
            <MapPin size={23} /> Shipping details
          </h2>
          <address>
            <strong>{order.customer.name}</strong>
            <span>{order.customer.address}</span>
            <span>
              {order.customer.city}
              {order.customer.postalCode
                ? `, ${order.customer.postalCode}`
                : ""}
            </span>
            <span>{order.customer.country}</span>
          </address>
          <div className="confirmation-contact">
            <span>{order.customer.email}</span>
            <span>{order.customer.phone}</span>
          </div>
          {order.customer.notes && (
            <div className="confirmation-notes">
              <strong>Order notes</strong>
              <p>{order.customer.notes}</p>
            </div>
          )}
          <div className="confirmation-status">
            <Package size={22} />
            <div>
              <strong>Demo order created</strong>
              <p>
                Saved on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                . You can view it again in your account on this browser.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
