import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { categories, characters, products } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { useStore } from "../state/Store";
import "./catalog.css";

const priceOptions = [
  { value: "under20", label: "Under $20" },
  { value: "20to50", label: "$20 – $50" },
  { value: "over50", label: "$50 & up" },
];

function Flower({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M47 40C18 5 1 35 32 48C-7 48 6 78 39 60C17 95 53 105 53 68C74 99 99 74 68 55C106 53 93 20 63 37C71 0 36 0 47 40Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="51" cy="51" r="7" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const { wishlist } = useStore();
  const drawer = useRef<HTMLDialogElement>(null);
  const filterButton = useRef<HTMLButtonElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const category = params.getAll("category");
  const character = params.getAll("character");
  const prices = params.getAll("price");
  const query = params.get("q") || "";
  const sort = params.get("sort") || "featured";
  const savedOnly = params.get("wishlist") === "true";
  const activeCount = category.length + character.length + prices.length;

  useEffect(() => {
    if (!drawerOpen) return;
    const dialog = drawer.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    return () => {
      document.body.style.overflow = previous;
      if (dialog?.open) dialog.close();
    };
  }, [drawerOpen]);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  function toggle(key: string, value: string) {
    const next = new URLSearchParams(params);
    const selected = next.getAll(key);
    next.delete(key);
    (selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
    ).forEach((item) => next.append(key, item));
    setParams(next, { replace: true });
  }

  function clearFilters() {
    const next = new URLSearchParams(params);
    ["category", "character", "price", "q"].forEach((key) => next.delete(key));
    setParams(next, { replace: true });
  }

  const filtered = useMemo(
    () =>
      products
        .filter((product) => {
          if (savedOnly && !wishlist.includes(product.id)) return false;
          if (category.length && !category.includes(product.category))
            return false;
          if (character.length && !character.includes(product.character))
            return false;
          if (
            prices.length &&
            !prices.some((price) =>
              price === "under20"
                ? product.price < 20
                : price === "20to50"
                  ? product.price >= 20 && product.price < 50
                  : product.price >= 50,
            )
          )
            return false;
          const searchable =
            `${product.name} ${product.character} ${product.category} ${product.description}`.toLowerCase();
          return searchable.includes(query.trim().toLowerCase());
        })
        .sort((a, b) =>
          sort === "price-low"
            ? a.price - b.price
            : sort === "price-high"
              ? b.price - a.price
              : sort === "newest"
                ? b.createdAt - a.createdAt
                : Number(b.featured) - Number(a.featured),
        ),
    [
      category.join("|"),
      character.join("|"),
      prices.join("|"),
      query,
      sort,
      savedOnly,
      wishlist,
    ],
  );

  function closeDrawer() {
    setDrawerOpen(false);
    filterButton.current?.focus();
  }

  function renderFilters(prefix: string) {
    return (
      <>
        <fieldset className="catalog-filter-group">
          <legend>Categories</legend>
          <button
            className={`catalog-all ${!category.length ? "selected" : ""}`}
            type="button"
            onClick={() => {
              const next = new URLSearchParams(params);
              next.delete("category");
              setParams(next, { replace: true });
            }}
          >
            <span className="catalog-check-box">
              {!category.length && <Check size={12} strokeWidth={3} />}
            </span>
            <span>All products</span>
            <small>{products.length}</small>
          </button>
          {categories.map((item) => (
            <label
              className="catalog-filter-option"
              key={item}
              htmlFor={`${prefix}-category-${item}`}
            >
              <input
                id={`${prefix}-category-${item}`}
                type="checkbox"
                checked={category.includes(item)}
                onChange={() => toggle("category", item)}
              />
              <span>{item}</span>
              <small>
                {products.filter((p) => p.category === item).length}
              </small>
            </label>
          ))}
        </fieldset>
        <fieldset className="catalog-filter-group">
          <legend>Characters</legend>
          {characters.map((item, index) => (
            <label
              className="catalog-filter-option"
              key={item}
              htmlFor={`${prefix}-character-${item}`}
            >
              <input
                id={`${prefix}-character-${item}`}
                type="checkbox"
                checked={character.includes(item)}
                onChange={() => toggle("character", item)}
              />
              <span
                className={`character-dot dot-${index}`}
                aria-hidden="true"
              />
              <span>{item}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className="catalog-filter-group">
          <legend>Price</legend>
          {priceOptions.map((item) => (
            <label
              className="catalog-filter-option"
              key={item.value}
              htmlFor={`${prefix}-price-${item.value}`}
            >
              <input
                id={`${prefix}-price-${item.value}`}
                type="checkbox"
                checked={prices.includes(item.value)}
                onChange={() => toggle("price", item.value)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </fieldset>
        {activeCount > 0 && (
          <button
            className="catalog-clear"
            type="button"
            onClick={clearFilters}
          >
            Clear all filters <X size={14} />
          </button>
        )}
      </>
    );
  }

  return (
    <main className="catalog-page container">
      <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span aria-current="page">{savedOnly ? "Your wishlist" : "Shop"}</span>
      </nav>
      <div className="catalog-layout">
        <aside className="catalog-sidebar" aria-label="Filter products">
          <div className="catalog-sidebar-top">
            <SlidersHorizontal size={17} />
            <span>Find your favorites</span>
          </div>
          {renderFilters("desktop")}
          <div className="catalog-sidebar-flowers">
            <Flower />
            <Flower />
          </div>
        </aside>
        <div className="catalog-main">
          <section className="catalog-banner" aria-labelledby="catalog-title">
            <Flower className="catalog-banner-flower one" />
            <Flower className="catalog-banner-flower two" />
            <div className="catalog-banner-copy">
              <h1 id="catalog-title">
                {savedOnly ? (
                  <>
                    Your very
                    <br />
                    <span>favorite things.</span>
                  </>
                ) : (
                  <>
                    All things
                    <br />
                    <span>SpongeBob.</span>
                  </>
                )}
              </h1>
              <p>
                {savedOnly
                  ? "A little collection of things you love."
                  : "Big smiles. Good vibes. Bottom-of-the-sea style."}
              </p>
            </div>
            <img
              className="catalog-banner-character"
              src="/assets/hero.png"
              alt=""
            />
            <span
              className="catalog-banner-bubble bubble-one"
              aria-hidden="true"
            />
            <span
              className="catalog-banner-bubble bubble-two"
              aria-hidden="true"
            />
          </section>
          <div className="catalog-toolbar">
            <label className="catalog-search">
              <Search size={17} />
              <span className="sr-only">Search products</span>
              <input
                type="search"
                value={query}
                placeholder="Find something fun…"
                onChange={(event) => update("q", event.target.value)}
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear product search"
                  onClick={() => update("q", "")}
                >
                  <X size={15} />
                </button>
              )}
            </label>
            <button
              ref={filterButton}
              type="button"
              className="catalog-mobile-filter"
              onClick={() => setDrawerOpen(true)}
            >
              <SlidersHorizontal size={17} /> Filters{" "}
              {activeCount > 0 && <span>{activeCount}</span>}
            </button>
            <label className="catalog-sort">
              <span className="catalog-sort-prefix">Sort by:</span>
              <span className="sr-only">Sort products</span>
              <select
                value={sort}
                onChange={(event) => update("sort", event.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
              <ChevronDown size={15} />
            </label>
          </div>
          <div className="catalog-results-line">
            <p aria-live="polite">
              {filtered.length}{" "}
              {filtered.length === 1 ? "good find" : "good finds"}
              {query ? ` for “${query}”` : ""}
            </p>
            <button
              type="button"
              className={savedOnly ? "catalog-saved active" : "catalog-saved"}
              aria-pressed={savedOnly}
              onClick={() => update("wishlist", savedOnly ? "" : "true")}
            >
              <Heart size={15} fill={savedOnly ? "currentColor" : "none"} />{" "}
              Wishlist{wishlist.length > 0 ? ` (${wishlist.length})` : ""}
            </button>
          </div>
          {activeCount > 0 && (
            <div className="catalog-active-filters" aria-label="Active filters">
              {[
                ...category.map((value) => ({
                  key: "category",
                  value,
                  label: value,
                })),
                ...character.map((value) => ({
                  key: "character",
                  value,
                  label: value,
                })),
                ...prices.map((value) => ({
                  key: "price",
                  value,
                  label:
                    priceOptions.find((p) => p.value === value)?.label || value,
                })),
              ].map((item) => (
                <button
                  key={`${item.key}-${item.value}`}
                  type="button"
                  onClick={() => toggle(item.key, item.value)}
                  aria-label={`Remove ${item.label} filter`}
                >
                  {item.label}
                  <X size={12} />
                </button>
              ))}
            </div>
          )}
          {filtered.length ? (
            <div className="catalog-grid">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <section className="catalog-empty">
              <Heart size={42} />
              <h2 className="section-title">
                {savedOnly && !wishlist.length
                  ? "Your favorites start here."
                  : "Nothing in this net. Yet."}
              </h2>
              <p>
                {savedOnly && !wishlist.length
                  ? "Tap a heart on any product to save it for later."
                  : "Try a different search or loosen up your filters."}
              </p>
              <button
                className="button"
                type="button"
                onClick={() => {
                  clearFilters();
                  if (savedOnly) {
                    const next = new URLSearchParams();
                    setParams(next);
                  }
                }}
              >
                Explore all products <ArrowRight size={18} />
              </button>
            </section>
          )}
          {filtered.length > 0 && (
            <div className="catalog-end">
              <Flower />
              <span>You’ve reached the bottom. Bikini Bottom.</span>
              <Flower />
            </div>
          )}
        </div>
      </div>
      <dialog
        ref={drawer}
        className="catalog-filter-dialog"
        aria-labelledby="filter-dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          closeDrawer();
        }}
        onClose={() => setDrawerOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDrawer();
        }}
      >
        <div className="catalog-drawer-interior">
          <div className="catalog-drawer-heading">
            <h2 id="filter-dialog-title" className="section-title">
              Find your favorites
            </h2>
            <button
              className="icon-button"
              type="button"
              onClick={closeDrawer}
              aria-label="Close filters"
              autoFocus
            >
              <X size={22} />
            </button>
          </div>
          <div className="catalog-drawer-filters">
            {renderFilters("mobile")}
          </div>
          <div className="catalog-drawer-footer">
            <button type="button" className="button" onClick={closeDrawer}>
              Show {filtered.length}{" "}
              {filtered.length === 1 ? "product" : "products"}{" "}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </dialog>
    </main>
  );
}
