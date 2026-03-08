import { Link } from "react-router-dom";
import logo from "@/assets/hollowdex-logo.webp";

const DISCORD_URL = "https://discord.gg/EpbDFKjXz4";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Logo & Description */}
          <div className="flex flex-col gap-3 md:gap-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 md:gap-3">
              <img src={logo} alt="HollowDex" className="h-7 md:h-8 w-auto" />
              <span className="font-semibold text-lg md:text-xl text-foreground">HollowDex</span>
            </div>
            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
              A Hollow Knight inspired Discord bot where you hunt, collect, and catalog
              illustrated enemy creatures.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3 md:gap-4">
            <h4 className="font-semibold text-base md:text-lg text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-1.5 md:gap-2">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-xs md:text-sm">
                Home
              </Link>
              <Link to="/commands" className="text-muted-foreground hover:text-foreground transition-colors text-xs md:text-sm">
                Commands
              </Link>
            </div>
          </div>

          {/* Community */}
          <div className="flex flex-col gap-3 md:gap-4">
            <h4 className="font-semibold text-base md:text-lg text-foreground">Community</h4>
            <div className="flex flex-col gap-1.5 md:gap-2">
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors text-xs md:text-sm"
              >
                Discord Server
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3 md:gap-4">
            <h4 className="font-semibold text-base md:text-lg text-foreground">Legal</h4>
            <div className="flex flex-col gap-1.5 md:gap-2">
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors text-xs md:text-sm">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors text-xs md:text-sm">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-border/30">
          <p className="text-center text-muted-foreground/70 text-[10px] md:text-xs">
            This bot is a fan-made project and is not affiliated with or endorsed by Team Cherry.
          </p>
          <p className="text-center text-muted-foreground/50 text-[10px] md:text-xs mt-2">
            © {new Date().getFullYear()} HollowDex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
