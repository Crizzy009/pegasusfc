import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Trophy, Users, MapPin, GraduationCap, Target, Heart, Award, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { usePublicContent } from "../content/useContent";
import type { HomeHighlight, HomeTeam } from "../content/types";

export function HomePage() {
  const { data: homeTeams } = usePublicContent<HomeTeam>("homeTeam");
  const { data: homeHighlights } = usePublicContent<HomeHighlight>("homeHighlight");

  const placeholderPhotoUrl = `${import.meta.env.BASE_URL}placeholders/photo.svg`;

  const stats = [
    { label: "Players Trained", value: "150+", icon: Users },
    { label: "Age Categories", value: "6 Teams", icon: Trophy },
    { label: "Training Days", value: "Fri & Sat", icon: Calendar },
    { label: "Location", value: "Badore, Ajah", icon: MapPin },
  ];

  const programs = [
    {
      title: "U7 & U9",
      subtitle: "Foundation Program",
      ages: "6-9 years",
      focus: "Fun & Fundamentals",
      time: "4:00 PM - 5:00 PM",
      color: "from-orange-400 to-orange-600",
    },
    {
      title: "U10",
      subtitle: "Development Squad",
      ages: "10 years",
      focus: "Skill Development",
      time: "5:00 PM - 6:00 PM",
      color: "from-orange-500 to-orange-700",
    },
    {
      title: "U11-U13",
      subtitle: "Junior Academy",
      ages: "11-13 years",
      focus: "Tactical Awareness",
      time: "5:00 PM - 6:30 PM",
      color: "from-orange-600 to-orange-800",
    },
    {
      title: "U14-U16",
      subtitle: "Youth Elite",
      ages: "14-16 years",
      focus: "Elite Performance",
      time: "6:00 PM - 7:30 PM",
      color: "from-orange-700 to-orange-900",
    },
  ];

  const programCards = (homeTeams.length ? homeTeams : programs.map((p) => ({
    title: p.title,
    subtitle: p.subtitle,
    ages: p.ages,
    focus: p.focus,
    time: p.time,
    days: "Friday & Saturday",
    trainerName: "",
    trainerTitle: "",
    trainerPhotoUrl: "",
    order: 0,
  }))).map((p, index) => {
    const colors = [
      "from-orange-400 to-orange-600",
      "from-orange-500 to-orange-700",
      "from-orange-600 to-orange-800",
      "from-orange-700 to-orange-900",
    ];
    return {
      ...p,
      color: colors[index % colors.length],
    };
  });

  const features = [
    {
      icon: Trophy,
      title: "Professional Coaching",
      description: "CAF-certified coaches with proven track records",
    },
    {
      icon: MapPin,
      title: "Prime Location",
      description: "Modern facilities in Badore, Ajah, Lekki",
    },
    {
      icon: Target,
      title: "Modern Facilities",
      description: "Quality training equipment and safe environment",
    },
    {
      icon: GraduationCap,
      title: "Holistic Development",
      description: "Technical skills, character building, and discipline",
    },
  ];

  const highlights = [
    {
      title: "U10 Champions",
      description: "Badore Community Cup Winners 2025",
      image: placeholderPhotoUrl,
    },
    {
      title: "200+ Active Players",
      description: "Growing community across all age groups",
      image: placeholderPhotoUrl,
    },
    {
      title: "Lagos State Trials",
      description: "5 players selected for U15 trials",
      image: placeholderPhotoUrl,
    },
  ];

  const highlightCards = homeHighlights.length
    ? homeHighlights.map((h) => ({ title: h.title, description: h.description, image: h.image.url }))
    : highlights;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${import.meta.env.BASE_URL}hero-bg.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/90" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 uppercase tracking-wide">
              Conquer Our Opponents
            </h1>
            <div className="text-xl md:text-3xl mb-6 text-primary italic font-semibold">
              Pegasus Football Academy
            </div>
            <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
              Forging Lagos' Next Football Champions Since 2023
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/programs">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                  Register Now
                </Button>
              </Link>
              <Link to="/recruitment">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white text-white bg-transparent hover:bg-white hover:text-black">
                  Book a Trial
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-secondary text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* President's Welcome Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={`${import.meta.env.BASE_URL}president.jpg`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = `${import.meta.env.BASE_URL}president-photo.svg`;
                }}
                alt="Martins Imabeh - President"
                className="rounded-lg shadow-2xl w-full object-cover aspect-[4/5]"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-sm uppercase tracking-wide text-primary font-semibold mb-2">
                Message from the President
              </div>
              <h2 className="text-4xl font-bold mb-6 text-secondary">Welcome to Pegasus</h2>
              <blockquote className="text-lg text-gray-700 italic mb-6 border-l-4 border-primary pl-6">
                "At Pegasus Football Academy, we don't just train players; we build champions who
                conquer on and off the pitch. Since 2023, we've been committed to discovering and
                nurturing raw talent in Badore and beyond."
              </blockquote>
              <div className="mb-6">
                <div className="font-bold text-xl text-secondary">Martins Imabeh</div>
                <div className="text-primary font-semibold">President, Pegasus Football Academy</div>
              </div>
              <Link to="/about">
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                  Read Full Story
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Our Teams</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional training programs for every age group, every Friday and Saturday
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programCards.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <Card className={`p-6 bg-gradient-to-br ${program.color} text-white h-full shadow-lg hover:shadow-2xl transition-shadow cursor-pointer`}>
                  <div className="text-3xl font-bold mb-2">{program.title}</div>
                  <div className="text-lg mb-4 opacity-90">{program.subtitle}</div>
                  <div className="space-y-2 text-sm">
                    <div><strong>Ages:</strong> {program.ages}</div>
                    <div><strong>Focus:</strong> {program.focus}</div>
                    <div><strong>Time:</strong> {program.time}</div>
                    <div className="pt-2">
                      <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs">
                        Fri - Sat
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/programs">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                View All Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Pegasus */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Why Choose Pegasus</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Excellence in youth football development with a proven track record
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-secondary">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Highlights */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Recent Highlights</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Celebrating our achievements and milestones
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {highlightCards.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -5 }}
              >
                <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={highlight.image}
                      alt={highlight.title}
                      className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-secondary">{highlight.title}</h3>
                    <p className="text-gray-600">{highlight.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/hall-of-fame">
              <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                View All Achievements
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Trophy className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Conquer? Join Pegasus Today!
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Start your journey to becoming a football champion. Training every Friday & Saturday in Badore, Ajah.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/programs">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg">
                  Enroll Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary px-8 py-6 text-lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
