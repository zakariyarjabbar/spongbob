import { useState } from "react";
import { ArrowRight, Instagram, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "./Header";
import { Flower } from "./Decor";
export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  return (
    <>
      <section className="newsletter">
        <div className="container newsletter-inner">
          <Flower color="#f288ad" />
          <div>
            <h2>You've got a friend in Bikini Bottom.</h2>
            <p>
              A splash of new stuff, good vibes, and the occasional terrible
              pun.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubscribed(true);
            }}
          >
            {subscribed ? (
              <p role="status" className="newsletter-success">
                You're on the list! Demo signup saved for this visit.
              </p>
            ) : (
              <>
                <label className="sr-only" htmlFor="newsletter-email">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email goes here"
                />
                <button type="submit" aria-label="Join the newsletter">
                  <ArrowRight />
                </button>
              </>
            )}
          </form>
        </div>
      </section>
      <footer className="footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <Logo />
            <p>
              Made for the fans.
              <br />
              Straight from our happy place.
            </p>
            <Waves size={38} />
          </div>
          <div>
            <h3>Take a look around</h3>
            <Link to="/shop">Shop everything</Link>
            <Link to="/collections">The collections</Link>
            <Link to="/characters">Meet the crew</Link>
            <Link to="/shop?sort=newest">Fresh out of the ocean</Link>
          </div>
          <div>
            <h3>Here to help</h3>
            <Link to="/about#shipping">Shipping & returns</Link>
            <Link to="/about#faq">Frequently asked questions</Link>
            <Link to="/account">Your orders</Link>
            <Link to="/about#contact">Get in touch</Link>
          </div>
          <div className="footer-last">
            <h3>Stay a little silly.</h3>
            <p>
              Life's better with your favorite
              <br />
              underwater weirdos.
            </p>
            <Link to="/about" className="footer-social">
              <Instagram size={20} /> Get to know Sponge World{" "}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>
            © {new Date().getFullYear()} Sponge World. An independent fan-made
            demo.
          </span>
          <span>
            Not affiliated with Nickelodeon or Paramount. No real purchases.
          </span>
          <div className="payment-logos">
            <b>VISA</b>
            <span className="mastercard">
              <i />
              <i />
            </span>
            <b>PayPal</b>
          </div>
        </div>
      </footer>
    </>
  );
}
