import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Award, Star, Target, TrendingUp, Trophy, Users } from "lucide-react";
import type { Achievement } from "../../content/types";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import { HallOfFamePageAdmin } from "./HallOfFamePage";

function iconFor(a: Achievement) {
  const c = String(a.category ?? "").toLowerCase();
  if (c.includes("trophy") || c.includes("tournament")) return Trophy;
  if (c.includes("growth")) return Users;
  if (c.includes("facility")) return Target;
  if (c.includes("partner")) return TrendingUp;
  if (c.includes("event")) return Star;
  if (c.includes("trials")) return Award;
  return Award;
}

export function HallOfFameHome() {
  const { items } = useAdminCRUD<Achievement>("achievement");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const achievements = useMemo(() => {
    return items.map((i) => ({ id: i.id, data: i.data }));
  }, [items]);

  const bySeason = useMemo(() => {
    const groups = new Map<string, Array<{ id: string; data: Achievement; isFallback: boolean }>>();
    for (const it of achievements) {
      const s = String(it.data.season ?? "");
      if (!groups.has(s)) groups.set(s, []);
      groups.get(s)!.push(it);
    }
    for (const v of groups.values()) v.sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
    return groups;
  }, [achievements]);

  const renderSeason = (season: string, variant: "primary" | "plain") => {
    const list = bySeason.get(season) ?? [];
    if (list.length === 0) return null;
    if (variant === "primary") {
      return (
        <section className="py-8 bg-gradient-to-br from-primary to-accent text-white rounded-lg">
          <div className="px-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">{season} Season</h2>
              <p className="text-white/90">Our latest achievements</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {list.slice(0, 4).map(({ id, data }) => {
                const Icon = iconFor(data);
                const highlight = Boolean(data.highlight);
                return (
                  <Card
                    key={id}
                    className={`p-6 ${highlight ? "bg-white text-secondary" : "bg-white/10 text-white border-white/20"} h-full cursor-pointer`}
                    onClick={() => setSelectedId(id)}
                  >
                    <Icon className={`w-10 h-10 mb-4 ${highlight ? "text-primary" : "text-white"}`} />
                    <p className="font-medium">{data.title}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    return (
      <section className="py-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-secondary">{season} Season</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map(({ id, data }) => {
            const Icon = iconFor(data);
            return (
              <Card
                key={id}
                className="p-6 hover:shadow-lg transition-shadow h-full cursor-pointer"
                onClick={() => setSelectedId(id)}
              >
                <Icon className="w-10 h-10 text-primary mb-4" />
                <p className="text-gray-700 font-medium">{data.title}</p>
              </Card>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Preview (same as website)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {items.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No Hall of Fame items yet. Add your first achievement below.
            </div>
          ) : (
            <>
              {renderSeason("2025", "primary")}
              {renderSeason("2024", "plain")}
              {renderSeason("2023", "plain")}
            </>
          )}
        </CardContent>
      </Card>

      <HallOfFamePageAdmin editId={selectedId} createPrefill={null} />
    </div>
  );
}
