import { Card } from "../components/ui/card";
import { Target, Eye, Heart, Award, Users, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

export function AboutPage() {
  const timeline = [
    {
      year: "2023",
      title: "Foundation",
      description: "Pegasus Football Academy founded by Martins Imabeh in Badore, Ajah",
    },
    {
      year: "2023",
      title: "First Enrollment",
      description: "Successfully enrolled 150+ players across 6 age categories",
    },
    {
      year: "2024",
      title: "Competitive Entry",
      description: "Participated in Lagos Junior Football League and local tournaments",
    },
    {
      year: "2025",
      title: "Championship Success",
      description: "U10 team won Badore Community Cup, expanding to 200+ players",
    },
  ];

  const philosophy = [
    {
      icon: Target,
      title: "Technical Excellence",
      description: "Master the fundamentals of football through structured drills and practice",
    },
    {
      icon: Award,
      title: "Tactical Intelligence",
      description: "Understand game situations and develop strategic thinking",
    },
    {
      icon: TrendingUp,
      title: "Physical Fitness",
      description: "Build strength, speed, agility, and endurance for peak performance",
    },
    {
      icon: Heart,
      title: "Mental Strength",
      description: "Develop confidence, resilience, and competitive spirit",
    },
    {
      icon: Users,
      title: "Character Building",
      description: "Instill discipline, teamwork, respect, and leadership qualities",
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Pegasus Football Academy</h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Empowering Lagos youth through professional football training since 2023
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold mb-6 text-secondary">Our Story</h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  Founded in 2023 by President Martins Imabeh, Pegasus Football Academy was born from a
                  vision to provide world-class football training to the youth of Badore, Ajah, and the
                  greater Lekki area of Lagos, Nigeria.
                </p>
                <p>
                  What started as a single team has grown into a thriving academy with six age
                  categories (U7 to U16) and over 200 active players. Our mission has always been clear:
                  to discover, nurture, and develop raw football talent while building strong character
                  and discipline in our young athletes.
                </p>
                <p>
                  Located in the heart of Badore, Ajah, we conduct training every Friday and Saturday,
                  providing accessible, high-quality football education to the community. Our motto,
                  "Conquer Our Opponents," reflects our commitment to excellence both on and off the pitch.
                </p>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h3 className="text-3xl font-bold mb-8 text-secondary">Our Journey</h3>
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {item.year}
                      </div>
                    </div>
                    <div className="flex-1 pb-8 border-l-2 border-gray-200 pl-6 -mt-2">
                      <h4 className="text-xl font-bold mb-2 text-secondary">{item.title}</h4>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <Card className="p-8 h-full shadow-lg">
                <Eye className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Our Vision</h3>
                <p className="text-lg text-gray-700">
                  To be Lagos' premier football academy producing world-class players who excel in
                  professional football and serve as role models in their communities.
                </p>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <Card className="p-8 h-full shadow-lg">
                <Target className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-secondary">Our Mission</h3>
                <p className="text-lg text-gray-700">
                  To nurture young talent through professional coaching, structured training, and
                  character development, creating champions both on and off the football pitch.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Pegasus Philosophy */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
              The Pegasus Philosophy
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive approach to player development
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {philosophy.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <item.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3 text-secondary">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Our Leadership</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the visionaries behind Pegasus Football Academy
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-xl">
              <div className="grid md:grid-cols-5 gap-8 p-8">
                <div className="md:col-span-2">
                  <img
                    src="/president.jpg"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/president-photo.svg";
                    }}
                    alt="Martins Imabeh"
                    className="rounded-lg w-full aspect-square object-cover"
                  />
                </div>
                <div className="md:col-span-3">
                  <div className="text-sm uppercase tracking-wide text-primary font-semibold mb-2">
                    President & Founder
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-secondary">Martins Imabeh</h3>
                  <p className="text-gray-700 mb-4">
                    Martins Imabeh founded Pegasus Football Academy in 2023 with a clear vision: to
                    provide professional football training to the youth of Badore and surrounding
                    communities in Lagos.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Under his leadership, the academy has grown from a single team to six age
                    categories, serving over 200 young athletes. His commitment to excellence and
                    character development has made Pegasus a respected name in Lagos youth football.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><strong>Email:</strong> pegasusfcacademy@gmail.com</div>
                    <div><strong>Phone:</strong> +234-9034-6304-07</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">Our Facilities</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Modern training facilities in the heart of Badore, Ajah
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1651043421470-88b023bb9636?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHBpdGNoJTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzE0NTM0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Training Pitch"
                className="w-full aspect-video object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-secondary">Training Pitch</h3>
                <p className="text-gray-600">
                  Quality grass pitch with proper markings and goals for authentic match experience
                </p>
              </div>
            </Card>
            <Card className="overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1623596146585-29891bcf8e4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHRyYWluaW5nJTIwZXF1aXBtZW50JTIwZmllbGR8ZW58MXx8fHwxNzcxNTEyMDM2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Training Equipment"
                className="w-full aspect-video object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-secondary">Modern Equipment</h3>
                <p className="text-gray-600">
                  Professional-grade training equipment including cones, bibs, and balls
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
