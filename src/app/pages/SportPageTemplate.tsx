import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";
import { useMemo } from "react";
import { usePublicContent } from "../content/useContent";
import type { SportGalleryPhoto, SportKey, SportPage } from "../content/types";

type Props = {
  sport: SportKey;
  defaultHeroTitle: string;
};

const sportLabel: Record<SportKey, string> = {
  football: "Football",
  basketball: "Basketball",
  tennis: "Lawn Tennis",
  swimming: "Swimming",
};

export function SportPageTemplate({ sport, defaultHeroTitle }: Props) {
  const { data: pages } = usePublicContent<SportPage>("sportPage");
  const { data: photos } = usePublicContent<SportGalleryPhoto>("sportGalleryPhoto");

  const page = useMemo(() => {
    const candidates = pages.filter((p) => p.sport === sport);
    if (candidates.length === 0) return null;
    return [...candidates].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0] ?? null;
  }, [pages, sport]);

  const gallery = useMemo(() => {
    return [...photos]
      .filter((p) => p.sport === sport)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .slice(0, 12);
  }, [photos, sport]);

  const heroTitle = page?.heroTitle?.trim() ? page.heroTitle : defaultHeroTitle;
  const heroSubtitle = page?.heroSubtitle?.trim() ? page.heroSubtitle : `${sportLabel[sport]} at Pegasus Sports Academy`;
  const heroBg = page?.heroImage?.url?.trim()
    ? `url('${page.heroImage.url}')`
    : `url('${import.meta.env.BASE_URL}hero-bg.PNG')`;

  const ctaHref = page?.ctaHref?.trim() ? page.ctaHref : "/contact";
  const ctaLabel = page?.ctaLabel?.trim() ? page.ctaLabel : "Contact Us";
  const galleryTitle = page?.galleryTitle?.trim() ? page.galleryTitle : "Gallery";

  return (
    <div>
      <section className="relative py-20 md:py-32 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: heroBg }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
            <div className="text-sm uppercase tracking-wide text-primary font-semibold mb-3">{sportLabel[sport]}</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{heroTitle}</h1>
            <p className="text-xl md:text-2xl text-gray-200">{heroSubtitle}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/programs">
                <Button className="bg-primary hover:bg-primary/90">Explore Football Programs</Button>
              </Link>
              <Link to={ctaHref}>
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-secondary">
                  {ctaLabel}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <div className="text-sm uppercase tracking-wide text-primary font-semibold mb-2">About</div>
              <h2 className="text-4xl font-bold text-secondary mb-4">Overview</h2>
              {page?.overviewHtml?.trim() ? (
                <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: page.overviewHtml }} />
              ) : (
                <div className="text-gray-600">
                  Pegasus Sports Academy is bringing to you our {sportLabel[sport]} section. This will be coming soon to
                  Pegasus. Please{" "}
                  <Link to="/contact" className="text-primary font-semibold underline">
                    contact us
                  </Link>{" "}
                  for early registration.
                </div>
              )}
            </div>
            <Card className="p-8 shadow-lg">
              <div className="text-sm uppercase tracking-wide text-primary font-semibold mb-2">Training</div>
              <h3 className="text-2xl font-bold text-secondary mb-4">Sessions & Development</h3>
              {page?.trainingHtml?.trim() ? (
                <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: page.trainingHtml }} />
              ) : (
                <div className="text-gray-600">Training information will appear here once it is added by an administrator.</div>
              )}
              <div className="mt-6">
                <Link to="/recruitment">
                  <Button className="bg-primary hover:bg-primary/90 w-full">Book a Trial</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-sm uppercase tracking-wide text-primary font-semibold mb-2">{sportLabel[sport]}</div>
            <h2 className="text-4xl font-bold text-secondary">{galleryTitle}</h2>
          </div>
          {gallery.length === 0 ? (
            <div className="text-center py-12 text-gray-600">No photos yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {gallery.map((p, index) => {
                const src = p.image.mediumUrl || p.image.largeUrl || p.image.originalUrl;
                return (
                  <motion.div
                    key={`${p.title}-${index}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                      <div className="aspect-video overflow-hidden">
                        <img src={src} alt={p.title} className="w-full h-full object-cover transition-transform hover:scale-110 duration-500" />
                      </div>
                      <div className="p-5">
                        <div className="text-xs font-semibold text-primary uppercase mb-1">{p.category}</div>
                        <div className="font-bold text-secondary">{p.title}</div>
                        {p.caption?.trim() ? <div className="text-sm text-gray-600 mt-2 line-clamp-2">{p.caption}</div> : null}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
