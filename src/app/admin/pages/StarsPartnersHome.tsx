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

  const stars = useMemo(
    () => [...starsCRUD.items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)),
    [starsCRUD.items]
  );
  const partners = useMemo(
    () => [...partnersCRUD.items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)),
    [partnersCRUD.items]
  );

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
              {stars.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  No stars yet. Add your first star below.
                </div>
              ) : (
                stars.map((item: any) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden shadow-xl cursor-pointer"
                    onClick={() => setSelectedStarId(item.id)}
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
                ))
              )}
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-secondary mb-3">Community Partners</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
              {partners.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground sm:col-span-2 lg:col-span-3">
                  No partners yet. Add your first partner below.
                </div>
              ) : (
                partners.map((item: any) => (
                  <Card
                    key={item.id}
                    className="p-8 text-center h-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => setSelectedPartnerId(item.id)}
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
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <StarsPageAdmin editId={selectedStarId} createPrefill={null} />
      <PartnersPageAdmin editId={selectedPartnerId} createPrefill={null} />
    </div>
  );
}
