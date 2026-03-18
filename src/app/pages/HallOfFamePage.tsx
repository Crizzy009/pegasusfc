import { Card } from "../components/ui/card";
import { Trophy, Award, Star, TrendingUp, Users, Target } from "lucide-react";
import { motion } from "motion/react";
import { usePublicContent } from "../content/useContent";
import type { Achievement as AchievementType } from "../content/types";

export function HallOfFamePage() {
  const { data: achievementsData } = usePublicContent<AchievementType>("achievement");
  const placeholderPhotoUrl = `${import.meta.env.BASE_URL}placeholders/photo.svg`;

  const defaultAchievements: AchievementType[] = [
    { season: "2023", title: "Academy Launch", description: "Academy successfully launched in Badore, Ajah", category: "milestone", order: 10 },
    { season: "2023", title: "Enrollment Growth", description: "Enrolled 150+ players across 6 age categories", category: "growth", order: 20 },
    { season: "2023", title: "Training Facility", description: "Established training facility in Lekki axis", category: "facility", order: 30 },
    { season: "2023", title: "School Partnerships", description: "Partnered with local schools for talent identification", category: "partner", order: 40 },
    { season: "2023", title: "Pegasus Open Day", description: "Hosted inaugural Pegasus Open Day with 300+ attendees", category: "event", order: 50 },
    { season: "2024", title: "League Participation", description: "Participated in Lagos Junior Football League", category: "league", order: 10 },
    { season: "2024", title: "Ajah District Cup", description: "U11 team reached semi-finals of Ajah District Cup", category: "tournament", order: 20 },
    { season: "2024", title: "Lekki Tournament", description: "U14 team won 3rd place in Lekki Inter-Academy Tournament", category: "tournament", order: 30 },
    { season: "2024", title: "State Trials", description: "5 players selected for Lagos State U15 trials", category: "trials", order: 40 },
    { season: "2024", title: "Star Clinic", description: "Hosted Nigerian football star clinic", category: "event", order: 50 },
    { season: "2024", title: "Development Program", description: "Established U7 & U9 development program", category: "program", order: 60 },
    { season: "2025", title: "Badore Community Cup", description: "U10 team - Champions, Badore Community Cup", category: "trophy", highlight: true, order: 10 },
    { season: "2025", title: "Youth Championship", description: "U13 team - Runners-up, Lagos Elite Youth Championship", category: "trophy", highlight: true, order: 20 },
    { season: "2025", title: "Academy Growth", description: "200+ active players enrolled", category: "growth", order: 30 },
    { season: "2025", title: "Player Pathway", description: "Partnership with local clubs for player pathway", category: "partner", order: 40 },
  ];

  const achievements = achievementsData.length ? achievementsData : defaultAchievements;

  const seasons = Array.from(new Set(achievements.map((a) => a.season))).sort((a, b) => Number(b) - Number(a));
  seasons[0] || "";

  const iconFor = (a: AchievementType) => {
    const c = (a.category || "").toLowerCase();
    if (c.includes("trophy") || c.includes("tournament")) return Trophy;
    if (c.includes("growth")) return Users;
    if (c.includes("facility")) return Target;
    if (c.includes("partner")) return TrendingUp;
    if (c.includes("event")) return Star;
    if (c.includes("trials")) return Award;
    return Award;
  };

  achievements.find((a) => a.image?.url)?.image?.url ||
    placeholderPhotoUrl;

  const normalizeCardText = (a: AchievementType) => {
    const t = String(a.title ?? "").trim();
    const d = String(a.description ?? "").trim();
    if (t && d) return `${t}: ${d}`;
    return t || d || "Achievement";
  };

  const achievements2025 = achievements
    .filter((a) => String(a.season) === "2025")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 4)
    .map((a) => ({
      icon: iconFor(a),
      text: normalizeCardText(a),
      highlight: Boolean(a.highlight),
    }));

  const achievements2024 = achievements
    .filter((a) => String(a.season) === "2024")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((a) => ({
      icon: iconFor(a),
      text: normalizeCardText(a),
    }));

  const achievements2023 = achievements
    .filter((a) => String(a.season) === "2023")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((a) => ({
      icon: iconFor(a),
      text: normalizeCardText(a),
    }));

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
          style={{ backgroundImage: `url('${import.meta.env.BASE_URL}hero-bg.jpg')` }}
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
                src={placeholderPhotoUrl}
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

    </div>
  );
}
