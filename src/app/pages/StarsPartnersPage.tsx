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
      name: "Guest Star Visits",
      achievement: "Nigerian Football Legend",
      quote: "Pegasus is doing great work in developing young talent in Lagos. Keep up the excellent work!",
      image: placeholderPhotoUrl,
      visitDate: "2024",
    },
  ];

  const starItems = starsData.length
    ? starsData.map((s) => ({
        name: s.name,
        achievement: s.achievement,
        quote: s.quote,
        image: s.image.url,
        visitDate: s.visitDate,
      }))
    : stars;

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
            {(partnersData.length
              ? partnersData
              : [
                  {
                    name: "Local Schools",
                    tier: "community",
                    descriptionHtml:
                      "Partnerships with schools in Badore, Ajah, and Lekki for talent identification",
                    logo: { url: "", alt: "Local Schools", caption: "" },
                    websiteUrl: "",
                    order: 10,
                  },
                  {
                    name: "Sports Equipment Providers",
                    tier: "community",
                    descriptionHtml: "Quality training equipment and gear for our players",
                    logo: { url: "", alt: "Equipment Providers", caption: "" },
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
                ]
            ).map((partner: any, index: number) => (
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

      {/* Become a Sponsor */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
            >
              <Handshake className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Become a Sponsor</h2>
              <p className="text-xl mb-8 text-white/90">
                Partner with Pegasus Football Academy to invest in the future of Nigerian football.
                Your support helps us provide quality training, equipment, and opportunities to young
                athletes in Badore and beyond.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 mb-10">
                {[
                  { label: "Kit Sponsorship", benefit: "Branding on team jerseys" },
                  { label: "Equipment Support", benefit: "Logo on training gear" },
                  { label: "Tournament Sponsor", benefit: "Event naming rights" },
                ].map((option, index) => (
                  <Card key={index} className="p-6 bg-white/10 text-white border-white/20">
                    <h3 className="font-bold mb-2">{option.label}</h3>
                    <p className="text-sm text-white/80">{option.benefit}</p>
                  </Card>
                ))}
              </div>
              <div className="space-y-4">
                <p className="text-lg">
                  <strong>Contact us:</strong> pegasusfcacademy@gmail.com | +234-9034-6304-07
                </p>
                <a
                  href="mailto:pegasusfcacademy@gmail.com?subject=Sponsorship%20Inquiry"
                  className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
                >
                  Request Sponsorship Package
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
