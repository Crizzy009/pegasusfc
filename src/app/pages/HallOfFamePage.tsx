import { Card } from "../components/ui/card";
import { Trophy, Award, Star, TrendingUp, Users, Target } from "lucide-react";
import { motion } from "motion/react";

export function HallOfFamePage() {
  const achievements2023 = [
    { icon: Star, text: "Academy successfully launched in Badore, Ajah" },
    { icon: Users, text: "Enrolled 150+ players across 6 age categories" },
    { icon: Target, text: "Established training facility in Lekki axis" },
    { icon: TrendingUp, text: "Partnered with local schools for talent identification" },
    { icon: Trophy, text: "Hosted inaugural Pegasus Open Day with 300+ attendees" },
  ];

  const achievements2024 = [
    { icon: Trophy, text: "Participated in Lagos Junior Football League" },
    { icon: Award, text: "U11 team reached semi-finals of Ajah District Cup" },
    { icon: Trophy, text: "U14 team won 3rd place in Lekki Inter-Academy Tournament" },
    { icon: Star, text: "5 players selected for Lagos State U15 trials" },
    { icon: Users, text: "Hosted Nigerian football star clinic" },
    { icon: TrendingUp, text: "Established U7 & U9 development program" },
  ];

  const achievements2025 = [
    { icon: Trophy, text: "U10 team - Champions, Badore Community Cup", highlight: true },
    { icon: Award, text: "U13 team - Runners-up, Lagos Elite Youth Championship", highlight: true },
    { icon: Users, text: "200+ active players enrolled" },
    { icon: TrendingUp, text: "Partnership with local clubs for player pathway" },
  ];

  const records = [
    {
      title: "First Goal in Academy History",
      player: "Emmanuel Adebayo",
      detail: "U14 vs. Lekki Stars, 2023",
    },
    {
      title: "Most Appearances",
      player: "David Okafor",
      detail: "42 matches since 2023",
    },
    {
      title: "Biggest Win Margin",
      player: "U10 Squad",
      detail: "8-0 vs. Ajah Youth FC",
    },
    {
      title: "Youngest Player to Debut",
      player: "Tobenna Okeke",
      detail: "Age 7, U7 Category",
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
            <Trophy className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Hall of Fame</h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Celebrating our achievements and milestones since 2023
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trophy Cabinet Image */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="rounded-lg overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1764408721535-2dcb912db83e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waHklMjBmb290YmFsbCUyMGNoYW1waW9uc2hpcHxlbnwxfHx8fDE3NzE1MTIyMTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Trophy Cabinet"
                className="w-full aspect-video object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2025 Season Highlights */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-accent text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">2025 Season (Ongoing)</h2>
            <p className="text-xl text-white/90">Our latest achievements</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {achievements2025.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 ${achievement.highlight ? 'bg-white text-secondary' : 'bg-white/10 text-white border-white/20'} h-full`}>
                  <achievement.icon className={`w-10 h-10 mb-4 ${achievement.highlight ? 'text-primary' : 'text-white'}`} />
                  <p className="font-medium">{achievement.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2024 Season */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">2024 Season</h2>
            <p className="text-lg text-gray-600">Building competitive excellence</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {achievements2024.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                  <achievement.icon className="w-10 h-10 text-primary mb-4" />
                  <p className="text-gray-700 font-medium">{achievement.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2023 Foundation Year */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">2023 Season</h2>
            <p className="text-lg text-gray-600">Foundation & launch</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {achievements2023.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                  <achievement.icon className="w-10 h-10 text-primary mb-4" />
                  <p className="text-gray-700 font-medium">{achievement.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Records & Milestones */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
              Records & Milestones
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Historic moments in Pegasus Football Academy history
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {records.map((record, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
              >
                <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-secondary">{record.title}</h3>
                      <p className="font-semibold text-primary mb-1">{record.player}</p>
                      <p className="text-sm text-gray-600">{record.detail}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni Success Stories */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
              Alumni Tracker
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Where are they now? Following the progress of our graduates
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 text-center shadow-lg">
              <Star className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4 text-secondary">
                5 Players in Lagos State Trials
              </h3>
              <p className="text-gray-700 mb-6">
                Five of our talented players have been selected to participate in Lagos State U15
                trials, representing the first wave of Pegasus graduates moving up the football
                pathway. We're incredibly proud of their progress and dedication.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <div className="bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary">
                  Emmanuel Adebayo
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary">
                  David Okafor
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary">
                  Samuel Nwankwo
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary">
                  + 2 more
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
