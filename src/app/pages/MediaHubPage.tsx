import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { Calendar, Eye } from "lucide-react";
import { motion } from "motion/react";
import { usePublicContent } from "../content/useContent";
import type { MediaPhoto, NewsPost } from "../content/types";

export function MediaHubPage() {
  const { data: photosData } = usePublicContent<MediaPhoto>("mediaPhoto");
  const { data: newsData } = usePublicContent<NewsPost>("newsPost");

  const placeholderPhotoUrl = `${import.meta.env.BASE_URL}placeholders/photo.svg`;

  const photos = [
    {
      src: placeholderPhotoUrl,
      category: "Training",
      title: "Saturday Skills Session",
    },
    {
      src: placeholderPhotoUrl,
      category: "Match",
      title: "U10 Championship Celebration",
    },
    {
      src: placeholderPhotoUrl,
      category: "Training",
      title: "Coaching Masterclass",
    },
    {
      src: placeholderPhotoUrl,
      category: "Match",
      title: "Match Day Action",
    },
    {
      src: placeholderPhotoUrl,
      category: "Training",
      title: "Youth Development Program",
    },
    {
      src: placeholderPhotoUrl,
      category: "Events",
      title: "Team Photo Day",
    },
  ];


  const photoItems = photosData.length
    ? photosData.map((p) => ({
        src: p.image.mediumUrl || p.image.largeUrl || p.image.originalUrl,
        category: p.category,
        title: p.title,
      }))
    : photos;

  const newsItems = newsData.map((n) => ({
    date: n.date,
    title: n.title,
    excerpt: n.excerpt,
    image: n.image.url,
  }));

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${import.meta.env.BASE_URL}hero-bg.PNG')` }}
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
              <div className="sm:hidden">
                <Carousel opts={{ align: "start", loop: false }} className="px-2">
                  <CarouselContent className="-ml-3">
                    {photoItems.map((photo, index) => (
                      <CarouselItem key={index} className="pl-3 basis-[85%]">
                        <Card className="overflow-hidden shadow-lg cursor-pointer">
                          <div className="aspect-square overflow-hidden relative">
                            <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                              <div className="text-white">
                                <div className="text-xs font-semibold mb-1">{photo.category}</div>
                                <div className="text-sm">{photo.title}</div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 bg-white/80 text-secondary shadow-lg backdrop-blur-md" />
                  <CarouselNext className="right-2 top-1/2 -translate-y-1/2 bg-white/80 text-secondary shadow-lg backdrop-blur-md" />
                </Carousel>
              </div>

              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photoItems.map((photo, index) => (
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
              {newsItems.length === 0 ? (
                <div className="text-center py-12 text-gray-600">
                  No news updates yet.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {newsItems.map((article, index) => (
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
              )}
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
            <Card className="p-8 text-center shadow-lg h-full flex flex-col">
              <div className="text-5xl mb-4">📘</div>
              <h3 className="text-2xl font-bold mb-4 text-secondary">Facebook</h3>
              <p className="text-gray-600 mb-6">
                Follow our page for match updates, photos, and announcements
              </p>
              <a
                href="https://facebook.com/share/1ZmkJ86wXN"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition mt-auto"
              >
                Follow on Facebook
              </a>
            </Card>
            <Card className="p-8 text-center shadow-lg h-full flex flex-col">
              <div className="text-5xl mb-4">🎵</div>
              <h3 className="text-2xl font-bold mb-4 text-secondary">TikTok</h3>
              <p className="text-gray-600 mb-6">
                Watch training videos, goals, and fun moments from the academy
              </p>
              <a
                href="https://www.tiktok.com/@pegasus_football_academy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition mt-auto"
              >
                Follow on TikTok
              </a>
            </Card>
            <Card className="p-8 text-center shadow-lg h-full flex flex-col">
              <div className="text-5xl mb-4">📸</div>
              <h3 className="text-2xl font-bold mb-4 text-secondary">Instagram</h3>
              <p className="text-gray-600 mb-6">
                Behind-the-scenes photos, training highlights, and academy moments
              </p>
              <a
                href="https://www.instagram.com/pegasus_football_academy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition mt-auto"
              >
                Follow on Instagram
              </a>
            </Card>
            <Card className="p-8 text-center shadow-lg h-full flex flex-col">
              <div className="text-5xl mb-4">▶️</div>
              <h3 className="text-2xl font-bold mb-4 text-secondary">YouTube</h3>
              <p className="text-gray-600 mb-6">
                Watch match clips, training sessions, and player development content
              </p>
              <a
                href="https://www.youtube.com/@PegasuscfAcademy-om9wh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition mt-auto"
              >
                Subscribe on YouTube
              </a>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
