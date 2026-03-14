import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Calendar, Eye } from "lucide-react";
import { motion } from "motion/react";

export function MediaHubPage() {
  const photos = [
    {
      src: "https://images.unsplash.com/photo-1731673092066-cff4ea887d57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwc29jY2VyJTIwcHJhY3RpY2UlMjBkcmlsbHN8ZW58MXx8fHwxNzcxNTEyMDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Training",
      title: "Saturday Skills Session",
    },
    {
      src: "https://images.unsplash.com/photo-1764438344341-d4700ad674f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBnb2FsJTIwY2VsZWJyYXRpb24lMjB0ZWFtfGVufDF8fHx8MTc3MTUxMjAzNnww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Match",
      title: "U10 Championship Celebration",
    },
    {
      src: "https://images.unsplash.com/photo-1762053275412-03726506562a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBjb2FjaGluZyUyMHNlc3Npb24lMjB5b3V0aHxlbnwxfHx8fDE3NzE1MTIwOTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Training",
      title: "Coaching Masterclass",
    },
    {
      src: "https://images.unsplash.com/photo-1762013315117-1c8005ad2b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMG1hdGNoJTIwYWN0aW9uJTIwc3RhZGl1bXxlbnwxfHx8fDE3NzE1MTIyMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Match",
      title: "Match Day Action",
    },
    {
      src: "https://images.unsplash.com/photo-1770237711414-e91a21755b4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3V0aCUyMHNvY2NlciUyMHRyYWluaW5nJTIwYWN0aW9ufGVufDF8fHx8MTc3MTUxMjAzNXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Training",
      title: "Youth Development Program",
    },
    {
      src: "https://images.unsplash.com/photo-1764438246710-83c535cada80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjB0ZWFtJTIwZ3JvdXAlMjBwaG90b3xlbnwxfHx8fDE3NzE0NTEwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Events",
      title: "Team Photo Day",
    },
  ];

  const news = [
    {
      date: "Feb 15, 2026",
      title: "U10 Squad Wins Badore Community Cup",
      excerpt: "In an exciting final, our U10 team secured a 3-1 victory to claim the championship trophy.",
      image: "https://images.unsplash.com/photo-1764408721535-2dcb912db83e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waHklMjBmb290YmFsbCUyMGNoYW1waW9uc2hpcHxlbnwxfHx8fDE3NzE1MTIyMTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      date: "Feb 10, 2026",
      title: "Registration Open for New Term",
      excerpt: "We're accepting new registrations for all age categories. Limited spaces available!",
      image: "https://images.unsplash.com/photo-1623596146585-29891bcf8e4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHRyYWluaW5nJTIwZXF1aXBtZW50JTIwZmllbGR8ZW58MXx8fHwxNzcxNTEyMDM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      date: "Jan 28, 2026",
      title: "5 Players Selected for State Trials",
      excerpt: "Congratulations to our talented athletes chosen to represent Lagos State at U15 level.",
      image: "https://images.unsplash.com/photo-1769383924825-44706af97281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHNvY2NlciUyMHBsYXllciUyMGFjdGlvbiUyMHNob3R8ZW58MXx8fHwxNzcxNTEyMjEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.jpg'), url('/hero-bg.svg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Media Hub</h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Photos, videos, and latest news from Pegasus Football Academy
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="photos" className="max-w-7xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="photos">Photo Gallery</TabsTrigger>
              <TabsTrigger value="news">News & Updates</TabsTrigger>
            </TabsList>

            <TabsContent value="photos" className="space-y-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer">
                      <div className="aspect-square overflow-hidden relative group">
                        <img
                          src={photo.src}
                          alt={photo.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <div className="text-white">
                            <div className="text-xs font-semibold mb-1">{photo.category}</div>
                            <div className="text-sm">{photo.title}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="news" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((article, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow cursor-pointer">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                          <Calendar className="w-4 h-4" />
                          {article.date}
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-secondary">{article.title}</h3>
                        <p className="text-gray-600 mb-4">{article.excerpt}</p>
                        <button className="text-primary font-semibold hover:underline flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          Read More
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Social Media Integration */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Follow Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay connected with daily updates and behind-the-scenes content
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 text-center shadow-lg">
              <div className="text-5xl mb-4">📘</div>
              <h3 className="text-2xl font-bold mb-4 text-secondary">Facebook</h3>
              <p className="text-gray-600 mb-6">
                Follow our page for match updates, photos, and announcements
              </p>
              <a
                href="https://facebook.com/share/1ZmkJ86wXN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Follow on Facebook
              </a>
            </Card>
            <Card className="p-8 text-center shadow-lg">
              <div className="text-5xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold mb-4 text-secondary">TikTok</h3>
              <p className="text-gray-600 mb-6">
                Watch training videos, goals, and fun moments from the academy
              </p>
              <a
                href="https://www.tiktok.com/@pegasus_football_academy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition"
              >
                Follow on TikTok
              </a>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
