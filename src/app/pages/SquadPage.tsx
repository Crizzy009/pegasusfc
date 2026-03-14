import { useEffect, useRef, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { motion } from "motion/react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export function SquadPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardWidthRef = useRef(280);
  const [containerHeight, setContainerHeight] = useState(560);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startProgressRef = useRef(0);
  const lastMovesRef = useRef<Array<{ t: number; x: number }>>([]);
  const rafRef = useRef<number | null>(null);

  const categories = [
    { id: "all", label: "All Players" },
    { id: "u7-u9", label: "U7 & U9" },
    { id: "u10", label: "U10" },
    { id: "u11-u13", label: "U11-U13" },
    { id: "u14-u16", label: "U14-U16" },
  ];

  // Mock player data
  const players = [
    {
      id: 1,
      name: "David Okafor",
      jersey: 10,
      position: "Forward",
      age: 15,
      category: "u14-u16",
      height: "5'8\"",
      goals: 12,
      image: "https://images.unsplash.com/photo-1769383924825-44706af97281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHNvY2NlciUyMHBsYXllciUyMGFjdGlvbiUyMHNob3R8ZW58MXx8fHwxNzcxNTEyMjEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 2,
      name: "Emmanuel Adebayo",
      jersey: 7,
      position: "Midfielder",
      age: 14,
      category: "u14-u16",
      height: "5'7\"",
      goals: 8,
      image: "https://images.unsplash.com/photo-1770237711414-e91a21755b4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0aCUyMHNvY2NlciUyMHRyYWluaW5nJTIwYWN0aW9ufGVufDF8fHx8MTc3MTUxMjAzNXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 3,
      name: "Samuel Nwankwo",
      jersey: 1,
      position: "Goalkeeper",
      age: 13,
      category: "u11-u13",
      height: "5'5\"",
      goals: 0,
      image: "https://images.unsplash.com/photo-1762013315117-1c8005ad2b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMG1hdGNoJTIwYWN0aW9uJTIwc3RhZGl1bXxlbnwxfHx8fDE3NzE1MTIyMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 4,
      name: "Chukwuemeka Eze",
      jersey: 5,
      position: "Defender",
      age: 12,
      category: "u11-u13",
      height: "5'4\"",
      goals: 3,
      image: "https://images.unsplash.com/photo-1731673092066-cff4ea887d57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwc29jY2VyJTIwcHJhY3RpY2UlMjBkcmlsbHN8ZW58MXx8fHwxNzcxNTEyMDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 5,
      name: "Joseph Musa",
      jersey: 9,
      position: "Forward",
      age: 10,
      category: "u10",
      height: "4'9\"",
      goals: 15,
      image: "https://images.unsplash.com/photo-1764438344341-d4700ad674f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBnb2FsJTIwY2VsZWJyYXRpb24lMjB0ZWFtfGVufDF8fHx8MTc3MTUxMjAzNnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 6,
      name: "Tobenna Okeke",
      jersey: 11,
      position: "Midfielder",
      age: 9,
      category: "u7-u9",
      height: "4'5\"",
      goals: 5,
      image: "https://images.unsplash.com/photo-1762053275412-03726506562a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBjb2FjaGluZyUyMHNlc3Npb24lMjB5b3V0aHxlbnwxfHx8fDE3NzE1MTIwOTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const filteredPlayers = players.filter((player) => {
    const matchesCategory = selectedCategory === "all" || player.category === selectedCategory;
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         player.jersey.toString().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

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

  useEffect(() => {
    setProgress(0);
    setCurrentIndex(0);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const el = containerRef.current;
    const resize = () => {
      if (!el) return;
      const w = el.getBoundingClientRect().width;
      cardWidthRef.current = Math.max(240, Math.min(360, Math.floor(w * 0.8)));
      const imgH = Math.floor(cardWidthRef.current * (4 / 3));
      const contentH = 200;
      setContainerHeight(imgH + contentH);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const clampIndex = (i: number) => {
    const max = Math.max(0, filteredPlayers.length - 1);
    return Math.max(0, Math.min(max, i));
  };

  const animateTo = (target: number, duration = 420) => {
    const from = progress;
    const to = target;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const v = from + (to - from) * ease(p);
      setProgress(v);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCurrentIndex(Math.round(to));
        rafRef.current = null;
      }
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    draggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
    startProgressRef.current = progress;
    lastMovesRef.current = [{ t: performance.now(), x: startXRef.current }];
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    const x = e.touches[0].clientX;
    const dx = x - startXRef.current;
    const w = cardWidthRef.current || 300;
    const np = startProgressRef.current - dx / w;
    setProgress(np);
    const now = performance.now();
    lastMovesRef.current.push({ t: now, x });
    if (lastMovesRef.current.length > 5) lastMovesRef.current.shift();
  };

  const onTouchEnd = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const pts = lastMovesRef.current;
    let v = 0;
    if (pts.length >= 2) {
      const a = pts[pts.length - 2];
      const b = pts[pts.length - 1];
      const dt = Math.max(1, b.t - a.t);
      v = (b.x - a.x) / dt;
    }
    const w = cardWidthRef.current || 300;
    const projected = progress - (v * 220) / w;
    const target = clampIndex(Math.round(projected));
    animateTo(target, 420);
  };

  const getCardStyle = (i: number) => {
    const d = i - progress;
    const w = cardWidthRef.current || 300;
    const x = d * (w * 0.72);
    const z = -Math.min(3, Math.abs(d)) * 140 + (Math.abs(d) < 0.3 ? 80 : 0);
    const s = 1 - Math.min(0.45, Math.abs(d) * 0.1) + (Math.abs(d) < 0.3 ? 0.05 : 0);
    const o = 1 - Math.min(0.6, Math.abs(d) * 0.18);
    const bl = Math.min(6, Math.abs(d) * 2);
    const zi = 100 - Math.abs(Math.round(d)) * 10 + (Math.abs(d) < 0.5 ? 50 : 0);
    return {
      width: `${w}px`,
      transform: `translate3d(${x}px, 0, ${z}px) scale(${s})`,
      opacity: o,
      filter: `blur(${bl}px)`,
      zIndex: zi,
      willChange: "transform, opacity, filter",
      transition: draggingRef.current
        ? "none"
        : "transform 360ms cubic-bezier(.22,.61,.36,1), opacity 360ms, filter 360ms",
      pointerEvents: Math.abs(d) < 0.7 ? "auto" : "none",
      boxShadow:
        Math.abs(d) < 0.3
          ? "0 25px 50px -12px rgba(0,0,0,0.5)"
          : "0 10px 30px -12px rgba(0,0,0,0.35)",
    } as React.CSSProperties;
  };
  const next = () => {
    const target = clampIndex(currentIndex + 1);
    animateTo(target);
  };
  const prev = () => {
    const target = clampIndex(currentIndex - 1);
    animateTo(target);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-secondary to-secondary/90 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Squad</h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Meet the talented players of Pegasus Football Academy
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-muted sticky top-20 z-40 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  className={selectedCategory === cat.id ? "bg-primary hover:bg-primary/90" : ""}
                >
                  {cat.label}
                </Button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search player or number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="md:hidden">
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No players found matching your criteria.</p>
              </div>
            ) : (
              <div
                ref={containerRef}
                className="relative mx-auto w-full"
                style={{
                  perspective: "1000px",
                  touchAction: "pan-y",
                  overscrollBehaviorX: "contain",
                  height: `${containerHeight}px`,
                  overflowX: "hidden",
                  overflowY: "visible",
                } as React.CSSProperties}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onTouchCancel={onTouchEnd}
              >
                <div className="absolute inset-0">
                  {filteredPlayers.map((player, i) => (
                    <div
                      key={player.id}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={getCardStyle(i)}
                    >
                      <Card className="overflow-hidden rounded-[30px] bg-white">
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <img
                            src={player.image}
                            alt={player.name}
                            className="w-full h-full object-cover"
                            style={{ willChange: "transform" }}
                          />
                          <div className="absolute top-4 right-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                            {player.jersey}
                          </div>
                          <Badge className={`absolute top-4 left-4 ${getPositionColor(player.position)}`}>
                            {player.position}
                          </Badge>
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-bold mb-2 text-secondary">{player.name}</h3>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>
                              <div className="text-xs text-gray-500">Age</div>
                              <div className="font-semibold">{player.age} years</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Height</div>
                              <div className="font-semibold">{player.height}</div>
                            </div>
                            <div className="col-span-2">
                              <div className="text-xs text-gray-500">Goals This Season</div>
                              <div className="font-semibold text-primary text-lg">{player.goals}</div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
                <button
                  aria-label="Previous"
                  onClick={prev}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  disabled={currentIndex <= 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-[200] p-3 rounded-full bg-white/80 text-secondary shadow-lg backdrop-blur-md active:scale-95 disabled:opacity-40"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  aria-label="Next"
                  onClick={next}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => e.stopPropagation()}
                  disabled={currentIndex >= Math.max(0, filteredPlayers.length - 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-[200] p-3 rounded-full bg-white/80 text-secondary shadow-lg backdrop-blur-md active:scale-95 disabled:opacity-40"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-12 md:block hidden">
              <p className="text-gray-500 text-lg">No players found matching your criteria.</p>
            </div>
          ) : (
            <div className="hidden md:grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlayers.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="overflow-hidden rounded-[30px] shadow-lg hover:shadow-2xl transition-shadow cursor-pointer">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={player.image}
                        alt={player.name}
                        className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                      />
                      <div className="absolute top-4 right-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {player.jersey}
                      </div>
                      <Badge className={`absolute top-4 left-4 ${getPositionColor(player.position)}`}>
                        {player.position}
                      </Badge>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2 text-secondary">{player.name}</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <div className="text-xs text-gray-500">Age</div>
                          <div className="font-semibold">{player.age} years</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Height</div>
                          <div className="font-semibold">{player.height}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-xs text-gray-500">Goals This Season</div>
                          <div className="font-semibold text-primary text-lg">{player.goals}</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Star Players */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Star Players</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Recognizing outstanding performance and dedication
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 text-center shadow-lg">
              <div className="text-5xl mb-2">🏆</div>
              <h3 className="text-xl font-bold mb-2 text-secondary">Top Scorer</h3>
              <p className="text-lg font-semibold text-primary">Joseph Musa</p>
              <p className="text-sm text-gray-600">15 goals - U10</p>
            </Card>
            <Card className="p-6 text-center shadow-lg">
              <div className="text-5xl mb-2">⭐</div>
              <h3 className="text-xl font-bold mb-2 text-secondary">Most Improved</h3>
              <p className="text-lg font-semibold text-primary">Tobenna Okeke</p>
              <p className="text-sm text-gray-600">U7-U9 Category</p>
            </Card>
            <Card className="p-6 text-center shadow-lg">
              <div className="text-5xl mb-2">🧤</div>
              <h3 className="text-xl font-bold mb-2 text-secondary">Best Goalkeeper</h3>
              <p className="text-lg font-semibold text-primary">Samuel Nwankwo</p>
              <p className="text-sm text-gray-600">10 clean sheets</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
