import { Link } from "react-router";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";
import { Trophy, Users, Calendar, MapPin, CheckCircle2, Phone, Mail } from "lucide-react";

export function BasketballPage() {
  const flyerUrl = `${import.meta.env.BASE_URL}basketball flyer .jpeg`;

  return (
    <div className="bg-white">
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
            <div className="text-sm uppercase tracking-wide text-primary font-semibold mb-3">New Launch</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 italic">Basketball Academy Launch</h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Pegasus Academy is thrilled to announce the launch of its Basketball Academy at Ajah!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/programs">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                  Register Now
                </Button>
              </Link>
              <a href="#details">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white text-white bg-transparent hover:bg-white hover:text-black">
                  Learn More
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section id="details" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={flyerUrl}
                alt="Basketball Academy Flyer"
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-500"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-bold text-secondary mb-4">Hone Your Skills</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Join us as we embark on this incredible journey to develop the next generation of
                  basketball talent in Nigeria! Training is set to commence in **April 2026**,
                  offering aspiring basketball stars a chance to reach new heights in the sport.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary">Ages</h3>
                    <p className="text-gray-600">7 - 17 Years (Boys & Girls)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary">Location</h3>
                    <p className="text-gray-600">Ajah, Lagos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary">Commencement</h3>
                    <p className="text-gray-600">April 2026</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary">Level</h3>
                    <p className="text-gray-600">Beginner to Advanced</p>
                  </div>
                </div>
              </div>

              <Card className="p-6 bg-muted border-none">
                <h3 className="text-xl font-bold text-secondary mb-4">Benefits of Registering</h3>
                <ul className="space-y-3">
                  {[
                    "Qualified & Experienced Basketball Coaches",
                    "Affordable & Qualitative Training Sessions",
                    "Safe & Secure Training Environment",
                    "Structured Development Pathway",
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </Card>

              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">pegasusfcacademy@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">09034630407</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to reach new heights?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Don't miss the chance to be part of our inaugural basketball intake in Ajah.
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

