import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
  Waves,
} from "lucide-react";
import { useStore } from "../state/Store";
export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Sponge World home">
      <span>SPONGE</span>
      <span>WORLD</span>
    </Link>
  );
}
export default function Header() {
  const { count, wishlist } = useStore();
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setMobile(false);
    setSearch(false);
  }, [location]);
  useEffect(() => {
    if (search) input.current?.focus();
  }, [search]);
  useEffect(() => {
    if (!mobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      document
        .querySelector<HTMLButtonElement>(".mobile-toggle")
        ?.focus({ preventScroll: true });
    };
  }, [mobile]);
  useEffect(() => {
    if (!mobile && !search) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobile(false);
        setSearch(false);
      }
      if (e.key === "Tab" && mobile) {
        const els =
          menuRef.current?.querySelectorAll<HTMLElement>("a,button,input");
        if (!els?.length) return;
        const first = els[0],
          last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handle);
    if (mobile) menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", handle);
  }, [mobile, search]);
  const links = [
    ["Home", "/"],
    ["Shop", "/shop"],
    ["Collections", "/collections"],
    ["Characters", "/characters"],
    ["Our story", "/about"],
  ];
  return (
    <>
      <div className="announcement">
        <Waves size={15} />
        <span>A little Bikini Bottom. A lot of personality.</span>
        <span className="announcement-divider">✦</span>
        <span className="announcement-shipping">
          Free shipping on orders $75+
        </span>
      </div>
      <header className="header">
        <div className="container header-inner">
          <button
            className="icon-button mobile-toggle"
            aria-label={mobile ? "Close navigation" : "Open navigation"}
            aria-expanded={mobile}
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? <X /> : <Menu />}
          </button>
          <Logo />
          <nav aria-label="Main navigation" className="desktop-nav">
            {links.map(([name, path]) => (
              <NavLink key={path} to={path} end={path === "/"}>
                {name}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-button"
              aria-label="Search products"
              aria-expanded={search}
              onClick={() => setSearch(!search)}
            >
              {search ? <X /> : <Search />}
            </button>
            <Link
              className="icon-button wishlist-header"
              to="/shop?wishlist=true"
              aria-label={`Wishlist, ${wishlist.length} items`}
            >
              <Heart />
              {wishlist.length > 0 && <span className="small-dot" />}
            </Link>
            <Link
              className="icon-button account-header"
              to="/account"
              aria-label="Your account"
            >
              <UserRound />
            </Link>
            <Link
              className="icon-button cart-header"
              to="/cart"
              aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`}
            >
              <ShoppingBag />
              <span className="cart-count" aria-hidden="true">
                {count > 99 ? "99+" : count}
              </span>
            </Link>
          </div>
        </div>
        {search && (
          <form
            className="header-search container"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
            }}
          >
            <Search size={20} />
            <input
              ref={input}
              aria-label="Search the store"
              placeholder="Find your next favorite thing…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="button small">
              Search <ArrowRight size={16} />
            </button>
          </form>
        )}
      </header>
      {mobile && (
        <>
          <button
            className="menu-scrim"
            onClick={() => setMobile(false)}
            aria-label="Close navigation"
          />
          <div
            className="mobile-nav"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
          >
            <button
              className="icon-button menu-close"
              onClick={() => setMobile(false)}
              aria-label="Close navigation"
            >
              <X />
            </button>
            {links.map(([name, path]) => (
              <NavLink key={path} to={path}>
                {name}
                <ArrowRight size={20} />
              </NavLink>
            ))}
            <Link to="/account">
              Your account <UserRound size={20} />
            </Link>
            <Link to="/shop?wishlist=true">
              Your favorites <Heart size={20} />
            </Link>
            <p>Good things come from under the sea.</p>
          </div>
        </>
      )}
    </>
  );
}
