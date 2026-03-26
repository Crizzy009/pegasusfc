import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ProgramsPageAdmin } from "./ProgramsPage";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import type { Program } from "../../content/types";

export function ProgramsHome() {
  const { items } = useAdminCRUD<Program>("program");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [prefill, setPrefill] = useState<Program | null>(null);

  const defaultPrograms: Program[] = [
    {
      title: "U5-U2",
      subtitle: "Early Stars",
      ages: "2-5 years",
      focus: "Introduction to Football",
      time: "2:45 PM - 7:00 PM",
      days: "Friday & Saturday",
      fee: "₦15,000/month",
      description: "Focus on basic motor skills, coordination, and having fun with the ball.",
      curriculum: [
        "Basic motor skills and coordination",
        "Introduction to ball handling",
        "Fun-based learning games",
        "Social interaction with peers",
        "Confidence building",
      ],
      order: 10,
    },
    {
      title: "U9-U6",
      subtitle: "Foundation Program",
      ages: "6-9 years",
      focus: "Fun & Fundamentals",
      time: "2:45 PM - 7:00 PM",
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
      order: 20,
    },
    {
      title: "U12-U9",
      subtitle: "Development Squad",
      ages: "9-12 years",
      focus: "Skill Development",
      time: "2:45 PM - 7:00 PM",
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
      order: 30,
    },
    {
      title: "U18-U14",
      subtitle: "Youth Elite",
      ages: "14-18 years",
      focus: "Elite Performance",
      time: "2:45 PM - 7:00 PM",
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
    },
  ];

  const colors = useMemo(
    () => [
      "from-orange-400 to-orange-600",
      "from-orange-500 to-orange-700",
      "from-orange-600 to-orange-800",
      "from-orange-700 to-orange-900",
    ],
    []
  );

  const mergedPrograms = useMemo(() => {
    const fromDb = items.map((it) => ({ ...it.data, id: it.id, isDefault: false }));
    const dbTitles = new Set(fromDb.map((p) => p.title));
    
    const fallbacks = defaultPrograms
      .filter((p) => !dbTitles.has(p.title))
      .map((p) => ({ ...p, id: `default-${p.title}`, isDefault: true }));
    
    return [...fromDb, ...fallbacks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [items]);

  const preview = useMemo(() => {
    return mergedPrograms.map((p, index) => ({
      ...p,
      color: (p as any).color || colors[index % colors.length],
    }));
  }, [mergedPrograms, colors]);

  const handleCardClick = (program: any) => {
    if (program.isDefault) {
      setSelectedIndex(null);
      // Remove the id and isDefault flag before prefilling
      const { id, isDefault, ...cleanData } = program;
      setPrefill(cleanData);
    } else {
      setPrefill(null);
      setSelectedIndex(mergedPrograms.findIndex(p => p.id === program.id));
    }
  };

  const selectedId = selectedIndex !== null ? mergedPrograms[selectedIndex]?.id ?? null : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Preview (same as website)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {preview.map((program) => (
              <Card
                key={program.id}
                className={`p-6 bg-gradient-to-br ${program.color} text-white h-full shadow-lg hover:shadow-2xl transition-shadow cursor-pointer relative group`}
                onClick={() => handleCardClick(program)}
              >
                {program.isDefault && (
                  <div className="absolute top-2 right-2 bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    Not in DB
                  </div>
                )}
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

      <ProgramsPageAdmin editId={selectedId} createPrefill={prefill} />
    </div>
  );
}
