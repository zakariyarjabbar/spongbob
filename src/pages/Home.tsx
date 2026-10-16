import {
  ArrowRight,
  Heart,
  LockKeyhole,
  PackageCheck,
  Truck,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { products } from "../data/products";
import { ProductCard } from "../components/ProductCard";
import { ProductArt } from "../components/ProductArt";
import { Flower, StarDoodle, Bubbles } from "../components/Decor";
const categories = [
  {
    name: "Apparel",
    description: "Wear your happy place",
    query: "T-Shirts",
    character: "SpongeBob",
    color: "#b6e8f0",
  },
  {
    name: "Plushies",
    description: "Certified cuddle buddies",
    query: "Plushies",
    character: "Patrick",
    color: "#f6b2cf",
  },
  {
    name: "Accessories",
    description: "A little extra personality",
    query: "Accessories",
    character: "Gary",
    color: "#ffe581",
  },
  {
    name: "Collectibles",
    description: "For your inner superfan",
    query: "Collectibles",
    character: "Squidward",
    color: "#a7dbd0",
  },
];
export default function Home() {
  const best = products.filter((p) => p.featured).slice(0, 4);
  const arrivals = products.filter((p) => p.isNew).slice(0, 4);
  return (
    <main className="home">
      <section className="hero">
        <div className="container hero-inner">
          <Bubbles />
          <Flower className="hero-flower-one" color="#23c8e2" />
          <Flower className="hero-flower-two" color="#facb24" />
          <StarDoodle className="hero-star" />
          <div className="hero-copy">
            <h1>
              Cartoons
              <br />
              hit <span>different.</span>
              <svg aria-hidden="true" viewBox="0 0 500 30">
                <path d="M5 20Q230-7 491 10M25 28Q300 6 460 20" />
              </svg>
            </h1>
            <p>
              Your favorite underwater weirdos.
              <br />
              Your new favorite everything.
            </p>
            <Link to="/shop" className="button hero-cta">
              Dive into the shop <ArrowRight size={21} />
            </Link>
            <div className="hero-footnote">
              <Star size={15} fill="#ffdf32" /> A whole ocean of good stuff.
            </div>
          </div>
          <div className="hero-art">
            <img
              src="/assets/hero.png"
              alt="SpongeBob jumping for joy"
              fetchPriority="high"
            />
            <div className="happy-note">
              Just a<br />
              happy
              <br />
              sponge!
              <svg viewBox="0 0 90 48" aria-hidden="true">
                <path d="M7 8Q28 45 70 15m-14-2 17-2-1 16" />
              </svg>
            </div>
            <span className="hero-sparkle">✧</span>
          </div>
        </div>
        <div className="hero-wave" />
      </section>
      <section className="benefits container" aria-label="Shopping benefits">
        <div>
          <PackageCheck />
          <span>
            <strong>Made for the fans</strong>
            <small>Big on character. Bigger on fun.</small>
          </span>
        </div>
        <div>
          <Truck />
          <span>
            <strong>Good stuff, delivered</strong>
            <small>Free shipping on orders $75+</small>
          </span>
        </div>
        <div>
          <LockKeyhole />
          <span>
            <strong>Shop with a smile</strong>
            <small>A safe, easy demo experience</small>
          </span>
        </div>
        <div>
          <Heart />
          <span>
            <strong>One happy community</strong>
            <small>You're one of us now.</small>
          </span>
        </div>
      </section>
      <section className="category-section container">
        <div className="section-heading">
          <h2>Find your kind of happy.</h2>
          <span className="hand-note">
            There's something for every weirdo{" "}
            <svg viewBox="0 0 70 30" aria-hidden="true">
              <path d="M3 4q30 30 57 3m-10-1 14-3-1 13" />
            </svg>
          </span>
        </div>
        <div className="category-grid">
          {categories.map((c, i) => {
            return (
              <Link
                key={c.name}
                to={
                  i === 0
                    ? "/shop?category=T-Shirts&category=Hoodies&category=Hats"
                    : i === 2
                      ? "/shop?category=Accessories&category=Hats"
                      : `/shop?category=${encodeURIComponent(c.query)}`
                }
                className={`category-tile category-${i}`}
                style={{ "--category-color": c.color } as React.CSSProperties}
              >
                <div className="category-image">
                  <Flower color={i === 1 ? "#eb6d99" : "#fff9da"} />
                  <StarDoodle color={i === 2 ? "#ec79ab" : "#2786bb"} />
                  <img
                    className="category-character"
                    src={
                      i === 0
                        ? "/assets/hero.png"
                        : `/assets/characters/${["spongebob", "patrick", "gary", "squidward"][i]}.png`
                    }
                    alt={c.character}
                    loading="lazy"
                  />
                </div>
                <div className="category-label">
                  <div>
                    <h3>{c.name}</h3>
                    <p>{c.description}</p>
                  </div>
                  <ArrowRight size={25} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="collection-banner container">
        <div className="collection-content">
          <h2>
            Bikini Bottom vibes.
            <br />
            <span>Above-sea-level style.</span>
          </h2>
          <p>A little nautical nonsense for your everyday.</p>
          <Link className="button pink-button" to="/collections">
            Explore the collection <ArrowRight size={19} />
          </Link>
        </div>
        <img
          src="/assets/hero.png"
          className="collection-art"
          alt="SpongeBob celebrating in the ocean"
          loading="lazy"
        />
        <Flower className="collection-flower" color="#ff75b7" />
        <Flower className="collection-flower-two" color="#d8f956" />
        <div className="sea-floor" aria-hidden="true" />
      </section>
      <section className="products-section container">
        <div className="section-heading">
          <div>
            <h2>The fan favorites.</h2>
            <p>Good taste. Great characters. No bad days.</p>
          </div>
          <Link className="text-link" to="/shop">
            Shop all the good stuff <ArrowRight size={18} />
          </Link>
        </div>
        <div className="home-products">
          {best.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="crew-section">
        <div className="container">
          <Flower color="#ef98c2" className="crew-flower" />
          <div className="section-heading">
            <div>
              <h2>Your people. But, you know, sponges.</h2>
              <p>Pick your favorite Bikini Bottom resident.</p>
            </div>
            <Link className="text-link" to="/characters">
              Meet the whole crew <ArrowRight size={18} />
            </Link>
          </div>
          <div className="crew-grid">
            {[
              "SpongeBob",
              "Patrick",
              "Squidward",
              "Gary",
              "Sandy",
              "Plankton",
              "Mr. Krabs",
            ].map((name, i) => {
              const p =
                products.find((p) => p.character === name) || products[i];
              return (
                <Link
                  className={`crew-member crew-${i}`}
                  key={name}
                  to={`/shop?character=${encodeURIComponent(name)}`}
                >
                  <span className="crew-image">
                    {["SpongeBob", "Patrick", "Squidward", "Gary"].includes(
                      name,
                    ) ? (
                      <img
                        src={
                          name === "SpongeBob"
                            ? "/assets/hero.png"
                            : `/assets/characters/${name.toLowerCase()}.png`
                        }
                        alt={name}
                        loading="lazy"
                      />
                    ) : (
                      <ProductArt product={p} />
                    )}
                  </span>
                  <span>{name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      <section className="products-section container">
        <div className="section-heading">
          <div>
            <h2>Fresh out of the ocean.</h2>
            <p>New arrivals. Same beautifully silly energy.</p>
          </div>
          <Link className="text-link" to="/shop?sort=newest">
            See what's new <ArrowRight size={18} />
          </Link>
        </div>
        <div className="home-products">
          {(arrivals.length ? arrivals : products.slice(-4)).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="closing-note container">
        <Flower color="#39b7d3" />
        <p>
          Who lives in a pineapple under the sea?
          <br />
          <strong>Your next favorite thing, probably.</strong>
        </p>
        <StarDoodle color="#ee91b8" />
      </section>
    </main>
  );
}
