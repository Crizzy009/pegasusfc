import { useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "sonner";
import type { Trial } from "../../content/types";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import { TrialPageAdmin } from "./TrialPage";
import { Calendar, Clock, Users } from "lucide-react";

export function TrialsHome() {
  const trialsCRUD = useAdminCRUD<Trial>("trial");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createPrefill, setCreatePrefill] = useState<Trial | null>(null);

  const sorted = useMemo(
    () => [...trialsCRUD.items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)),
    [trialsCRUD.items]
  );

  const showFallback = sorted.length === 0;

  const fallbackTrials: Trial[] = [
    {
      dateLabel: "Saturday, March 2, 2026",
      isoDate: "2026-03-02",
      time: "9:00 AM - 12:00 PM",
      ageGroups: "U7, U9, U10",
      venue: "Badore, Ajah, Lagos",
      registrationLimit: 50,
      status: "available",
      expiresAtIso: "",
      order: 10,
    },
    {
      dateLabel: "Saturday, March 9, 2026",
      isoDate: "2026-03-09",
      time: "9:00 AM - 12:00 PM",
      ageGroups: "U11, U12, U13",
      venue: "Badore, Ajah, Lagos",
      registrationLimit: 50,
      status: "available",
      expiresAtIso: "",
      order: 20,
    },
    {
      dateLabel: "Saturday, March 16, 2026",
      isoDate: "2026-03-16",
      time: "9:00 AM - 12:00 PM",
      ageGroups: "U14, U15, U16",
      venue: "Badore, Ajah, Lagos",
      registrationLimit: 50,
      status: "available",
      expiresAtIso: "",
      order: 30,
    },
  ];

  const importDefaults = async () => {
    try {
      for (const t of fallbackTrials) {
        await trialsCRUD.createItem(t, "published");
      }
      toast.success("Default trials imported");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to import trials");
    }
  };

  const preview = useMemo(() => {
    if (showFallback) return fallbackTrials.map((t, idx) => ({ id: `fallback_${idx}`, data: t, isFallback: true }));
    return sorted.map((t) => ({ id: t.id, data: t.data, isFallback: false }));
  }, [showFallback, fallbackTrials, sorted]);

  const statusLabel = (s?: Trial["status"]) => {
    if (s === "full") return "Full";
    if (s === "closed") return "Closed";
    return "Available";
  };

  const statusClass = (s?: Trial["status"]) => {
    if (s === "full") return "bg-red-100 text-red-800";
    if (s === "closed") return "bg-gray-200 text-gray-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Preview (same as website)</CardTitle>
          {showFallback ? (
            <Button variant="outline" onClick={importDefaults}>
              Import Default Trials
            </Button>
          ) : null}
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl">
            {preview.map(({ id, data, isFallback }) => (
              <Card
                key={id}
                className="p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => {
                  if (isFallback) {
                    setSelectedId(null);
                    setCreatePrefill(data);
                    return;
                  }
                  setCreatePrefill(null);
                  setSelectedId(id);
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-bold text-lg text-secondary">{data.dateLabel}</span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Age Groups</div>
                      <div className="font-semibold">{data.ageGroups}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-500">Time</div>
                      <div className="font-semibold">{data.time}</div>
                    </div>
                  </div>
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusClass(data.status)}`}>
                  {statusLabel(data.status)}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <TrialPageAdmin editId={selectedId} createPrefill={createPrefill} />
    </div>
  );
}

