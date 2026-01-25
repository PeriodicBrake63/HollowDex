import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "@/assets/hollowdex-logo.webp";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

const DISCORD_OAUTH_URL = "https://discord.com/oauth2/authorize?client_id=1455565970784518278&permissions=5086480645868608&integration_type=0&scope=bot+applications.commands";
const VOTE_URL = "https://top.gg/bot/hollowdex/vote";
const DISCORD_URL = "https://discord.gg/EpbDFKjXz4";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar if scrolling up or at the top
      if (currentScrollY < 10 || currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 10) {
        // Hide navbar if scrolling down and not at the top
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { label: "Home", to: "/", external: false },
    { label: "Commands", to: "/commands", external: false },
    { label: "Vote", to: VOTE_URL, external: true },
    { label: "Add to Discord", to: DISCORD_OAUTH_URL, external: true },
    { label: "Support Server", to: DISCORD_URL, external: true },
  ];

  return (
    <header
      className={cn(
        "fixed top-4 left-1/2 z-50 w-[calc(100%-32px)] md:w-[calc(100%-48px)] max-w-7xl -translate-x-1/2 px-3 md:px-4 transition-all duration-300 ease-in-out transform",
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-[150%] opacity-0 pointer-events-none"
      )}
    >
      <nav className="flex items-center justify-between gap-4 md:gap-6 rounded-2xl border border-border/50 bg-card/90 backdrop-blur-xl px-4 md:px-6 py-2.5 md:py-3 shadow-sm">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="HollowDex" className="h-6 md:h-8 w-auto" />
          <span className="font-semibold text-sm md:text-base tracking-wide">HollowDex</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.to}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
          <div className="pl-2 border-l border-border/50">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button & Theme Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-2 rounded-2xl border border-border/50 bg-card/90 backdrop-blur-xl p-3 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors py-2.5 px-4 rounded-xl text-center"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors py-2.5 px-4 rounded-xl text-center"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
