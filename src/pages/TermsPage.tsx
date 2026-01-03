import { usePageTitle } from "@/hooks/usePageTitle";

const TermsPage = () => {
  usePageTitle('Terms of Service');

  return (
    <main className="pt-28 md:pt-32 pb-12 md:pb-16 animate-page-in">
      <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-24 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 md:mb-8">
          Terms of Service
        </h1>
        
        <div className="prose prose-invert max-w-none space-y-4 md:space-y-6">
          <section>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              By using HollowDex, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the bot.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">2. Description of Service</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              HollowDex is a Discord bot that allows users to hunt, collect, and catalog illustrated enemy creatures inspired by Hollow Knight. The service is provided "as is" and may be modified or discontinued at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">3. User Conduct</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Users agree not to abuse, exploit, or use the bot in any way that violates Discord's Terms of Service or Community Guidelines. Any form of cheating, automation, or exploitation is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">4. Intellectual Property</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              HollowDex is a fan-made project and is not affiliated with or endorsed by Team Cherry. All Hollow Knight related content belongs to Team Cherry. Original artwork and bot functionality are property of the HollowDex team.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">5. Limitation of Liability</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              HollowDex and its developers are not liable for any damages arising from the use of the bot. We reserve the right to terminate access to users who violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">6. Changes to Terms</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              We may update these terms at any time. Continued use of HollowDex after changes constitutes acceptance of the new terms.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default TermsPage;
