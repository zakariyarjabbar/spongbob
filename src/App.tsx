import { useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { Check, ShoppingBag } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import {
  About,
  Account,
  Characters,
  Collections,
  NotFound,
} from "./pages/Explore";
import { useStore } from "./state/Store";
function PageEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView(),
      );
    } else window.scrollTo(0, 0);
    const names: Record<string, string> = {
      "/": "Good Vibes from Bikini Bottom",
      "/shop": "All things SpongeBob",
      "/cart": "Your shopping bag",
      "/checkout": "Demo checkout",
      "/collections": "The collections",
      "/characters": "Meet the crew",
      "/about": "Our story",
      "/account": "Your corner of the ocean",
    };
    document.title = `${names[pathname] || "A little Bikini Bottom"} — Sponge World`;
  }, [pathname, hash]);
  return null;
}
export default function App() {
  const { toast } = useStore();
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
          document.getElementById("main-content")?.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <PageEffects />
      <Header />
      <div id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<Confirmation />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/about" element={<About />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
      {toast && (
        <div className="toast" role="status">
          <span>
            <Check size={19} />
          </span>
          <p>{toast}</p>
          <Link to="/cart" aria-label="View shopping bag">
            <ShoppingBag size={19} />
          </Link>
        </div>
      )}
    </>
  );
}
