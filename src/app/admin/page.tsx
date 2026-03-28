
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { fetchAdminContent } from "../content/api";
import { Loader2, Users, Trophy, Calendar, LayoutDashboard } from "lucide-react";

const data = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 2100 },
  { name: "Mar", total: 800 },
  { name: "Apr", total: 1600 },
  { name: "May", total: 900 },
  { name: "Jun", total: 1700 },
  { name: "Jul", total: 1300 },
  { name: "Aug", total: 2000 },
  { name: "Sep", total: 2400 },
  { name: "Oct", total: 1800 },
  { name: "Nov", total: 2200 },
  { name: "Dec", total: 2600 },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    players: 0,
    achievements: 0,
    trials: 0,
    programs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [players, achievements, trials, programs] = await Promise.all([
          fetchAdminContent({ type: "player" }),
          fetchAdminContent({ type: "achievement" }),
          fetchAdminContent({ type: "trial" }),
          fetchAdminContent({ type: "program" })
        ]);
        setCounts({
          players: players.length,
          achievements: achievements.length,
          trials: trials.length,
          programs: programs.length
        });
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <div className="text-2xl font-bold">{counts.players}</div>
                <p className="text-xs text-muted-foreground">Registered academy players</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <div className="text-2xl font-bold">{counts.achievements}</div>
                <p className="text-xs text-muted-foreground">Trophies and milestones</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <div className="text-2xl font-bold">{counts.programs}</div>
                <p className="text-xs text-muted-foreground">Training categories</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Trials</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🏃</div>
          </CardHeader>
          <CardContent>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <div className="text-2xl font-bold">{counts.trials}</div>
                <p className="text-xs text-muted-foreground">Scheduled recruitment sessions</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Registration Overview</CardTitle>
            <CardDescription>Monthly player registration trends for 2026.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${value}`} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your website content easily.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Link to="/admin/content/home-teams">
              <Button variant="outline" className="w-full justify-start gap-2">
                ⚽ Our Teams
              </Button>
            </Link>
            <Link to="/admin/content/home-highlights">
              <Button variant="outline" className="w-full justify-start gap-2">
                🏆 Recent Highlights
              </Button>
            </Link>
            <Link to="/admin/content/about-facilities">
              <Button variant="outline" className="w-full justify-start gap-2">
                🏟️ Our Facilities
              </Button>
            </Link>
            <Link to="/admin/content/programs">
              <Button variant="outline" className="w-full justify-start gap-2">
                📚 Programs Page
              </Button>
            </Link>
            <Link to="/admin/content/squad">
              <Button variant="outline" className="w-full justify-start gap-2">
                👟 Squad Page
              </Button>
            </Link>
            <Link to="/admin/content/media-hub">
              <Button variant="outline" className="w-full justify-start gap-2">
                📸 Media Hub
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
