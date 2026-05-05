import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter } from "lucide-react";

const FOOTER_LINKS = [
  { label: "About", to: "/" },
  { label: "Contact", to: "/" },
  { label: "Privacy", to: "/" },
  { label: "Terms", to: "/" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer className="bg-card border-t border-border" data-ocid="footer">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-2 max-w-xs">
            <span className="font-display font-bold text-lg text-primary">
              BUZZY BITES
            </span>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Discover, reserve, and savor the finest dining experiences curated
              for the discerning palate.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-smooth"
                data-ocid="footer.instagram_link"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-smooth"
                data-ocid="footer.twitter_link"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-smooth"
                data-ocid="footer.facebook_link"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-body text-muted-foreground hover:text-foreground transition-smooth"
                data-ocid={`footer.${link.label.toLowerCase()}_link`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground font-body">
          <span>
            © {year}. Built with love using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-smooth underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </span>
          <span>Discover · Reserve · Savor</span>
        </div>
      </div>
    </footer>
  );
}
