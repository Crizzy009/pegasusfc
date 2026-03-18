import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import type { Partner, Star } from "../../content/types";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import { StarsPageAdmin } from "./StarsPage";
import { PartnersPageAdmin } from "./PartnersPage";
import { toast } from "sonner";

export function StarsPartnersHome() {
  const starsCRUD = useAdminCRUD<Star>("star");
  const partnersCRUD = useAdminCRUD<Partner>("partner");
  const placeholderPhotoUrl = `${import.meta.env.BASE_URL}placeholders/photo.svg`;

  const [selectedStarId, setSelectedStarId] = useState<string | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [createStarPrefill, setCreateStarPrefill] = useState<Star | null>(null);
  const [createPartnerPrefill, setCreatePartnerPrefill] = useState<Partner | null>(null);

  const stars = useMemo(
    () => [...starsCRUD.items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)),
    [starsCRUD.items]
  );
  const partners = useMemo(
    () => [...partnersCRUD.items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)),
    [partnersCRUD.items]
  );

  const fallbackStar: Star = {
    name: "Guest Star Visits",
    achievement: "Nigerian Football Legend",
    quote:
      "Pegasus is doing great work in developing young talent in Lagos. Keep up the excellent work!",
    image: {
      url: placeholderPhotoUrl,
      alt: "Guest Star Visits",
      caption: "",
    },
    visitDate: "2024",
    order: 10,
  };

  const fallbackPartners: Partner[] = [
    {
      name: "Local Schools",
      tier: "community",
      descriptionHtml: "Partnerships with schools in Badore, Ajah, and Lekki for talent identification",
      logo: {
        url: placeholderPhotoUrl,
        alt: "Local Schools",
        caption: "",
      },
      websiteUrl: "",
      order: 10,
    },
    {
      name: "Sports Equipment Providers",
      tier: "community",
      descriptionHtml: "Quality training equipment and gear for our players",
      logo: {
        url: placeholderPhotoUrl,
        alt: "Equipment Providers",
        caption: "",
      },
      websiteUrl: "",
      order: 20,
    },
    {
      name: "Medical Partners",
      tier: "community",
      descriptionHtml: "Healthcare support and fitness assessments for player safety",
      logo: {
        url: placeholderPhotoUrl,
        alt: "Medical Partners",
        caption: "",
      },
      websiteUrl: "",
      order: 30,
    },
  ];

  const showStarFallback = stars.length === 0;
  const showPartnerFallback = partners.length === 0;

  const importDefaults = async () => {
    try {
      if (showStarFallback) await starsCRUD.createItem(fallbackStar, "published");
      if (showPartnerFallback) {
        for (const p of fallbackPartners) await partnersCRUD.createItem(p, "published");
      }
      toast.success("Default Stars & Partners imported");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to import defaults");
    }
  };

  const starPreview = showStarFallback ? [{ id: "fallback_star", data: fallbackStar }] : stars;
  const partnerPreview = showPartnerFallback
    ? fallbackPartners.map((p, idx) => ({ id: `fallback_partner_${idx}`, data: p }))
    : partners;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Preview (same as website)</CardTitle>
          {showStarFallback || showPartnerFallback ? (
            <Button variant="outline" onClick={importDefaults}>
              Import Default Stars & Partners
            </Button>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-10">
          <div>
            <div className="text-sm font-semibold text-secondary mb-3">Football Stars</div>
            <div className="max-w-4xl space-y-6">
              {starPreview.map((item: any) => (
                <Card
                  key={item.id}
                  className="overflow-hidden shadow-xl cursor-pointer"
                  onClick={() => {
                    if (showStarFallback) {
                      setSelectedStarId(null);
                      setCreateStarPrefill(item.data);
                      return;
                    }
                    setCreateStarPrefill(null);
                    setSelectedStarId(item.id);
                  }}
                >
                  <div className="grid md:grid-cols-5 gap-8 p-8">
                    <div className="md:col-span-2">
                      <img
                        src={item.data.image.url}
                        alt={item.data.name}
                        className="rounded-lg w-full aspect-square object-cover"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <div className="text-sm font-semibold text-primary uppercase mb-2">
                        {item.data.achievement}
                      </div>
                      <h3 className="text-3xl font-bold mb-4 text-secondary">{item.data.name}</h3>
                      <blockquote className="text-lg text-gray-700 italic mb-6 border-l-4 border-primary pl-6">
                        "{item.data.quote}"
                      </blockquote>
                      <div className="text-sm text-gray-600">
                        <strong>Visit Date:</strong> {item.data.visitDate}
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
              {partnerPreview.map((item: any) => (
                <Card
                  key={item.id}
                  className="p-8 text-center h-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => {
                    if (showPartnerFallback) {
                      setSelectedPartnerId(null);
                      setCreatePartnerPrefill(item.data);
                      return;
                    }
                    setCreatePartnerPrefill(null);
                    setSelectedPartnerId(item.id);
                  }}
                >
                  {item.data.logo?.url ? (
                    <img
                      src={item.data.logo.url}
                      alt={item.data.logo.alt || item.data.name}
                      className="h-14 w-auto mx-auto mb-4 object-contain"
                    />
                  ) : (
                    <div className="text-5xl mb-4">🤝</div>
                  )}
                  <h3 className="text-xl font-bold mb-3 text-secondary">{item.data.name}</h3>
                  <div className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: item.data.descriptionHtml }} />
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <StarsPageAdmin editId={selectedStarId} createPrefill={createStarPrefill} />
      <PartnersPageAdmin editId={selectedPartnerId} createPrefill={createPartnerPrefill} />
    </div>
  );
}
