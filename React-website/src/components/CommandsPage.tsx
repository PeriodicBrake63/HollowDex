import { useState, useMemo, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import commandsData from "@/data/commands.json";
import { usePageTitle } from "@/hooks/usePageTitle";

const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

const CommandCard = ({ cmd, index }: { cmd: { name: string; description: string }; index: number }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${index * 50}ms` }}
      className={`relative rounded-2xl bg-secondary/50 border border-border/50 p-4 md:p-5 transition-all duration-300 ${
        isVisible ? 'animate-slide-in-up' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col gap-2 font-sans">
        <code className="text-sm md:text-base font-semibold text-white">/{cmd.name}</code>
        <p className="mt-1 text-sm md:text-base text-white/90 leading-relaxed">{cmd.description}</p>
      </div>
    </div>
  );
};

const CommandsPage = () => {
  usePageTitle("Commands");

  const [searchQuery, setSearchQuery] = useState("");
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => setHeaderVisible(true), []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return commandsData.categories;

    return commandsData.categories
      .map(cat => ({
        ...cat,
        commands: cat.commands.filter(
          cmd =>
            cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cmd.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter(cat => cat.commands.length > 0);
  }, [searchQuery]);

  const totalFiltered = filteredCategories.reduce(
    (acc, cat) => acc + cat.commands.length,
    0
  );

  return (
    <main className="min-h-screen text-white animate-page-in bg-background">
      <div className="pt-20 md:pt-32 pb-12 md:pb-16">
        {/* Header */}
        <div 
          ref={headerRef}
          className={`container mx-auto px-6 md:px-12 lg:px-20 text-center mb-6 md:mb-10 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold mb-2 md:mb-4">
            Commands
          </h1>
        </div>

        {/* Search */}
        <div className="container mx-auto mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            {/* Search Icon */}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white z-10 pointer-events-none" />
            <input
              type="text"
              placeholder={`Search through our ${commandsData.totalCommands} commands`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-3xl border border-white/30 bg-secondary/50 backdrop-blur-md pl-10 pr-4 py-3 text-sm md:text-base placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/50"
            />
          </div>
        </div>

        {/* Commands grid */}
        <div className="container mx-auto px-4 md:px-12 lg:px-20 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.flatMap((cat, catIndex) =>
            cat.commands.map((cmd, cmdIndex) => (
              <CommandCard
                key={`${cat.name}-${cmd.name}`}
                cmd={{ name: cmd.name, description: cmd.description }}
                index={catIndex * 10 + cmdIndex}
              />
            ))
          )}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12 md:py-16 col-span-full animate-fade-in">
              <p className="text-sm md:text-lg text-white/70">
                No commands found for "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default CommandsPage;
