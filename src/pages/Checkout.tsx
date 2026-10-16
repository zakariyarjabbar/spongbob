import { useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  LockKeyhole,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ProductArt } from "../components/ProductArt";
import { formatPrice, getProduct } from "../data/products";
import { useStore } from "../state/Store";
import type { Customer } from "../contracts";
import "./commerce.css";

const initialCustomer: Customer = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  notes: "",
};
const countries = [
  "Iraq",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "India",
  "Saudi Arabia",
  "United Arab Emirates",
  "Jordan",
  "Kuwait",
  "Qatar",
  "Türkiye",
  "Other",
];
const postalRequired = new Set([
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "India",
]);
type Errors = Partial<Record<keyof Customer, string>>;

function validate(customer: Customer): Errors {
  const errors: Errors = {};
  if (customer.name.trim().length < 2)
    errors.name = "Enter your full name (at least 2 characters).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim()))
    errors.email = "Enter a valid email address, like you@example.com.";
  if (
    customer.phone.replace(/\D/g, "").length < 7 ||
    customer.phone.replace(/\D/g, "").length > 15 ||
    !/^[+\d\s().-]+$/.test(customer.phone.trim())
  )
    errors.phone =
      "Enter a phone number with 7–15 digits, including your country code.";
  if (customer.address.trim().length < 5)
    errors.address =
      "Enter your street address, building, and apartment if applicable.";
  if (customer.city.trim().length < 2) errors.city = "Enter your city or town.";
  if (!countries.includes(customer.country))
    errors.country = "Choose a shipping country.";
  if (postalRequired.has(customer.country) && !customer.postalCode.trim())
    errors.postalCode = "Enter a postal code for your shipping country.";
  else if (
    customer.postalCode &&
    !/^[\p{L}\p{N}\s-]{2,12}$/u.test(customer.postalCode.trim())
  )
    errors.postalCode = "Use 2–12 letters, numbers, spaces, or hyphens.";
  if (
    customer.country === "United States" &&
    customer.postalCode.trim() &&
    !/^\d{5}(-\d{4})?$/.test(customer.postalCode.trim())
  )
    errors.postalCode = "Enter a 5-digit ZIP code, or ZIP+4 (12345-6789).";
  if (customer.notes.length > 500)
    errors.notes = "Keep your order notes to 500 characters or fewer.";
  return errors;
}

export default function Checkout() {
  const { cart, subtotal, placeOrder } = useStore();
  const [customer, setCustomer] = useState<Customer>(initialCustomer);
  const [errors, setErrors] = useState<Errors>({});
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submitLock = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const subtotalCents = Math.round(subtotal * 100);
  const standardCents = subtotalCents >= 7500 ? 0 : 500;
  const shippingCents = shippingMethod === "express" ? 1200 : standardCents;
  const isPostalRequired = postalRequired.has(customer.country);

  function updateField(field: keyof Customer, value: string) {
    const next = { ...customer, [field]: value };
    setCustomer(next);
    if (errors[field] || field === "country") {
      const nextErrors = validate(next);
      setErrors((previous) => ({
        ...previous,
        [field]: nextErrors[field],
        ...(field === "country" && previous.postalCode
          ? { postalCode: nextErrors.postalCode }
          : {}),
      }));
    }
  }

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current || !cart.length) return;
    const nextErrors = validate(customer);
    setErrors(nextErrors);
    setSubmitError("");
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() =>
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus(),
      );
      return;
    }
    submitLock.current = true;
    setSubmitting(true);
    try {
      const cleanCustomer = Object.fromEntries(
        Object.entries(customer).map(([key, value]) => [key, value.trim()]),
      ) as unknown as Customer;
      const order = placeOrder(
        cleanCustomer,
        shippingMethod === "express" ? "Express shipping" : "Standard shipping",
        shippingCents / 100,
      );
      navigate(`/order/${order.id}`, { replace: true });
    } catch {
      setSubmitError(
        "We could not save your demo order. Your bag is still here. Please try again.",
      );
      setSubmitting(false);
      submitLock.current = false;
    }
  }

  if (!cart.length && !submitting)
    return (
      <main className="commerce-page container">
        <section className="commerce-empty">
          <div className="empty-bag">
            <ShoppingBag size={62} strokeWidth={1.5} />
          </div>
          <h1 className="page-title">Your bag needs a little fun</h1>
          <p>Add something you love before checking out.</p>
          <Link className="button" to="/shop">
            Explore the shop <ArrowRight size={18} />
          </Link>
        </section>
      </main>
    );

  const field = (
    name: keyof Customer,
    label: string,
    options: {
      type?: string;
      autoComplete?: string;
      placeholder?: string;
      maxLength?: number;
      optional?: boolean;
      wide?: boolean;
    } = {},
  ) => (
    <div
      className={`checkout-field ${options.wide ? "field-wide" : ""}`}
      key={name}
    >
      <label htmlFor={`checkout-${name}`}>
        {label}
        {options.optional && <span> (optional)</span>}
      </label>
      <input
        id={`checkout-${name}`}
        name={name}
        type={options.type || "text"}
        value={customer[name]}
        onChange={(event) => updateField(name, event.target.value)}
        autoComplete={options.autoComplete}
        placeholder={options.placeholder}
        maxLength={options.maxLength || 100}
        required={!options.optional}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `error-${name}` : undefined}
      />
      {errors[name] && (
        <p className="field-error" id={`error-${name}`}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <main className="commerce-page container">
      <nav className="commerce-breadcrumb" aria-label="Breadcrumb">
        <Link to="/cart">Your cart</Link>
        <span>/</span>
        <span aria-current="page">Checkout</span>
      </nav>
      <div className="commerce-heading">
        <div>
          <h1 className="page-title">Almost shore there!</h1>
          <p>Just a few details between you and a very happy bag.</p>
        </div>
        <Link to="/cart" className="commerce-back">
          <ArrowLeft size={17} /> Back to cart
        </Link>
      </div>
      <div className="checkout-demo-banner">
        <LockKeyhole size={22} />
        <p>
          <strong>You're in the demo checkout.</strong> No money is charged, no
          card details are collected, and no items will ship.
        </p>
      </div>
      <form
        onSubmit={submitOrder}
        noValidate
        ref={formRef}
        className="commerce-layout checkout-layout"
      >
        <div className="checkout-form-sections">
          <section
            className="checkout-section"
            aria-labelledby="shipping-heading"
          >
            <h2 id="shipping-heading" className="section-title">
              <span className="checkout-step">1</span> Shipping information
            </h2>
            <div className="checkout-fields">
              {field("name", "Full name", {
                autoComplete: "name",
                placeholder: "Your name",
                wide: true,
              })}
              {field("email", "Email address", {
                type: "email",
                autoComplete: "email",
                placeholder: "you@example.com",
                maxLength: 254,
              })}
              {field("phone", "Phone number", {
                type: "tel",
                autoComplete: "tel",
                placeholder: "+964 7XX XXX XXXX",
                maxLength: 30,
              })}
              {field("address", "Street address", {
                autoComplete: "street-address",
                placeholder: "Street, building, apartment",
                maxLength: 200,
                wide: true,
              })}
              {field("city", "City", {
                autoComplete: "address-level2",
                placeholder: "Your city",
              })}
              <div className="checkout-field">
                <label htmlFor="checkout-country">Country</label>
                <select
                  name="country"
                  id="checkout-country"
                  value={customer.country}
                  onChange={(event) =>
                    updateField("country", event.target.value)
                  }
                  autoComplete="country-name"
                  required
                  aria-invalid={!!errors.country}
                  aria-describedby={
                    errors.country ? "error-country" : undefined
                  }
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="field-error" id="error-country">
                    {errors.country}
                  </p>
                )}
              </div>
              {field(
                "postalCode",
                customer.country === "United States"
                  ? "ZIP code"
                  : "Postal code",
                {
                  autoComplete: "postal-code",
                  placeholder: isPostalRequired
                    ? "Your postal code"
                    : "If applicable",
                  maxLength: 12,
                  optional: !isPostalRequired,
                },
              )}
              <div className="checkout-field field-wide">
                <label htmlFor="checkout-notes">
                  Order notes <span>(optional)</span>
                </label>
                <textarea
                  id="checkout-notes"
                  name="notes"
                  value={customer.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="Anything else we should know?"
                  rows={3}
                  maxLength={500}
                  aria-invalid={!!errors.notes}
                  aria-describedby={errors.notes ? "error-notes" : undefined}
                />
                {errors.notes && (
                  <p className="field-error" id="error-notes">
                    {errors.notes}
                  </p>
                )}
              </div>
            </div>
          </section>
          <section
            className="checkout-section"
            aria-labelledby="delivery-heading"
          >
            <h2 className="section-title" id="delivery-heading">
              <span className="checkout-step">2</span> Shipping method
            </h2>
            <div className="shipping-options">
              <label
                className={`shipping-option ${shippingMethod === "standard" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  value="standard"
                  checked={shippingMethod === "standard"}
                  onChange={() => setShippingMethod("standard")}
                />
                <Truck size={22} />
                <span>
                  <strong>Standard shipping</strong>
                  <small>Free on orders $75+</small>
                </span>
                <strong>
                  {standardCents ? formatPrice(standardCents / 100) : "FREE"}
                </strong>
              </label>
              <label
                className={`shipping-option ${shippingMethod === "express" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="shippingMethod"
                  value="express"
                  checked={shippingMethod === "express"}
                  onChange={() => setShippingMethod("express")}
                />
                <Truck size={22} />
                <span>
                  <strong>Express shipping</strong>
                  <small>Priority shipping option</small>
                </span>
                <strong>{formatPrice(12)}</strong>
              </label>
            </div>
          </section>
          <section
            className="checkout-section"
            aria-labelledby="payment-heading"
          >
            <h2 className="section-title" id="payment-heading">
              <span className="checkout-step">3</span> Payment method
            </h2>
            <label className="demo-payment-option">
              <input
                type="radio"
                name="paymentMethod"
                checked
                readOnly
                value="demo"
              />
              <CreditCard size={24} />
              <span>
                <strong>Demo payment</strong>
                <small>
                  No payment required. This creates a local sample order.
                </small>
              </span>
              <Check size={19} />
            </label>
          </section>
        </div>
        <aside
          className="order-sidebar checkout-sidebar"
          aria-labelledby="checkout-summary-heading"
        >
          <div className="order-summary-panel">
            <h2 className="section-title" id="checkout-summary-heading">
              Your happy haul
            </h2>
            <div className="checkout-order-items">
              {cart.map((item) => {
                const product = getProduct(item.productId);
                return (
                  product && (
                    <div className="checkout-order-item" key={item.key}>
                      <div className="checkout-item-art">
                        <ProductArt product={product} color={item.color} />
                        <span>{item.quantity}</span>
                      </div>
                      <div>
                        <strong>{product.name}</strong>
                        <small>
                          {[item.color, item.size]
                            .filter(Boolean)
                            .join(" / ") || product.category}
                        </small>
                      </div>
                      <strong>
                        {formatPrice(
                          (Math.round(product.price * 100) * item.quantity) /
                            100,
                        )}
                      </strong>
                    </div>
                  )
                );
              })}
            </div>
            <dl className="order-totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatPrice(subtotalCents / 100)}</dd>
              </div>
              <div>
                <dt>
                  {shippingMethod === "express" ? "Express" : "Standard"}{" "}
                  shipping
                </dt>
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
            {Object.values(errors).some(Boolean) && (
              <p className="checkout-validation-note" role="alert">
                Check the highlighted fields to finish your order.
              </p>
            )}
            {submitError && (
              <p className="checkout-validation-note" role="alert">
                {submitError}
              </p>
            )}
            <button
              className="button checkout-button"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Creating your order…" : "Place demo order"}
              <ArrowRight size={19} />
            </button>
            <p className="demo-payment-note">
              <LockKeyhole size={13} /> No charge. Just a little demo magic.
            </p>
          </div>
          <p className="checkout-privacy-note">
            Demo orders are saved in this browser. Use sample contact details to
            try the experience.
          </p>
        </aside>
      </form>
    </main>
  );
}
