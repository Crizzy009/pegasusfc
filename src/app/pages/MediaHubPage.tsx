import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { Calendar, Eye, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import { usePublicContent } from "../content/useContent";
import type { MediaPhoto, NewsPost, MediaVideo } from "../content/types";
import { getVideoEmbedUrl } from "../lib/video";

function SafeImage({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const placeholder = `${import.meta.env.BASE_URL}placeholders/photo.svg`;

  useEffect(() => {
    setError(false);
  }, [src]);

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setError(false);
    setRetryCount(prev => prev + 1);
  };

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-muted gap-2 p-4 ${className}`}>
        <img src={placeholder} alt="Error placeholder" className="w-12 h-12 opacity-50" />
        <button 
          onClick={handleRetry}
          className="text-xs flex items-center gap-1 text-primary hover:underline"
        >
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </div>
    );
  }

  return (
    <img
      src={retryCount > 0 ? `${src}?retry=${retryCount}` : src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

export function MediaHubPage() {
  const { data: photosData } = usePublicContent<MediaPhoto>("mediaPhoto");
  const { data: newsData } = usePublicContent<NewsPost>("newsPost");
  const { data: videosData } = usePublicContent<MediaVideo>("mediaVideo");

  const placeholderPhotoUrl = `${import.meta.env.BASE_URL}placeholders/photo.svg`;

  const videos: MediaVideo[] = [
    {
      title: "Congratulations on your success \"PEDRO CARRENA\" 100 Goals Milestone",
      category: "Milestone",
      date: "2026",
      videoUrl: "https://youtube.com/shorts/oQW8nfkT9vo?si=zgqp9eeDXWTNpx7I",
      platform: "youtube",
    },
    {
      title: "RYAN DICKSON INTERVIEW AFTER THE SCOUTING PROGRAM",
      category: "Interview",
      date: "2026",
      videoUrl: "https://youtu.be/0bTj7_QmW_Q?si=SIBMQXAsukhu32Af",
      platform: "youtube",
    },
    {
      title: "SCOUTS FROM ENGLAND",
      category: "Scouting",
      date: "2026",
      videoUrl: "https://youtu.be/bPckYiFCCIM?si=AsubYpvCX3llFuHM",
      platform: "youtube",
    },
    {
      title: "PEGASUS ACADEMY BASKETBALL TEAM TRAINING",
      category: "Basketball",
      date: "2026",
      videoUrl: "https://youtu.be/57ly26n3wJo?si=knpTV4LZ3ASVICN2",
      platform: "youtube",
    },
    {
      title: "Training time - Agility, strength, endurance & ball mastery",
      category: "Training",
      date: "2026",
      videoUrl: "https://youtu.be/brUxA4v6hx4?si=STF-vB1FK2HijoZw",
      platform: "youtube",
    },
    {
      title: "Beautiful solo goal from our 14 years old \"FRIDAY EWUNTIN\"",
      category: "Match Highlight",
      date: "2026",
      videoUrl: "https://youtu.be/v9yGJg6DJPA?si=v03cYn9az4tY2Kd3",
      platform: "youtube",
    },
    {
      title: "BEYOND LIMITS - PEGASUS ACADEMY",
      category: "Media",
      date: "2026",
      videoUrl: "https://youtu.be/VtfONgiA338?si=t_demn-ipCEDZMxM",
      platform: "youtube",
    },
    {
      title: "Training time - Under 6",
      category: "Training",
      date: "2026",
      videoUrl: "https://youtu.be/HrjyqjsGYiQ?si=3fyQa6asXccNuaxe",
      platform: "youtube",
    },
    {
      title: "Training time - Under 10",
      category: "Training",
      date: "2026",
      videoUrl: "https://youtu.be/vy5ahJsy-Zc?si=azFxKW2C611bVSlC",
      platform: "youtube",
    },
    {
      title: "Training time - Under 12",
      category: "Training",
      date: "2026",
      videoUrl: "https://youtu.be/GkRXuMKBNlY?si=BjRVtXbxy-AbqAQW",
      platform: "youtube",
    },
    {
      title: "MRS CHIGOZIE",
      category: "Interview",
      date: "2026",
      videoUrl: "https://youtu.be/PTvjJElAX68?si=DyhHI2Ic74zOZO5F",
      platform: "youtube",
    },
    {
      title: "HANNIEL IFEOLUWA TIJANI",
      category: "Interview",
      date: "2026",
      videoUrl: "https://youtu.be/hH5zRQzWDgY?si=WFfJkdvqIkLwwELm",
      platform: "youtube",
    },
    {
      title: "SCOUTING PROGRAM (first)",
      category: "Scouting",
      date: "2026",
      videoUrl: "https://youtube.com/shorts/O3bOWFMQmOA?si=Nm-EiRon9e2-XhMh",
      platform: "youtube",
    },
    {
      title: "SCOUTING PROGRAM (second)",
      category: "Scouting",
      date: "2026",
      videoUrl: "https://youtube.com/shorts/_AKhUOEdvsM?si=es7trA2bSXzEYuKj",
      platform: "youtube",
    },
    {
      title: "Pegasus Sports Academy top-notch facilities",
      category: "Facilities",
      date: "2026",
      videoUrl: "https://youtu.be/_PFKOfk5sgM?si=GMxIJBxJmiPQeU-g",
      platform: "youtube",
    },
  ];

  const videoItems = [
    ...videosData.map(v => ({ ...v, order: v.order ?? 999 })),
    ...videos.map((v, i) => ({ ...v, order: v.order ?? (i + 1000) }))
  ].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const photos = [
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/PEDRO CARRENA 100 Goals Milestone/WhatsApp Image 2026-06-12 at 2.43.57 PM.jpeg`,
      category: "Milestone",
      title: "Pedro Carrena 100 Goals Celebration",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/PEDRO CARRENA 100 Goals Milestone/WhatsApp Image 2026-06-12 at 2.43.57 PM (1).jpeg`,
      category: "Milestone",
      title: "Martins Imabeh presenting award to Pedro Carrena",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/Scout game from WolverhampthonWanderers and Brentforf FC in England/WhatsApp Image 2026-06-12 at 2.43.58 PM.jpeg`,
      category: "Scouting",
      title: "Wolverhampton & Brentford English Scouts at Pegasus",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/Scout game from WolverhampthonWanderers and Brentforf FC in England/WhatsApp Image 2026-06-12 at 2.44.00 PM (4).jpeg`,
      category: "Scouting",
      title: "High intensity trial matches for EPL scouts",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/Pictures from our last game against beyond limits in Ogun state/WhatsApp Image 2026-06-12 at 2.55.39 PM (3).jpeg`,
      category: "Matches",
      title: "Beyond Limits vs Pegasus action in Ogun State",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/Pictures from our last game against beyond limits in Ogun state/WhatsApp Image 2026-06-12 at 2.55.40 PM.jpeg`,
      category: "Matches",
      title: "Pegasus team setup against Beyond Limits",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/We lunched our basketball team 5th of June/image 6.jpeg`,
      category: "Basketball",
      title: "Inaugural Basketball Squad Official Launch",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/Basketball photoshootunveiling/WhatsApp Image 2026-06-12 at 2.51.21 PM.jpeg`,
      category: "Basketball",
      title: "Basketball Jersey Unveiling",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/pegasus moments/WhatsApp Image 2026-06-12 at 2.43.48 PM.jpeg`,
      category: "Training",
      title: "Agility & coordination drills on the pitch",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/pegasus moments/WhatsApp Image 2026-06-12 at 2.43.51 PM (3).jpeg`,
      category: "Training",
      title: "Coaches briefing players before tactical drills",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/ogeneyi.jpeg`,
      category: "Special Guest",
      title: "Ogenyi Onazi with Academy Players",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/ogeneyi 1.jpeg`,
      category: "Special Guest",
      title: "Super Eagle Ogenyi Onazi Visit",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/ogeneyi 3.jpeg`,
      category: "Special Guest",
      title: "Ogenyi Onazi Inspiring Young Talents",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/rising stars project .jpeg`,
      category: "Launch",
      title: "The Rising Stars Project NGO Launch",
    },
    {
      src: `${import.meta.env.BASE_URL}placeholders/pegasus archive/WhatsApp Image 2026-03-24 at 10.13.39 AM.jpeg`,
      category: "Special Guest",
      title: "Osinachi Ohale Visit with Academy",
    },
    {
      src: `${import.meta.env.BASE_URL}placeholders/pegasus archive/WhatsApp Image 2026-03-24 at 10.13.41 AM.jpeg`,
      category: "Special Guest",
      title: "Osinachi Ohale with Young Stars",
    },
    {
      src: `${import.meta.env.BASE_URL}placeholders/pegasus archive/WhatsApp Image 2026-03-24 at 10.13.41 AM (1).jpeg`,
      category: "Special Guest",
      title: "Osinachi Ohale at Pegasus",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/youth fun league 2024.jpeg`,
      category: "Champions",
      title: "Youth Fun League 2024 - Term 2 Champions",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/youth fun league 2024 1.jpeg`,
      category: "Match Day",
      title: "YFL 2024 Squad Photo",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/youth fun league 4.jpeg`,
      category: "Trophy",
      title: "Lifting the YFL 2024 Trophy",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/youth .jpeg`,
      category: "Tournament",
      title: "NFE Youth Cup 2025 Squad",
    },
    {
      src: `${import.meta.env.BASE_URL}pegasus archive/infifity.jpeg`,
      category: "Expansion",
      title: "New Branch: Infinity Estate",
    },
    {
      src: `${import.meta.env.BASE_URL}basketball flyer .jpeg`,
      category: "Launch",
      title: "Basketball Academy Ajah",
    },
  ];


  const isTechnicalCaption = (text?: string) => {
    if (!text) return false;
    const t = text.trim();
    // Check for UUIDs (with hyphens or spaces), long strings of hex/random chars, or filenames
    const uuidRegex = /^[0-9a-f]{8}[\s-][0-9a-f]{4}[\s-][0-9a-f]{4}[\s-][0-9a-f]{4}[\s-][0-9a-f]{12}$/i;
    const technicalRegex = /^[0-9a-f\s-]{15,}$/i;
    return uuidRegex.test(t) || technicalRegex.test(t) || t.includes('.jpg') || t.includes('.png');
  };

  const photoItems = [
    ...photosData.map((p) => {
      const cleanTitle = isTechnicalCaption(p.title) ? "Pegasus moments" : (p.title || "Pegasus moments");
      const cleanCaption = isTechnicalCaption(p.caption) ? "" : (p.caption || "");
      
      return {
        src: p.image.mediumUrl || p.image.largeUrl || p.image.originalUrl,
        category: p.category,
        title: cleanTitle,
        caption: cleanCaption,
        order: p.order ?? 100,
      };
    }),
    ...photos.map((p, index) => ({
      ...p,
      order: p.order ?? (index * 0.1 + 200),
    })),
  ].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const newsItems = (
    newsData.length > 0 && newsData.some((n) => n.title.includes("Osinachi Ohale"))
      ? newsData.map((n) => ({
          date: n.date,
          title: n.title,
          excerpt: n.excerpt,
          image: n.image.url,
        }))
      : [
          {
            date: "June 2026",
            title: "Mr. Deji Daniel Appointed Sporting & Technical Director",
            excerpt:
              "We are pleased to announce the appointment of Mr. Deji Daniel as the new Sporting and Technical Director of Pegasus Sports Academy, effective immediately. He will oversee our sporting programs, coaching structure, player development pathways, and overall technical direction.",
            image: `${import.meta.env.BASE_URL}deji sporting dir.jpeg`,
          },
          {
            date: "2025",
            title: "Super Eagle Ogenyi Onazi Visits Pegasus",
            excerpt:
              "We were thrilled to welcome Super Eagles midfielder Ogenyi Onazi to our academy for a special training and inspiration session.",
            image: `${import.meta.env.BASE_URL}pegasus archive/ogeneyi 1.jpeg`,
          },
          {
            date: "2025",
            title: "The Rising Stars Project Launch with Pegasus",
            excerpt:
              "A huge thank you to The Rising Stars Project for traveling from the USA to officially launch their NGO with Pegasus Football Academy!",
            image: `${import.meta.env.BASE_URL}pegasus archive/rising star projects.jpeg`,
          },
          {
            date: "March 2026",
            title: "Super Falcon Osinachi Ohale Visits Pegasus Academy",
            excerpt:
              "Professional defender Osinachi Ohale visited our academy to inspire the next generation of football stars.",
            image: `${import.meta.env.BASE_URL}placeholders/pegasus archive/WhatsApp Image 2026-03-24 at 10.13.39 AM.jpeg`,
          },
          {
            date: "March 2026",
            title: "Expanding the Legacy: New Branch at Infinity Estate",
            excerpt:
              "Pegasus Football Academy is coming to Infinity Estate, Addo Road, Ajah! Expanding our mission to nurture young talent.",
            image: `${import.meta.env.BASE_URL}pegasus archive/infifity.jpeg`,
          },
          {
            date: "March 2026",
            title: "Basketball Academy Launch in Ajah",
            excerpt:
              "Pegasus Academy is thrilled to announce the launch of its Basketball Academy at Ajah! Training commences April 2026 for boys and girls aged 7-17.",
            image: `${import.meta.env.BASE_URL}basketball flyer .jpeg`,
          },
          ...newsData.map((n) => ({
            date: n.date,
            title: n.title,
            excerpt: n.excerpt,
            image: n.image.url,
          })),
        ]
  );

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
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12">
              <TabsTrigger value="photos">Photo Gallery</TabsTrigger>
              <TabsTrigger value="videos">Video Gallery</TabsTrigger>
              <TabsTrigger value="news">News & Updates</TabsTrigger>
            </TabsList>

            <TabsContent value="videos" className="space-y-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {videoItems.map((video, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                      <div className="aspect-video relative group">
                        <iframe
                          src={getVideoEmbedUrl(video.videoUrl)}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-primary uppercase">
                            {video.category}
                          </span>
                          <span className="text-xs text-gray-500">{video.date}</span>
                        </div>
                        <h3 className="text-lg font-bold text-secondary">{video.title}</h3>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="photos" className="space-y-8">
              <div className="sm:hidden">
                <Carousel opts={{ align: "start", loop: false }} className="px-2">
                  <CarouselContent className="-ml-3">
                    {photoItems.map((photo, index) => (
                      <CarouselItem key={index} className="pl-3 basis-[85%]">
                        <Card className="overflow-hidden shadow-lg cursor-pointer">
                          <div className="aspect-square overflow-hidden relative">
                            <SafeImage src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                              <div className="text-white">
                                <div className="text-xs font-semibold mb-1">{photo.category}</div>
                                <div className="text-sm font-bold">{photo.title}</div>
                                {photo.caption && <div className="text-xs mt-1 opacity-90">{photo.caption}</div>}
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
                        <SafeImage
                          src={photo.src}
                          alt={photo.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <div className="text-white">
                            <div className="text-xs font-semibold mb-1">{photo.category}</div>
                            <div className="text-sm font-bold">{photo.title}</div>
                            {photo.caption && <div className="text-xs mt-1 opacity-90">{photo.caption}</div>}
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
                          <SafeImage
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover object-top transition-transform hover:scale-110 duration-500"
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
