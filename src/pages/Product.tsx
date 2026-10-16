import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Minus,
  Plus,
  Ruler,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Undo2,
  X,
} from "lucide-react";
import { getProduct, products, formatPrice } from "../data/products";
import { ProductArt } from "../components/ProductArt";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../state/Store";
import "./catalog.css";

function swatchInk(hex: string) {
  const value = Number.parseInt(hex.replace("#", ""), 16);
  const luminance = [value >> 16, (value >> 8) & 255, value & 255]
    .map((channel) => {
      const amount = channel / 255;
      return amount <= 0.04045
        ? amount / 12.92
        : ((amount + 0.055) / 1.055) ** 2.4;
    })
    .reduce(
      (total, channel, index) =>
        total + channel * [0.2126, 0.7152, 0.0722][index],
      0,
    );
  return luminance < 0.25 ? "#fff" : "#181b16";
}

export default function Product() {
  const { id } = useParams();
  const product = getProduct(id || "");
  const { addItem, wishlist, toggleWishlist, notify } = useStore();
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [view, setView] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const [added, setAdded] = useState(false);
  const sizeDialog = useRef<HTMLDialogElement>(null);
  const sizeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setColor(product?.colors.length === 1 ? product.colors[0].name : "");
    setSize(product?.sizes.length === 1 ? product.sizes[0] : "");
    setQuantity(1);
    setView(0);
    setAttempted(false);
    setAdded(false);
  }, [id]);

  if (!product)
    return (
      <main className="container product-not-found">
        <h1 className="page-title">This one swam away.</h1>
        <p>
          We couldn’t find that product. There are plenty more good things in
          the sea.
        </p>
        <Link to="/shop" className="button">
          Back to the shop <ArrowRight size={18} />
        </Link>
      </main>
    );

  const saved = wishlist.includes(product.id);
  const colorMissing = product.colors.length > 0 && !color;
  const sizeMissing = product.sizes.length > 0 && !size;
  const related = products
    .filter((item) => item.id !== product.id)
    .sort(
      (a, b) =>
        Number(b.character === product.character) -
          Number(a.character === product.character) ||
        Number(b.category === product.category) -
          Number(a.category === product.category),
    )
    .slice(0, 4);
  const galleryImages = product.images.length
    ? product.images
    : [product.image];

  function addToCart() {
    if (!product) return;
    setAttempted(true);
    if (colorMissing || sizeMissing) {
      notify(
        `Choose ${colorMissing && sizeMissing ? "a color and size" : colorMissing ? "a color" : "a size"} first.`,
      );
      document
        .getElementById(colorMissing ? "product-colors" : "product-sizes")
        ?.focus();
      return;
    }
    if (addItem(product.id, quantity, color, size)) setAdded(true);
  }

  function closeSizeGuide() {
    sizeDialog.current?.close();
    sizeButton.current?.focus();
  }

  return (
    <main className="product-page container">
      <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>
          {product.category}
        </Link>
        <span>/</span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <div className="product-layout">
        <section
          className="product-gallery"
          aria-label={`${product.name} images`}
        >
          <div
            className="product-main-art"
            style={{ background: product.background }}
          >
            {product.badge && (
              <span className="product-gallery-badge">{product.badge}</span>
            )}
            <ProductArt product={product} view={view} color={color} />
            <button
              className={`product-save icon-button ${saved ? "is-saved" : ""}`}
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              aria-pressed={saved}
            >
              <Heart size={22} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="product-thumbnails">
            {galleryImages.map((_, index) => (
              <button
                key={index}
                className={index === view ? "selected" : ""}
                type="button"
                aria-label={`Show product image ${index + 1}`}
                aria-pressed={index === view}
                onClick={() => setView(index)}
                style={{ background: product.background }}
              >
                <ProductArt product={product} view={index} color={color} />
              </button>
            ))}
          </div>
          <Link className="product-back-link" to="/shop">
            <ArrowLeft size={15} /> A little more browsing?
          </Link>
        </section>
        <section
          className="product-information"
          aria-labelledby="product-title"
        >
          <h1 id="product-title">{product.name}</h1>
          <p className="product-price">{formatPrice(product.price)}</p>
          <p className="product-description">{product.description}</p>
          <div
            className={`product-stock ${product.inStock ? "" : "unavailable"}`}
          >
            <span />
            {product.inStock
              ? "In stock · Ready for good vibes"
              : "Currently unavailable"}
          </div>
          {product.colors.length > 0 && (
            <fieldset
              id="product-colors"
              className={`product-options ${attempted && colorMissing ? "has-error" : ""}`}
              tabIndex={-1}
            >
              <legend>
                Color <span>{color || "Choose a color"}</span>
              </legend>
              <div className="product-color-list">
                {product.colors.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    className={
                      color === option.name
                        ? "product-color selected"
                        : "product-color"
                    }
                    style={{ "--swatch": option.hex } as React.CSSProperties}
                    onClick={() => {
                      setColor(option.name);
                      setView(0);
                      setAdded(false);
                    }}
                    aria-label={option.name}
                    aria-pressed={color === option.name}
                    title={option.name}
                  >
                    {color === option.name && (
                      <Check
                        size={16}
                        style={{ color: swatchInk(option.hex) }}
                      />
                    )}
                  </button>
                ))}
              </div>
              {attempted && colorMissing && (
                <p className="product-option-error">
                  Choose a color to add this item.
                </p>
              )}
            </fieldset>
          )}
          {product.sizes.length > 0 && (
            <fieldset
              id="product-sizes"
              className={`product-options ${attempted && sizeMissing ? "has-error" : ""}`}
              tabIndex={-1}
            >
              <legend>
                Size <span>{size || "Choose a size"}</span>
              </legend>
              <div className="product-size-row">
                <div className="product-size-list">
                  {product.sizes.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSize(option);
                        setAdded(false);
                      }}
                      className={size === option ? "selected" : ""}
                      aria-pressed={size === option}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {product.sizes.length > 1 && (
                  <button
                    ref={sizeButton}
                    className="product-size-guide"
                    type="button"
                    onClick={() => sizeDialog.current?.showModal()}
                  >
                    <Ruler size={16} /> Size guide
                  </button>
                )}
              </div>
              {attempted && sizeMissing && (
                <p className="product-option-error">
                  Choose a size to add this item.
                </p>
              )}
            </fieldset>
          )}
          <div className="product-purchase">
            <div className="product-quantity" aria-label="Quantity">
              <button
                type="button"
                onClick={() => {
                  setQuantity((value) => Math.max(1, value - 1));
                  setAdded(false);
                }}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <input
                type="number"
                min="1"
                max="10"
                step="1"
                value={quantity}
                onChange={(event) => {
                  setQuantity(
                    Math.min(
                      10,
                      Math.max(1, Math.trunc(Number(event.target.value)) || 1),
                    ),
                  );
                  setAdded(false);
                }}
                aria-label="Quantity"
              />
              <button
                type="button"
                onClick={() => {
                  setQuantity((value) => Math.min(10, value + 1));
                  setAdded(false);
                }}
                disabled={quantity >= 10}
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              className="button product-add"
              type="button"
              disabled={!product.inStock}
              onClick={addToCart}
            >
              {added ? <Check size={21} /> : <ShoppingCart size={21} />}{" "}
              {product.inStock
                ? added
                  ? "Added! High five."
                  : "Add to Cart"
                : "Out of stock"}
            </button>
          </div>
          {added && (
            <p className="product-added" role="status">
              Your good vibes are in the bag.{" "}
              <Link to="/cart">
                View your cart <ArrowRight size={13} />
              </Link>
            </p>
          )}
          <div className="product-promises">
            <div>
              <Truck size={24} />
              <span>
                Free shipping<small>On orders $75+</small>
              </span>
            </div>
            <div>
              <Undo2 size={24} />
              <span>
                Made for fans<small>Joy in every detail</small>
              </span>
            </div>
            <div>
              <ShieldCheck size={24} />
              <span>
                Demo checkout<small>No payment collected</small>
              </span>
            </div>
          </div>
          <div className="product-disclosures">
            <details open>
              <summary>
                Product details <ChevronDown size={18} />
              </summary>
              <div>
                <dl>
                  <div>
                    <dt>Character</dt>
                    <dd>
                      <Link
                        to={`/shop?character=${encodeURIComponent(product.character)}`}
                      >
                        {product.character}
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt>Category</dt>
                    <dd>{product.category}</dd>
                  </div>
                  <div>
                    <dt>Product code</dt>
                    <dd>{product.id.toUpperCase()}</dd>
                  </div>
                </dl>
              </div>
            </details>
            <details>
              <summary>
                Shipping & returns <ChevronDown size={18} />
              </summary>
              <div>
                <p>
                  Review your shipping options and estimate at checkout. This is
                  a demo store: no real payment is collected and no products are
                  dispatched.
                </p>
                <p>
                  A live store would confirm delivery times and its return
                  policy before accepting your order.
                </p>
              </div>
            </details>
          </div>
        </section>
      </div>
      <section
        className="product-recommendations"
        aria-labelledby="recommendations-title"
      >
        <div className="product-section-heading">
          <h2 id="recommendations-title" className="section-title">
            You may also like
          </h2>
          <Link to="/shop">
            More good stuff <ArrowRight size={16} />
          </Link>
        </div>
        <div className="product-related-grid">
          {related.map((item) => (
            <ProductCard product={item} key={item.id} />
          ))}
        </div>
      </section>
      <dialog
        ref={sizeDialog}
        className="product-size-dialog"
        aria-labelledby="size-guide-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeSizeGuide();
        }}
        onCancel={(event) => {
          event.preventDefault();
          closeSizeGuide();
        }}
      >
        <div className="size-guide-interior">
          <div className="size-guide-heading">
            <h2 id="size-guide-title" className="section-title">
              Find your happy fit
            </h2>
            <button
              className="icon-button"
              type="button"
              onClick={closeSizeGuide}
              aria-label="Close size guide"
              autoFocus
            >
              <X size={22} />
            </button>
          </div>
          <p>
            Compare with a favorite tee laid flat. Measurements below are an
            illustrative guide for this demo, in inches.
          </p>
          <div className="size-table-wrap">
            <table>
              <caption className="sr-only">
                Illustrative apparel size measurements in inches
              </caption>
              <thead>
                <tr>
                  <th scope="col">Size</th>
                  <th scope="col">Chest width</th>
                  <th scope="col">Body length</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["S", "18", "28"],
                  ["M", "20", "29"],
                  ["L", "22", "30"],
                  ["XL", "24", "31"],
                  ["XXL", "26", "32"],
                ].map((row) => (
                  <tr key={row[0]}>
                    <th scope="row">{row[0]}</th>
                    <td>{row[1]}″</td>
                    <td>{row[2]}″</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="size-guide-note">
            For a real purchase, use the supplier’s product-specific size chart.
          </p>
          <button className="button" type="button" onClick={closeSizeGuide}>
            Got it <Check size={18} />
          </button>
        </div>
      </dialog>
    </main>
  );
}
