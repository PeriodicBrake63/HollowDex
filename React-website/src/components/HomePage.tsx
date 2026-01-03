import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import heroBackground from "@/assets/hero-background.webp";
import { usePageTitle } from "@/hooks/usePageTitle";

const DISCORD_OAUTH_URL = "https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID";

const useScrollAnimation = (direction: 'left' | 'right' | 'up' = 'up') => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { 
        threshold: 0,
        rootMargin: '0px 0px -100px 0px' // Trigger when bottom of element is 100px from viewport bottom
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const animationClass = isVisible 
    ? direction === 'left' 
      ? 'animate-slide-in-left' 
      : direction === 'right' 
        ? 'animate-slide-in-right' 
        : 'animate-slide-in-up'
    : 'opacity-0';

  return { ref, animationClass, isVisible };
};

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] md:min-h-screen flex items-center overflow-hidden pt-16 md:pt-0">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img
          src={heroBackground}
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-8 sm:px-12 md:px-16 lg:px-24 pt-8 md:pt-24">
        <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left animate-slide-in-up md:animate-slide-in-left">
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-foreground leading-tight mb-3 md:mb-6">
             Hunt, Capture, Dominate
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground mb-4 md:mb-8 max-w-lg mx-auto md:mx-0">
            HollowDex is a Hollow Knight inspired Discord bot where you hunt, collect, and catalog illustrated enemy creatures.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4">
            <a href={DISCORD_OAUTH_URL} target="_blank" rel="noopener noreferrer">
              <Button
                size="default"
                className="!bg-gradient-to-r !from-blue-600 !via-blue-700 !to-indigo-700 text-white hover:opacity-90 transition-all px-3 md:px-6 text-xs md:text-base h-8 md:h-10"
              >
                Add to Discord
              </Button>
            </a>
            <Link to="/commands">
              <Button variant="secondary" size="default" className="text-xs md:text-base px-3 md:px-6 h-8 md:h-10">
                See Commands
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureSectionProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  reversed?: boolean;
}

const FeatureSection = ({ title, description, imageSrc, imageAlt, reversed }: FeatureSectionProps) => {
  const { ref, animationClass } = useScrollAnimation(reversed ? 'right' : 'left');

  return (
    <section className="py-10 md:py-24">
      <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-24">
        <div
          ref={ref}
          className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-6 md:gap-12 lg:gap-20 ${animationClass}`}
        >
          {/* Image */}
          <div className="flex-1 w-full">
            <div className="relative rounded-lg md:rounded-2xl overflow-hidden bg-secondary aspect-video">
              <img
                src={imageSrc}
                alt={imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-foreground mb-2 md:mb-4">
              {title}
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  usePageTitle();

  return (
    <main className="animate-page-in">
      <HeroSection />
      
      <FeatureSection
        title="Hunt & Collect Enemies"
        description="Explore the depths of Hallownest and encounter enemies of varying rarities. From common crawlers to legendary bosses — every hunt is an adventure waiting to happen."
        imageSrc="/placeholder.svg"
        imageAlt="Enemy hunting feature preview"
      />
      
      <FeatureSection
        title="Build Your Collection"
        description="Each enemy features unique hand-drawn artwork with detailed stats and lore. Capture them all and build the ultimate enemy collection to show off to your friends."
        imageSrc="/placeholder.svg"
        imageAlt="Collection feature preview"
        reversed
      />
    </main>
  );
};

export default HomePage;
