import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ProgramsPageAdmin } from "./ProgramsPage";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import type { Program } from "../../content/types";

export function ProgramsHome() {
  const { items } = useAdminCRUD<Program>("program");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Preview (same as website)</CardTitle>
        </CardHeader>
        <CardContent>
          {preview.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No programs yet. Add your first program below.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {preview.map((program, index) => (
                <Card
                  key={program.id}
                  className={`p-6 bg-gradient-to-br ${program.color} text-white h-full shadow-lg hover:shadow-2xl transition-shadow cursor-pointer`}
                  onClick={() => setSelectedIndex(index)}
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
          )}
        </CardContent>
      </Card>

      <ProgramsPageAdmin editId={selectedId} createPrefill={null} />
    </div>
  );
}
