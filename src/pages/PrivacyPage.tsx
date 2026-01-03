import { usePageTitle } from "@/hooks/usePageTitle";

const PrivacyPage = () => {
  usePageTitle('Privacy Policy');

  return (
    <main className="pt-28 md:pt-32 pb-12 md:pb-16 animate-page-in">
      <div className="container mx-auto px-8 sm:px-12 md:px-16 lg:px-24 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 md:mb-8">
          Privacy Policy
        </h1>
        
        <div className="prose prose-invert max-w-none space-y-4 md:space-y-6">
          <section>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">1. Information We Collect</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              HollowDex collects and stores Discord user IDs, server IDs, and game-related data such as your collection, statistics, and preferences. We do not collect personal information beyond what Discord provides.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">2. How We Use Your Data</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Your data is used solely to provide the HollowDex service, including tracking your enemy collection, game progress, and enabling features like leaderboards and trading.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">3. Data Storage & Security</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              We store your data securely and take reasonable measures to protect it. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">4. Data Sharing</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              We do not sell, trade, or share your personal data with third parties. Data may be shared only if required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">5. Data Deletion</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              You may request deletion of your data by contacting us through our Discord server. Upon request, we will remove your data from our systems.
            </p>
          </section>

          <section>
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">6. Changes to This Policy</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              We may update this privacy policy from time to time. Changes will be posted on this page with an updated effective date.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPage;
