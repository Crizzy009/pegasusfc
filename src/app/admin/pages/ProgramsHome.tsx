import { useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ProgramsPageAdmin } from "./ProgramsPage";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import type { Program } from "../../content/types";
import { toast } from "sonner";

export function ProgramsHome() {
  const { items, createItem } = useAdminCRUD<Program>("program");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [createPrefill, setCreatePrefill] = useState<Program | null>(null);

  const colors = useMemo(
    () => [
      "from-orange-400 to-orange-600",
      "from-orange-500 to-orange-700",
      "from-orange-600 to-orange-800",
      "from-orange-700 to-orange-900",
    ],
    []
  );

  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)),
    [items]
  );

  const preview = useMemo(() => {
    return sorted.map((p, index) => ({
      id: p.id,
      ...p.data,
      color: (p.data as any).color || colors[index % colors.length],
    })) as Array<Program & { id: string; color: string }>;
  }, [sorted, colors]);

  const selectedId = selectedIndex !== null ? sorted[selectedIndex]?.id ?? null : null;

  const fallbackPrograms: Array<Program & { color: string }> = [
    {
      title: "U7 & U9",
      subtitle: "Foundation Program",
      ages: "6-9 years",
      focus: "Fun & Fundamentals",
      time: "4:00 PM - 5:00 PM",
      days: "Friday & Saturday",
      fee: "₦15,000/month",
      description: "Introduction to football through fun games and basic skills development",
      curriculum: [
        "Basic ball control and dribbling",
        "Simple passing techniques",
        "Fun small-sided games",
        "Coordination and balance",
        "Teamwork and sportsmanship",
      ],
      order: 10,
      color: "from-orange-400 to-orange-600",
    },
    {
      title: "U10",
      subtitle: "Development Squad",
      ages: "10 years",
      focus: "Skill Development",
      time: "5:00 PM - 6:00 PM",
      days: "Friday & Saturday",
      fee: "₦18,000/month",
      description: "Building technical skills and introducing tactical concepts",
      curriculum: [
        "Advanced dribbling techniques",
        "Passing and receiving",
        "Shooting accuracy",
        "Basic positioning",
        "Introduction to match play",
      ],
      order: 20,
      color: "from-orange-500 to-orange-700",
    },
    {
      title: "U11-U13",
      subtitle: "Junior Academy",
      ages: "11-13 years",
      focus: "Tactical Awareness",
      time: "5:00 PM - 6:30 PM",
      days: "Friday & Saturday",
      fee: "₦20,000/month",
      description: "Developing tactical understanding and competitive match experience",
      curriculum: [
        "Tactical formations and positioning",
        "Team play and communication",
        "Speed and agility training",
        "Match strategy",
        "Regular competitive matches",
      ],
      order: 30,
      color: "from-orange-600 to-orange-800",
    },
    {
      title: "U14-U16",
      subtitle: "Youth Elite",
      ages: "14-16 years",
      focus: "Elite Performance",
      time: "6:00 PM - 7:30 PM",
      days: "Friday & Saturday",
      fee: "₦25,000/month",
      description: "High-performance training for competitive football and talent pathway",
      curriculum: [
        "Advanced tactical systems",
        "Physical conditioning",
        "Mental preparation",
        "Video analysis",
        "Pathway to professional clubs",
      ],
      order: 40,
      color: "from-orange-700 to-orange-900",
    },
  ];

  const showFallback = preview.length === 0;

  const importDefaults = async () => {
    try {
      for (const p of fallbackPrograms) {
        const { color: _color, ...data } = p;
        await createItem(data, "published");
      }
      toast.success("Default programs imported");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to import programs");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Preview (same as website)</CardTitle>
          {showFallback ? (
            <Button variant="outline" onClick={importDefaults}>
              Import Default Programs
            </Button>
          ) : null}
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(showFallback
              ? fallbackPrograms.map((p, index) => ({ ...p, id: `fallback_${index}` }))
              : preview
            ).map((program, index) => (
                <Card
                  key={program.id}
                  className={`p-6 bg-gradient-to-br ${program.color} text-white h-full shadow-lg hover:shadow-2xl transition-shadow cursor-pointer`}
                  onClick={() => {
                    if (showFallback) {
                      const { color: _color, ...data } = program;
                      setSelectedIndex(null);
                      setCreatePrefill(data);
                      return;
                    }
                    setCreatePrefill(null);
                    setSelectedIndex(index);
                  }}
                >
                  <div className="text-3xl font-bold mb-2">{program.title}</div>
                  <div className="text-lg mb-4 opacity-90">{program.subtitle}</div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Ages:</strong> {program.ages}
                    </div>
                    <div>
                      <strong>Focus:</strong> {program.focus}
                    </div>
                    <div>
                      <strong>Time:</strong> {program.time}
                    </div>
                    <div className="pt-2 flex items-center justify-between">
                      <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs">
                        Fri - Sat
                      </div>
                      <div className="text-base font-semibold">{program.fee}</div>
                    </div>
                  </div>
                </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <ProgramsPageAdmin editId={selectedId} createPrefill={createPrefill} />
    </div>
  );
}
