import { useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "sonner";
import type { Player, SquadStarPlayers } from "../../content/types";
import { useAdminCRUD } from "../hooks/useAdminCRUD";
import { SquadPageAdmin } from "./SquadPage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export function SquadHome() {
  const { items } = useAdminCRUD<Player>("player");
  const { items: starItems, createItem: createStarItem, updateItem: updateStarItem } =
    useAdminCRUD<SquadStarPlayers>("squadStarPlayers");
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [playerQuery, setPlayerQuery] = useState("");
  const [starOpen, setStarOpen] = useState(false);
  const [starForm, setStarForm] = useState<SquadStarPlayers>({
    topScorerName: "Joseph Musa",
    topScorerDetail: "15 goals - U10",
    mostImprovedName: "Tobenna Okeke",
    mostImprovedDetail: "U7-U9 Category",
    bestGoalkeeperName: "Samuel Nwankwo",
    bestGoalkeeperDetail: "10 clean sheets",
    order: 10,
  });

  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0)),
    [items]
  );

  const getPositionColor = (position: string) => {
    switch (position.toLowerCase()) {
      case "goalkeeper":
        return "bg-green-100 text-green-800";
      case "defender":
        return "bg-blue-100 text-blue-800";
      case "midfielder":
        return "bg-purple-100 text-purple-800";
      case "forward":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const preview = useMemo(() => {
    return sorted.map((p) => ({ id: p.id, data: p.data }));
  }, [sorted]);

  const filteredPreview = useMemo(() => {
    const q = playerQuery.trim().toLowerCase();
    if (!q) return preview;
    return preview.filter(({ data }) => {
      const name = String(data.name ?? "").toLowerCase();
      const jersey = String(data.jersey ?? "");
      return name.includes(q) || jersey.includes(q);
    });
  }, [preview, playerQuery]);

  const starCurrent = starItems[0] ?? null;
  const starData: SquadStarPlayers =
    starCurrent?.data ?? {
      topScorerName: "Joseph Musa",
      topScorerDetail: "15 goals - U10",
      mostImprovedName: "Tobenna Okeke",
      mostImprovedDetail: "U7-U9 Category",
      bestGoalkeeperName: "Samuel Nwankwo",
      bestGoalkeeperDetail: "10 clean sheets",
      order: 10,
    };

  const openStarEditor = () => {
    setStarForm(starData);
    setStarOpen(true);
  };

  const saveStarPlayers = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (starCurrent) {
        await updateStarItem(starCurrent.id, starForm);
        toast.success("Star Players updated successfully");
      } else {
        await createStarItem(starForm, "published");
        toast.success("Star Players created successfully");
      }
      setStarOpen(false);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save Star Players");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Star Players (same as website)</CardTitle>
          <Button variant="outline" onClick={openStarEditor}>
            Edit Star Players
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
            <Card className="p-6 text-center shadow-lg">
              <div className="text-5xl mb-2">🏆</div>
              <h3 className="text-xl font-bold mb-2 text-secondary">Top Scorer</h3>
              <p className="text-lg font-semibold text-primary">{starData.topScorerName}</p>
              <p className="text-sm text-gray-600">{starData.topScorerDetail}</p>
            </Card>
            <Card className="p-6 text-center shadow-lg">
              <div className="text-5xl mb-2">⭐</div>
              <h3 className="text-xl font-bold mb-2 text-secondary">Most Improved</h3>
              <p className="text-lg font-semibold text-primary">{starData.mostImprovedName}</p>
              <p className="text-sm text-gray-600">{starData.mostImprovedDetail}</p>
            </Card>
            <Card className="p-6 text-center shadow-lg">
              <div className="text-5xl mb-2">🧤</div>
              <h3 className="text-xl font-bold mb-2 text-secondary">Best Goalkeeper</h3>
              <p className="text-lg font-semibold text-primary">{starData.bestGoalkeeperName}</p>
              <p className="text-sm text-gray-600">{starData.bestGoalkeeperDetail}</p>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Preview (same as website)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              value={playerQuery}
              onChange={(e) => setPlayerQuery(e.target.value)}
              placeholder="Search player name or jersey number..."
            />
          </div>
          {items.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No players yet. Add your first player below.
            </div>
          ) : filteredPreview.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No players found.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPreview.map(({ id, data }) => (
                <Card
                  key={id}
                  className="overflow-hidden rounded-[30px] shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedPlayerId(id)}
                >
                  <div className="relative aspect-[460/531] overflow-hidden">
                    <img
                      src={data.photo.url}
                      alt={data.name}
                      className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                    />
                    <div className="absolute top-4 right-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {data.jersey}
                    </div>
                    <Badge className={`absolute top-4 left-4 ${getPositionColor(data.position)}`}>
                      {data.position}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2 text-secondary">{data.name}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <div className="text-xs text-gray-500">Age</div>
                        <div className="font-semibold">{data.age} years</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Height</div>
                        <div className="font-semibold">{data.height}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-gray-500">Goals This Season</div>
                        <div className="font-semibold text-primary text-lg">{data.goals}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={starOpen} onOpenChange={setStarOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={saveStarPlayers}>
            <DialogHeader>
              <DialogTitle>Edit Star Players</DialogTitle>
              <DialogDescription>Update the Star Players section displayed on the Squad page.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="topScorerName">Top Scorer Name</Label>
                  <Input
                    id="topScorerName"
                    value={starForm.topScorerName}
                    onChange={(e) => setStarForm({ ...starForm, topScorerName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="topScorerDetail">Top Scorer Detail</Label>
                  <Input
                    id="topScorerDetail"
                    value={starForm.topScorerDetail}
                    onChange={(e) => setStarForm({ ...starForm, topScorerDetail: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="mostImprovedName">Most Improved Name</Label>
                  <Input
                    id="mostImprovedName"
                    value={starForm.mostImprovedName}
                    onChange={(e) => setStarForm({ ...starForm, mostImprovedName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mostImprovedDetail">Most Improved Detail</Label>
                  <Input
                    id="mostImprovedDetail"
                    value={starForm.mostImprovedDetail}
                    onChange={(e) => setStarForm({ ...starForm, mostImprovedDetail: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bestGoalkeeperName">Best Goalkeeper Name</Label>
                  <Input
                    id="bestGoalkeeperName"
                    value={starForm.bestGoalkeeperName}
                    onChange={(e) => setStarForm({ ...starForm, bestGoalkeeperName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bestGoalkeeperDetail">Best Goalkeeper Detail</Label>
                  <Input
                    id="bestGoalkeeperDetail"
                    value={starForm.bestGoalkeeperDetail}
                    onChange={(e) => setStarForm({ ...starForm, bestGoalkeeperDetail: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setStarOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <SquadPageAdmin editId={selectedPlayerId} createPrefill={null} />
    </div>
  );
}
