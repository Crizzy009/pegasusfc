import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Award, Star, Target, TrendingUp, Trophy, Users } from "lucide-react";
import type { Achievement } from "../../content/types";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import { HallOfFamePageAdmin } from "./HallOfFamePage";

export function HallOfFameHome() {
  const { items } = useAdminCRUD<Achievement>("achievement");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [prefill, setPrefill] = useState<Achievement | null>(null);

  const defaultAchievements: Achievement[] = [
    { season: "2023", title: "Academy Launch", description: "Academy successfully launched in Badore, Ajah", category: "milestone", order: 10 },
    { season: "2023", title: "Enrollment Growth", description: "Enrolled 150+ players across 4 age categories", category: "growth", order: 20 },
    { season: "2023", title: "Training Facility", description: "Established training facility in Lekki axis", category: "facility", order: 30 },
    { season: "2023", title: "School Partnerships", description: "Partnered with local schools for talent identification", category: "partner", order: 40 },
    { season: "2023", title: "Pegasus Open Day", description: "Hosted inaugural Pegasus Open Day with 300+ attendees", category: "event", order: 50 },
    { season: "2024", title: "Youth Fun League", description: "Champions of Youth Fun League 2024", category: "trophy", highlight: true, order: 10 },
    { season: "2024", title: "Cooperative Tournament", description: "Champions of Badore Cooperative Tournament 2024", category: "trophy", highlight: true, order: 20 },
    { season: "2024", title: "League Participation", description: "Participated in Lagos Junior Football League", category: "league", order: 30 },
    { season: "2024", title: "Ajah District Cup", description: "U11 team reached semi-finals of Ajah District Cup", category: "tournament", order: 40 },
    { season: "2024", title: "Lekki Tournament", description: "U14 team won 3rd place in Lekki Inter-Academy Tournament", category: "tournament", order: 50 },
    { season: "2024", title: "State Trials", description: "5 players selected for Lagos State U15 trials", category: "trials", order: 60 },
    { season: "2024", title: "Star Clinic", description: "Hosted Nigerian football star clinic", category: "event", order: 70 },
    { season: "2024", title: "Development Program", description: "Established U7 & U9 development program", category: "program", order: 80 },
    { season: "2025", title: "NFE Youth Cup", description: "Second place champions, Tega Yahaya MVP, Chuwkunywm highest goal scorer", category: "trophy", highlight: true, order: 5 },
    { season: "2025", title: "Badore Community Cup", description: "U10 team - Champions, Badore Community Cup", category: "trophy", highlight: true, order: 10 },
    { season: "2025", title: "Youth Championship", description: "U13 team - Runners-up, Lagos Elite Youth Championship", category: "trophy", highlight: true, order: 20 },
    { season: "2025", title: "Academy Growth", description: "300+ active players enrolled", category: "growth", order: 30 },
    { season: "2025", title: "Player Pathway", description: "Partnership with local clubs for player pathway", category: "partner", order: 40 },
  ];

  const mergedAchievements = useMemo(() => {
    const fromDb = items.map((i) => ({ ...i.data, id: i.id, isDefault: false }));
    const dbTitles = new Set(fromDb.map((a) => a.title));
    
    const fallbacks = defaultAchievements
      .filter((a) => !dbTitles.has(a.title))
      .map((a) => ({ ...a, id: `default-${a.title}`, isDefault: true }));
    
    return [...fromDb, ...fallbacks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [items]);

  const bySeason = useMemo(() => {
    const groups = new Map<string, Array<any>>();
    for (const it of mergedAchievements) {
      const s = String(it.season ?? "");
      if (!groups.has(s)) groups.set(s, []);
      groups.get(s)!.push(it);
    }
    return groups;
  }, [mergedAchievements]);

  const handleItemClick = (item: any) => {
    if (item.isDefault) {
      setSelectedId(null);
      const { id, isDefault, ...cleanData } = item;
      setPrefill(cleanData);
    } else {
      setPrefill(null);
      setSelectedId(item.id);
    }
  };

  const iconFor = (a: Achievement) => {
    const c = (a.category || "").toLowerCase();
    if (c.includes("trophy") || c.includes("tournament")) return Trophy;
    if (c.includes("growth")) return Users;
    if (c.includes("facility")) return Target;
    if (c.includes("partner")) return TrendingUp;
    if (c.includes("event")) return Star;
    if (c.includes("trials")) return Award;
    return Award;
  };

  const renderSeason = (season: string, variant: "primary" | "plain") => {
    const list = bySeason.get(season) || [];
    if (list.length === 0) return null;

    return (
      <div key={season}>
        <div className="flex items-center gap-4 mb-6">
          <h3 className="text-2xl font-bold text-secondary italic">
            {season} {season === "2025" ? "(Ongoing)" : "Season"}
          </h3>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((it) => {
            const Icon = iconFor(it);
            return (
              <Card
                key={it.id}
                className={`p-4 cursor-pointer hover:shadow-md transition-shadow relative ${
                  it.highlight ? "bg-primary text-white" : "bg-white"
                }`}
                onClick={() => handleItemClick(it)}
              >
                {it.isDefault && (
                  <div className="absolute top-2 right-2 bg-black/10 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
                    Not in DB
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-1 ${it.highlight ? "text-white" : "text-primary"}`} />
                  <div>
                    <div className="font-bold text-sm">{it.title}</div>
                    <div className={`text-xs mt-1 ${it.highlight ? "text-white/80" : "text-gray-600"}`}>
                      {it.description}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Preview (same as website)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {renderSeason("2025", "primary")}
          {renderSeason("2024", "plain")}
          {renderSeason("2023", "plain")}
        </CardContent>
      </Card>

      <HallOfFamePageAdmin editId={selectedId} createPrefill={prefill} />
    </div>
  );
}
