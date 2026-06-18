import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Users, Calendar, MapPin, CheckCircle2, Phone, Mail, Sparkles, Image as ImageIcon, Camera } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export function BasketballPage() {
  const flyerUrl = `${import.meta.env.BASE_URL}basketball flyer .jpeg`;
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  // Images from the June 5, 2026 Launch
  const launchImages = [
    {
      url: `${import.meta.env.BASE_URL}pegasus archive/We lunched our basketball team 5th of June/image 6.jpeg`,
      alt: "Inaugural Pegasus Basketball Team",
      caption: "Our newly formed basketball team at the launch on June 5th, 2026."
    },
    {
      url: `${import.meta.env.BASE_URL}pegasus archive/We lunched our basketball team 5th of June/image 2.jpeg`,
      alt: "Lagos Youth Training Session",
      caption: "Young athletes showing extreme focus and dedication on training launch day."
    },
    {
      url: `${import.meta.env.BASE_URL}pegasus archive/We lunched our basketball team 5th of June/bball image 3.jpeg`,
      alt: "Coaches & Team Briefing",
      caption: "Coach instructing students on court fundamentals and defensive positions."
    },
    {
      url: `${import.meta.env.BASE_URL}pegasus archive/We lunched our basketball team 5th of June/bball image 4.jpeg`,
      alt: "Dribbling Drills",
      caption: "Students engaging in ball handling and coordination routines."
    },
    {
      url: `${import.meta.env.BASE_URL}pegasus archive/We lunched our basketball team 5th of June/WhatsApp Image 2026-06-12 at 2.46.05 PM.jpeg`,
      alt: "Match Practice Game",
      caption: "Warmup scrimmages to apply learnings in real-game situations."
    }
  ];

  // Selected highlights from the photoshoot unveiling
  const photoshootImages = [
    {
      url: `${import.meta.env.BASE_URL}pegasus archive/Basketball photoshootunveiling/WhatsApp Image 2026-06-12 at 2.51.21 PM.jpeg`,
      alt: "Official Jersey Unveiling Front",
      caption: "Stunning presentation of the new Pegasus home jersey."
    },
    {
      url: `${import.meta.env.BASE_URL}pegasus archive/Basketball photoshootunveiling/WhatsApp Image 2026-06-12 at 2.51.22 PM.jpeg`,
      alt: "Player Photoshoot",
      caption: "Pegasus team players proudly sporting the official orange and black design."
    },
    {
      url: `${import.meta.env.BASE_URL}pegasus archive/Basketball photoshootunveiling/WhatsApp Image 2026-06-12 at 2.51.24 PM (3).jpeg`,
      alt: "Team On Court Focus",
      caption: "Action shots detailing the premium texture of the apparel."
    },
    {
      url: `${import.meta.env.BASE_URL}pegasus archive/Basketball photoshootunveiling/WhatsApp Image 2026-06-12 at 2.51.25 PM (2).jpeg`,
      alt: "Academy Captain Portrait",
      caption: "Instilling discipline, pride, and the winning Pegasus mentality."
    },
    {
      url: `${import.meta.env.BASE_URL}pegasus archive/Basketball photoshootunveiling/WhatsApp Image 2026-06-12 at 2.51.26 PM (2).jpeg`,
      alt: "Official Group Lineup",
      caption: "Our inaugural elite basketball squad posing together."
    },
    {
      url: `${import.meta.env.BASE_URL}pegasus archive/Basketball photoshootunveiling/WhatsApp Image 2026-06-12 at 2.51.27 PM (1).jpeg`,
      alt: "Vibrant Colors",
      caption: "Premium designs crafted for high-performance and flexibility."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-36 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${import.meta.env.BASE_URL}hero-bg.PNG')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/95" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 text-sm uppercase tracking-wider text-primary font-bold mb-4">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Officially Launched
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 italic tracking-tight text-white">
              Elevate Your Game On The Court
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
              Welcome to the elite training grounds of the Pegasus Basketball Academy. Officially launched on June 5, 2026, in Ajah, Lagos, our world-class program is designed to forge technical mastery, tactical brilliance, and championship character in the next generation of court champions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/programs">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                  Register Now
                </Button>
              </Link>
              <a href="#gallery">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white text-white bg-transparent hover:bg-white hover:text-black">
                  View Gallery
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content & Player Photoshoot Image */}
      <section id="details" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={`${import.meta.env.BASE_URL}pegasus archive/Basketball photoshootunveiling/WhatsApp Image 2026-06-12 at 2.51.22 PM.jpeg`}
                alt="Pegasus Basketball Player Photoshoot"
                className="rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform hover:scale-102 transition-transform duration-500 border border-gray-100 object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-bold text-secondary mb-4">Unleash Your Basketball Potential</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Following the spectacular grand launch of our academy team on June 5, 2026, standard coaching is fully underway. Aspiring stars receive structured training on court tactics, physical fitness, mental grit, and team alignment.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary">Ages Welcomed</h3>
                    <p className="text-gray-600">7 - 17 Years (Boys & Girls)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary">Main Court Venue</h3>
                    <p className="text-gray-600">Ajah, Lagos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-lg">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary">Training Commenced</h3>
                    <p className="text-gray-600">June 2026</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2.5 rounded-lg">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary">Skill Progression</h3>
                    <p className="text-gray-600">Inexperienced to Elite</p>
                  </div>
                </div>
              </div>

              <Card className="p-6 bg-muted border-none shadow-sm">
                <h3 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> Premium Academy Perks
                </h3>
                <ul className="space-y-3">
                  {[
                    "Highly Certified & Professional Court Coaches",
                    "Custom Branded Basketball Jerseys and Gear Kits",
                    "State-of-the-Art Safe Indoor/Outdoor Court Access",
                    "Elite Pathway for International Opportunities",
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </Card>

              <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-gray-700 font-medium">pegasusfcacademy@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-gray-700 font-medium">09034630407</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Photo Galleries & Tabs */}
      <section id="gallery" className="py-16 md:py-24 bg-muted/50 border-t border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl font-bold text-secondary mb-4 flex items-center justify-center gap-2">
              <Camera className="w-8 h-8 text-primary" /> Basketball Media Hub
            </h2>
            <p className="text-lg text-gray-600">
              Browse professional photos from our official launching event and the stunning player jersey unveiling photoshoot.
            </p>
          </div>

          <Tabs defaultValue="launch" className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-8">
              <TabsList className="bg-white border p-1 rounded-xl shadow-sm">
                <TabsTrigger value="launch" className="flex items-center gap-2 px-5 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Sparkles className="w-4 h-4" /> Grand Team Launch
                </TabsTrigger>
                <TabsTrigger value="unveiling" className="flex items-center gap-2 px-5 py-2.5 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
                  <ImageIcon className="w-4 h-4" /> Unveiling Photoshoot
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="launch">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {launchImages.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100"
                    onClick={() => setActivePhoto(img.url)}
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5" /> Enlarge Photo
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-secondary mb-1">{img.alt}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2">{img.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="unveiling">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photoshootImages.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100"
                    onClick={() => setActivePhoto(img.url)}
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5" /> Enlarge Photo
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-secondary mb-1">{img.alt}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2">{img.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-4xl max-h-[85vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activePhoto}
                alt="Enlarged gallery view"
                className="max-w-full max-h-[80vh] rounded-xl shadow-2xl border border-white/10"
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 bg-white/10 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to reach new heights?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Take part in our standard academy sessions. Register for the upcoming intake in Ajah.
          </p>
          <Link to="/programs">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-10">
              Register Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

