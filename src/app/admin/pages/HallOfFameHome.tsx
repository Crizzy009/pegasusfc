import { useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "sonner";
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
  const { items, createItem } = useAdminCRUD<Achievement>("achievement");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createPrefill, setCreatePrefill] = useState<Achievement | null>(null);

  const fallbackAchievements: Achievement[] = [
    { season: "2023", title: "Academy Launch", description: "Academy successfully launched in Badore, Ajah", category: "milestone", order: 10 },
    { season: "2023", title: "Enrollment Growth", description: "Enrolled 150+ players across 6 age categories", category: "growth", order: 20 },
    { season: "2023", title: "Training Facility", description: "Established training facility in Lekki axis", category: "facility", order: 30 },
    { season: "2023", title: "School Partnerships", description: "Partnered with local schools for talent identification", category: "partner", order: 40 },
    { season: "2023", title: "Pegasus Open Day", description: "Hosted inaugural Pegasus Open Day with 300+ attendees", category: "event", order: 50 },
    { season: "2024", title: "League Participation", description: "Participated in Lagos Junior Football League", category: "league", order: 10 },
    { season: "2024", title: "Ajah District Cup", description: "U11 team reached semi-finals of Ajah District Cup", category: "tournament", order: 20 },
    { season: "2024", title: "Lekki Tournament", description: "U14 team won 3rd place in Lekki Inter-Academy Tournament", category: "tournament", order: 30 },
    { season: "2024", title: "State Trials", description: "5 players selected for Lagos State U15 trials", category: "trials", order: 40 },
    { season: "2024", title: "Star Clinic", description: "Hosted Nigerian football star clinic", category: "event", order: 50 },
    { season: "2024", title: "Development Program", description: "Established U7 & U9 development program", category: "program", order: 60 },
    { season: "2025", title: "Badore Community Cup", description: "U10 team - Champions, Badore Community Cup", category: "trophy", highlight: true, order: 10 },
    { season: "2025", title: "Youth Championship", description: "U13 team - Runners-up, Lagos Elite Youth Championship", category: "trophy", highlight: true, order: 20 },
    { season: "2025", title: "Academy Growth", description: "200+ active players enrolled", category: "growth", order: 30 },
    { season: "2025", title: "Player Pathway", description: "Partnership with local clubs for player pathway", category: "partner", order: 40 },
  ];

  const showFallback = items.length === 0;

  const achievements = useMemo(() => {
    if (showFallback) {
      return fallbackAchievements.map((a, idx) => ({ id: `fallback_${idx}`, data: a, isFallback: true }));
    }
    return items.map((i) => ({ id: i.id, data: i.data, isFallback: false }));
  }, [showFallback, items]);

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

  const importDefaults = async () => {
    try {
      for (const a of fallbackAchievements) {
        await createItem(a, "published");
      }
      toast.success("Default Hall Of Fame imported");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to import achievements");
    }
  };

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
              {list.slice(0, 4).map(({ id, data, isFallback }) => {
                const Icon = iconFor(data);
                const highlight = Boolean(data.highlight);
                return (
                  <Card
                    key={id}
                    className={`p-6 ${highlight ? "bg-white text-secondary" : "bg-white/10 text-white border-white/20"} h-full cursor-pointer`}
                    onClick={() => {
                      if (isFallback) {
                        setSelectedId(null);
                        setCreatePrefill(data);
                      } else {
                        setCreatePrefill(null);
                        setSelectedId(id);
                      }
                    }}
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
          {list.map(({ id, data, isFallback }) => {
            const Icon = iconFor(data);
            return (
              <Card
                key={id}
                className="p-6 hover:shadow-lg transition-shadow h-full cursor-pointer"
                onClick={() => {
                  if (isFallback) {
                    setSelectedId(null);
                    setCreatePrefill(data);
                  } else {
                    setCreatePrefill(null);
                    setSelectedId(id);
                  }
                }}
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
          {showFallback ? (
            <Button variant="outline" onClick={importDefaults}>
              Import Default Hall Of Fame
            </Button>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-8">
          {renderSeason("2025", "primary")}
          {renderSeason("2024", "plain")}
          {renderSeason("2023", "plain")}
        </CardContent>
      </Card>

      <HallOfFamePageAdmin editId={selectedId} createPrefill={createPrefill} />
    </div>
  );
}

