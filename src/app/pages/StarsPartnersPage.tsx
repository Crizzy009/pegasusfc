import { Card } from "../components/ui/card";
import { Star, Handshake, Award } from "lucide-react";
import { motion } from "motion/react";
import { usePublicContent } from "../content/useContent";
import type { Partner as PartnerType, Star as StarType } from "../content/types";

export function StarsPartnersPage() {
  const { data: starsData } = usePublicContent<StarType>("star");
  const { data: partnersData } = usePublicContent<PartnerType>("partner");
  const placeholderPhotoUrl = `${import.meta.env.BASE_URL}placeholders/photo.svg`;

  const stars = [
    {
      name: "Ogenyi Onazi",
      achievement: "Super Eagle's Midfielder",
      quote: "The future of Nigerian football is bright with academies like Pegasus. It was great to see such passion and discipline from the young players.",
      image: `${import.meta.env.BASE_URL}pegasus archive/ogeneyi.jpeg`,
      visitDate: "2025",
    },
    {
      name: "Osinachi Ohale",
      achievement: "Super Falcon Defender",
      quote: "It was a pleasure visiting Pegasus Academy. The energy and potential of these young athletes are truly inspiring!",
      image: `${import.meta.env.BASE_URL}placeholders/pegasus archive/WhatsApp Image 2026-03-24 at 10.13.39 AM.jpeg`,
      visitDate: "March 2026",
    },
  ];

  const starItems = (
    starsData.length > 0 && starsData.some((s) => s.name === "Ogenyi Onazi")
      ? starsData.map((s) => ({
          name: s.name,
          achievement: s.achievement,
          quote: s.quote,
          image: s.image.url,
          visitDate: s.visitDate,
        }))
      : stars
  );

  const partners = [
    {
      name: "The Rising Stars Project",
      tier: "global",
      descriptionHtml:
        "A US-based NGO dedicated to developing young talents and uplifting grassroots football. Officially launched with Pegasus in 2025.",
      logo: {
        url: `${import.meta.env.BASE_URL}pegasus archive/rising stars project .jpeg`,
        alt: "The Rising Stars Project",
        caption: "",
      },
      websiteUrl: "",
      order: 5,
    },
    {
      name: "Peninsula Youth Football League",
      tier: "community",
      descriptionHtml: "Official league participation and competition partner",
      logo: { url: "", alt: "Peninsula Youth Football League", caption: "" },
      websiteUrl: "",
      order: 10,
    },
    {
      name: "Local Schools",
      tier: "community",
      descriptionHtml: "Partnerships with schools in Badore, Ajah, and Lekki for talent identification",
      logo: { url: "", alt: "Local Schools", caption: "" },
      websiteUrl: "",
      order: 20,
    },
    {
      name: "Medical Partners",
      tier: "community",
      descriptionHtml: "Healthcare support and fitness assessments for player safety",
      logo: { url: "", alt: "Medical Partners", caption: "" },
      websiteUrl: "",
      order: 30,
    },
  ];

  const partnerItems =
    partnersData.length > 0 && partnersData.some((p) => p.name === "The Rising Stars Project")
      ? partnersData
      : partners;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${import.meta.env.BASE_URL}hero-bg.PNG')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Star className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Stars & Partners</h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Working together to develop the next generation of football talent
            </p>
          </motion.div>
        </div>
      </section>

      {/* Football Stars */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
              Nigerian Football Stars
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional players who have visited and supported our academy
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            {starItems.map((star, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <Card className="overflow-hidden shadow-xl">
                  <div className="grid md:grid-cols-5 gap-8 p-8">
                    <div className="md:col-span-2">
                      <img
                        src={star.image}
                        alt={star.name}
                        className="rounded-lg w-full aspect-square object-cover"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-6 h-6 text-primary" />
                        <span className="text-sm font-semibold text-primary uppercase">
                          {star.achievement}
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold mb-4 text-secondary">{star.name}</h3>
                      <blockquote className="text-lg text-gray-700 italic mb-6 border-l-4 border-primary pl-6">
                        "{star.quote}"
                      </blockquote>
                      <div className="text-sm text-gray-600">
                        <strong>Visit Date:</strong> {star.visitDate}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Card className="max-w-2xl mx-auto p-8 bg-muted">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-secondary">Special Coaching Clinics</h3>
              <p className="text-gray-700">
                We regularly host special training sessions with professional players and coaches to
                inspire and develop our young athletes. Follow our social media for announcements!
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Partners */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
              Community Partners
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Organizations supporting our mission
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {partnerItems.map((partner: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 text-center h-full shadow-lg hover:shadow-xl transition-shadow">
                  {partner.logo?.url ? (
                    <img
                      src={partner.logo.url}
                      alt={partner.logo.alt || partner.name}
                      className="h-14 w-auto mx-auto mb-4 object-contain"
                    />
                  ) : (
                    <div className="text-5xl mb-4">🤝</div>
                  )}
                  <h3 className="text-xl font-bold mb-3 text-secondary">{partner.name}</h3>
                  <div
                    className="text-gray-600 text-sm"
                    dangerouslySetInnerHTML={{ __html: partner.descriptionHtml }}
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
