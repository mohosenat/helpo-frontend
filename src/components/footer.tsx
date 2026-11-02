import Link from "next/link";
import { HeartHandshake, Instagram, Facebook, Twitter } from "lucide-react";
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <Link className="brand" href="/">
            <span className="brand-icon">
              <HeartHandshake />
            </span>
            helpo<span className="brand-dot">.</span>
          </Link>
          <p>
            Helping Hands, Stronger Communities.
            <br />
            Small actions. Meaningful impact.
          </p>
        </div>
        <div>
          <b>Explore</b>
          <Link href="/events">Upcoming events</Link>
          <Link href="/dashboard/create">Create an event</Link>
        </div>
        <div>
          <b>Community</b>
          <a href="mailto:hello@helpo.org">Contact us</a>
          <a href="/">About Helpo</a>
        </div>
        <div>
          <b>Follow our impact</b>
          <div className="socials">
            <a href="#" aria-label="Instagram">
              <Instagram />
            </a>
            <a href="#" aria-label="Facebook">
              <Facebook />
            </a>
            <a href="#" aria-label="X">
              <Twitter />
            </a>
          </div>
        </div>
      </div>
      <div className="copyright">
        © {new Date().getFullYear()} Helpo. Made for people who care.
      </div>
    </footer>
  );
}
