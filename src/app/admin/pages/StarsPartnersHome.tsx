import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import type { Partner, Star } from "../../content/types";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import { StarsPageAdmin } from "./StarsPage";
import { PartnersPageAdmin } from "./PartnersPage";

export function StarsPartnersHome() {
  const starsCRUD = useAdminCRUD<Star>("star");
  const partnersCRUD = useAdminCRUD<Partner>("partner");

  const [selectedStarId, setSelectedStarId] = useState<string | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [starPrefill, setStarPrefill] = useState<Star | null>(null);
  const [partnerPrefill, setPartnerPrefill] = useState<Partner | null>(null);

  const defaultStars: Star[] = [
    {
      name: "Ogenyi Onazi",
      achievement: "Super Eagle's Midfielder",
      quote: "The future of Nigerian football is bright with academies like Pegasus. It was great to see such passion and discipline from the young players.",
      image: { url: `${import.meta.env.BASE_URL}pegasus archive/ogeneyi.jpeg`, alt: "Ogenyi Onazi" },
      visitDate: "2025",
      order: 1,
    },
    {
      name: "Osinachi Ohale",
      achievement: "Super Falcon Defender",
      quote: "It was a pleasure visiting Pegasus Academy. The energy and potential of these young athletes are truly inspiring!",
      image: { url: `${import.meta.env.BASE_URL}placeholders/pegasus archive/WhatsApp Image 2026-03-24 at 10.13.39 AM.jpeg`, alt: "Osinachi Ohale" },
      visitDate: "March 2026",
      order: 2,
    },
  ];

  const defaultPartners: Partner[] = [
    {
      name: "The Rising Stars Project",
      tier: "global",
      descriptionHtml:
        "A US-based NGO dedicated to developing young talents and uplifting grassroots football. Officially launched with Pegasus in 2025.",
      logo: {
        url: `${import.meta.env.BASE_URL}pegasus archive/rising stars project .jpeg`,
        alt: "The Rising Stars Project",
      },
      websiteUrl: "",
      order: 5,
    },
    {
      name: "Peninsula Youth Football League",
      tier: "community",
      descriptionHtml: "Official league participation and competition partner",
      logo: { url: "", alt: "Peninsula Youth Football League" },
      websiteUrl: "",
      order: 10,
    },
    {
      name: "Local Schools",
      tier: "community",
      descriptionHtml: "Partnerships with schools in Badore, Ajah, and Lekki for talent identification",
      logo: { url: "", alt: "Local Schools" },
      websiteUrl: "",
      order: 20,
    },
    {
      name: "Medical Partners",
      tier: "community",
      descriptionHtml: "Healthcare support and fitness assessments for player safety",
      logo: { url: "", alt: "Medical Partners" },
      websiteUrl: "",
      order: 30,
    },
  ];

  const stars = useMemo(() => {
    const fromDb = starsCRUD.items.map((it) => ({ ...it.data, id: it.id, isDefault: false }));
    const dbNames = new Set(fromDb.map((s) => s.name));
    const onlyDefaults = defaultStars
      .filter((s) => !dbNames.has(s.name))
      .map((s) => ({ ...s, id: `default-${s.name}`, isDefault: true }));
    return [...fromDb, ...onlyDefaults].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [starsCRUD.items]);

  const partners = useMemo(() => {
    const fromDb = partnersCRUD.items.map((it) => ({ ...it.data, id: it.id, isDefault: false }));
    const dbNames = new Set(fromDb.map((p) => p.name));
    const onlyDefaults = defaultPartners
      .filter((p) => !dbNames.has(p.name))
      .map((p) => ({ ...p, id: `default-${p.name}`, isDefault: true }));
    return [...fromDb, ...onlyDefaults].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [partnersCRUD.items]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Preview (same as website)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-10">
          <div>
            <div className="text-sm font-semibold text-secondary mb-3">Football Stars</div>
            <div className="max-w-4xl space-y-6">
              {stars.map((item: any) => (
                <Card
                  key={item.id}
                  className={`overflow-hidden shadow-xl cursor-pointer relative ${
                    item.isDefault ? "opacity-70 grayscale-[0.5]" : ""
                  }`}
                  onClick={() => {
                    if (item.isDefault) {
                      setStarPrefill(item);
                    } else {
                      setSelectedStarId(item.id);
                    }
                  }}
                >
                  {item.isDefault && (
                    <div className="absolute top-2 right-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase z-10">
                      Not in DB
                    </div>
                  )}
                  <div className="grid md:grid-cols-5 gap-8 p-8">
                    <div className="md:col-span-2">
                      <img
                        src={item.image?.url}
                        alt={item.name}
                        className="rounded-lg w-full aspect-square object-cover"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <div className="text-sm font-semibold text-primary uppercase mb-2">
                        {item.achievement}
                      </div>
                      <h3 className="text-3xl font-bold mb-4 text-secondary">{item.name}</h3>
                      <blockquote className="text-lg text-gray-700 italic mb-6 border-l-4 border-primary pl-6">
                        "{item.quote}"
                      </blockquote>
                      <div className="text-sm text-gray-600">
                        <strong>Visit Date:</strong> {item.visitDate}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-secondary mb-3">Community Partners</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
              {partners.map((item: any) => (
                <Card
                  key={item.id}
                  className={`p-8 text-center h-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer relative ${
                    item.isDefault ? "opacity-70 grayscale-[0.5]" : ""
                  }`}
                  onClick={() => {
                    if (item.isDefault) {
                      setPartnerPrefill(item);
                    } else {
                      setSelectedPartnerId(item.id);
                    }
                  }}
                >
                  {item.isDefault && (
                    <div className="absolute top-2 right-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase z-10">
                      Not in DB
                    </div>
                  )}
                  {item.logo?.url ? (
                    <img
                      src={item.logo.url}
                      alt={item.logo.alt || item.name}
                      className="h-14 w-auto mx-auto mb-4 object-contain"
                    />
                  ) : (
                    <div className="text-5xl mb-4">🤝</div>
                  )}
                  <h3 className="text-xl font-bold mb-3 text-secondary">{item.name}</h3>
                  <div
                    className="text-gray-600 text-sm"
                    dangerouslySetInnerHTML={{ __html: item.descriptionHtml }}
                  />
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <StarsPageAdmin editId={selectedStarId} createPrefill={starPrefill} />
      <PartnersPageAdmin editId={selectedPartnerId} createPrefill={partnerPrefill} />
    </div>
  );
}
