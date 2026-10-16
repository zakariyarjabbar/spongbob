import { Link } from "react-router-dom";
import { ArrowRight, Heart, Package, Waves } from "lucide-react";
import { products, formatPrice } from "../data/products";
import { ProductArt } from "../components/ProductArt";
import { Flower } from "../components/Decor";
import { useStore } from "../state/Store";
export function Collections() {
  const collections = [
    {
      title: "Bikini Bottom essentials",
      text: "Everyday favorites with an undersea twist.",
      link: "/shop?character=SpongeBob",
      character: "SpongeBob",
      color: "#ffe883",
    },
    {
      title: "The cozy crew",
      text: "Soft spots for your favorite characters.",
      link: "/shop?category=Plushies",
      character: "Gary",
      color: "#c0e7db",
    },
    {
      title: "Pretty in Patrick",
      text: "A little pink. A whole lot of personality.",
      link: "/shop?character=Patrick",
      character: "Patrick",
      color: "#f4bfd3",
    },
    {
      title: "Home, sweet pineapple",
      text: "Make your own little happy place.",
      link: "/shop?category=Home%20%26%20Living",
      character: "SpongeBob",
      color: "#bde6f1",
    },
  ];
  return (
    <main className="container explore-page">
      <div className="explore-heading">
        <h1 className="page-title">Good things come in collections.</h1>
        <p>A little nautical nonsense, curated just for you.</p>
        <Flower color="#e891b3" />
      </div>
      <div className="collection-grid">
        {collections.map((c) => (
          <Link
            key={c.title}
            className="collection-card"
            to={c.link}
            style={{ background: c.color }}
          >
            <div>
              <h2>{c.title}</h2>
              <p>{c.text}</p>
              <span className="text-link">
                Dive in <ArrowRight size={19} />
              </span>
            </div>
            <ProductArt
              product={
                products.find((p) => p.character === c.character) || products[0]
              }
            />
            <Flower color="#fffdf1" />
          </Link>
        ))}
      </div>
    </main>
  );
}
export function Characters() {
  return (
    <main className="container explore-page">
      <div className="explore-heading">
        <h1 className="page-title">Meet your underwater weirdos.</h1>
        <p>Seven personalities. One very happy neighborhood.</p>
        <Flower color="#ef91bc" />
      </div>
      <div className="character-page-grid">
        {[
          "SpongeBob",
          "Patrick",
          "Squidward",
          "Mr. Krabs",
          "Sandy",
          "Plankton",
          "Gary",
        ].map((name, i) => (
          <Link
            to={`/shop?character=${encodeURIComponent(name)}`}
            key={name}
            style={{
              background: [
                "#ffe883",
                "#f6bdd2",
                "#b9e2dc",
                "#e6c7b3",
                "#c1e5f2",
                "#cbdc9e",
                "#e2c5e9",
              ][i],
            }}
          >
            <ProductArt
              product={
                products.find((p) => p.character === name) || products[i]
              }
            />
            <h2>{name}</h2>
            <span>
              Shop the character <ArrowRight size={17} />
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
export function About() {
  return (
    <main className="container about-page">
      <section className="about-hero">
        <div>
          <h1 className="page-title">
            For the love
            <br />
            of a little nonsense.
          </h1>
          <p>
            Some things never get old. Like your favorite cartoon, a perfectly
            timed Patrick quote, or that feeling of coming home to Bikini
            Bottom.
          </p>
          <p>
            Sponge World brings that feeling to a playful shopping demo, filled
            with things that make an ordinary day a little more fun.
          </p>
          <Link to="/shop" className="button">
            Find your happy thing <ArrowRight size={18} />
          </Link>
        </div>
        <img src="/assets/hero.png" alt="SpongeBob celebrating" />
        <Flower color="#2bc1de" />
      </section>
      <section className="about-info" id="shipping">
        <h2>Good to know before you dive in.</h2>
        <p>
          This is an independent fan-made portfolio demo. Sponge World is not
          affiliated with, endorsed by, or licensed by Nickelodeon, Paramount,
          or the SpongeBob franchise. Character artwork and merchandise
          photography are temporary demonstration assets.
        </p>
        <h3>Shipping & returns</h3>
        <p>
          For this demo, standard shipping is $5, or free on orders of $75 or
          more. Express shipping is $12. No physical goods are sold or shipped,
          and no payments are collected. A live store would need confirmed
          inventory, a fulfillment service, and a published returns policy.
        </p>
      </section>
      <section className="about-info" id="faq">
        <h2>A few perfectly reasonable questions.</h2>
        <details>
          <summary>Can I place a real order?</summary>
          <p>
            You can complete the full demo checkout. It creates an order in this
            browser, with the items and shipping information you entered. It
            does not charge you or send an order to a merchant.
          </p>
        </details>
        <details>
          <summary>Where are my cart and orders saved?</summary>
          <p>
            Your browser stores your cart, favorites and demo orders on this
            device. Clearing browser storage removes them. Use fictional
            shipping details when trying the demo.
          </p>
        </details>
        <details>
          <summary>Are the items officially licensed?</summary>
          <p>
            This demo makes no licensing claim. Product photos are sourced for
            visual demonstration. A commercial launch requires appropriate
            merchandise rights and authorization to use the character artwork.
          </p>
        </details>
      </section>
      <section className="about-info" id="contact">
        <h2>Still have a question?</h2>
        <p>
          This preview has no connected support inbox. For this build, share
          your feedback in the chat where you opened Sponge World.
        </p>
        <Link className="text-link" to="/shop">
          Back to the good stuff <ArrowRight size={17} />
        </Link>
      </section>
    </main>
  );
}
export function Account() {
  const { orders, wishlist } = useStore();
  return (
    <main className="container account-page">
      <div className="explore-heading">
        <h1 className="page-title">Your little corner of the ocean.</h1>
        <p>
          Your demo orders and favorites, saved in this browser. No sign-in
          needed.
        </p>
      </div>
      <div className="account-columns">
        <section>
          <h2>Your demo orders</h2>
          {orders.length ? (
            orders.map((order) => (
              <Link
                to={`/order/${order.id}`}
                className="account-order"
                key={order.id}
              >
                <Package />
                <div>
                  <strong>{order.id}</strong>
                  <small>
                    {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                    {order.items.reduce((a, i) => a + i.quantity, 0)} items ·
                    Demo order created
                  </small>
                </div>
                <b>{formatPrice(order.total)}</b>
                <ArrowRight size={18} />
              </Link>
            ))
          ) : (
            <div className="account-empty">
              <Waves size={54} />
              <h3>No adventures yet.</h3>
              <p>Complete the demo checkout to see your order here.</p>
              <Link className="button" to="/shop">
                Explore the shop <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </section>
        <aside className="account-favorites">
          <Heart size={35} />
          <h2>A soft spot for the good stuff.</h2>
          <p>
            You have {wishlist.length}{" "}
            {wishlist.length === 1 ? "favorite" : "favorites"} waiting for you.
          </p>
          <Link to="/shop?wishlist=true" className="button secondary">
            See your favorites <ArrowRight size={18} />
          </Link>
        </aside>
      </div>
    </main>
  );
}
export function NotFound() {
  return (
    <main className="container not-found">
      <img src="/assets/hero.png" alt="" />
      <h1 className="page-title">A little lost at sea?</h1>
      <p>That page sailed away. There's plenty more good stuff in the shop.</p>
      <Link to="/shop" className="button">
        Back to the shop <ArrowRight size={18} />
      </Link>
    </main>
  );
}
