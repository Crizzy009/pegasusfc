import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import type { Trial } from "../../content/types";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import { TrialPageAdmin } from "./TrialPage";
import { Calendar, Clock, Users } from "lucide-react";

export function TrialsHome() {
  const trialsCRUD = useAdminCRUD<Trial>("trial");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...trialsCRUD.items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)),
    [trialsCRUD.items]
  );

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
        </CardHeader>
        <CardContent>
          {sorted.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No trials yet. Add your first trial below.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl">
              {sorted.map((t) => (
                <Card
                  key={t.id}
                  className="p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedId(t.id)}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="font-bold text-lg text-secondary">{t.data.dateLabel}</span>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500">Age Groups</div>
                        <div className="font-semibold">{t.data.ageGroups}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                      <div>
                        <div className="text-xs text-gray-500">Time</div>
                        <div className="font-semibold">{t.data.time}</div>
                      </div>
                    </div>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusClass(t.data.status)}`}>
                    {statusLabel(t.data.status)}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <TrialPageAdmin editId={selectedId} />
    </div>
  );
}
