import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Calendar, Clock, MapPin, CheckCircle2, Users, Target } from "lucide-react";
import { motion } from "motion/react";
import { usePublicContent } from "../content/useContent";
import type { Trial, TrialBooking } from "../content/types";
import { createPublicTrialBooking } from "../content/api";

export function RecruitmentPage() {
  const { data: trialsData } = usePublicContent<Trial>("trial");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    playerName: "",
    age: "",
    guardianName: "",
    phone: "",
    email: "",
    ageGroup: "",
  });

  const now = Date.now();
  const todayIso = new Date().toISOString().slice(0, 10);

  const isUpcoming = (t: Trial) => {
    if (t.status === "closed") return false;
    if (t.expiresAtIso) {
      const exp = Date.parse(t.expiresAtIso);
      if (!Number.isNaN(exp) && exp <= now) return false;
    }
    if (t.isoDate) {
      const d = String(t.isoDate).slice(0, 10);
      if (d < todayIso) return false;
    }
    return true;
  };

  const upcomingTrials = [...trialsData]
    .filter(isUpcoming)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const trialDates = upcomingTrials.map((t) => ({
    date: t.dateLabel,
    ageGroups: t.ageGroups,
    time: t.time,
    status: t.status === "full" ? "Full" : "Available",
  }));

  const whatToExpect = [
    {
      step: 1,
      title: "Registration",
      description: "Check-in and complete registration form",
    },
    {
      step: 2,
      title: "Warm-up",
      description: "Group warm-up and stretching exercises",
    },
    {
      step: 3,
      title: "Technical Drills",
      description: "Assessment of ball control, passing, and dribbling",
    },
    {
      step: 4,
      title: "Small-sided Games",
      description: "Match play to evaluate game understanding",
    },
    {
      step: 5,
      title: "Assessment",
      description: "Coaches evaluate performance and potential",
    },
    {
      step: 6,
      title: "Feedback",
      description: "Results communicated within 48 hours",
    },
  ];

  const requirements = [
    "Football boots and shin guards",
    "Water bottle",
    "Birth certificate or age declaration",
    "Completed registration form",
    "Parent/guardian present",
    "Sportswear (shorts and t-shirt)",
  ];

  const lookingFor = [
    { icon: Target, text: "Technical ability and ball control" },
    { icon: Users, text: "Teamwork and communication skills" },
    { icon: CheckCircle2, text: "Coachability and willingness to learn" },
    { icon: Target, text: "Athletic potential and fitness" },
    { icon: Users, text: "Passion for football" },
    { icon: CheckCircle2, text: "Positive attitude and discipline" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trialDates.length === 0) {
      alert("No upcoming trials are available right now. Please check back later.");
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload: TrialBooking = {
        playerName: formData.playerName,
        age: formData.age,
        ageGroup: formData.ageGroup,
        guardianName: formData.guardianName,
        phone: formData.phone,
        email: formData.email,
        status: "new",
        notes: "",
      };
      await createPublicTrialBooking(payload);
      alert(
        `Trial Registration Submitted!\n\nThank you ${formData.playerName}!\n\nYou will receive confirmation via WhatsApp and email with:\n- Trial date and time\n- Venue details\n- What to bring\n\nSee you on the pitch!`
      );
    } catch (err: any) {
      alert(err?.message ?? "Failed to submit trial registration");
      return;
    } finally {
      setSubmitting(false);
    }
    setFormData({
      playerName: "",
      age: "",
      guardianName: "",
      phone: "",
      email: "",
      ageGroup: "",
    });
  };

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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Open Trials</h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Book your FREE trial session and join Pegasus Football Academy
            </p>
            <div className="flex flex-wrap gap-6 justify-center text-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Badore, Ajah, Lagos</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Every Saturday</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>9:00 AM - 12:00 PM</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Trial Dates */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
              Upcoming Trial Dates
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select a date that works for your age group
            </p>
          </div>
          {trialDates.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              No upcoming trials yet.
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {trialDates.map((trial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow h-full">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="font-bold text-lg text-secondary">{trial.date}</span>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">Age Groups</div>
                          <div className="font-semibold">{trial.ageGroups}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">Time</div>
                          <div className="font-semibold">{trial.time}</div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        trial.status === "Full"
                          ? "bg-red-100 text-red-800"
                          : trial.status === "Closed"
                            ? "bg-gray-200 text-gray-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {trial.status}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trial Registration Form */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className={`p-8 shadow-xl ${trialDates.length === 0 ? "opacity-60 pointer-events-none" : ""}`}>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2 text-secondary">Book Your Free Trial</h2>
                <p className="text-gray-600">Fill out the form below to register</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="playerName">Player's Full Name *</Label>
                    <Input
                      id="playerName"
                      required
                      value={formData.playerName}
                      onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Player's Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      required
                      min="6"
                      max="16"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="ageGroup">Preferred Age Group *</Label>
                  <Select
                    value={formData.ageGroup}
                    onValueChange={(value) => setFormData({ ...formData, ageGroup: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="u7-u9">U7 & U9 (Ages 6-9)</SelectItem>
                      <SelectItem value="u10">U10 (Age 10)</SelectItem>
                      <SelectItem value="u11-u13">U11-U13 (Ages 11-13)</SelectItem>
                      <SelectItem value="u14-u16">U14-U16 (Ages 14-16)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="guardianName">Parent/Guardian Name *</Label>
                    <Input
                      id="guardianName"
                      required
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number (WhatsApp) *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      placeholder="+234-XXX-XXX-XXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg" disabled={submitting}>
                  Book Free Trial
                </Button>
              </form>
            </Card>
            {trialDates.length === 0 ? (
              <div className="text-center mt-6 text-sm text-gray-600">
                Trial booking is currently unavailable.
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
              What to Expect
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The trial process from start to finish
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {whatToExpect.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold text-secondary">{item.title}</h3>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Bring */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">What to Bring</h2>
              <p className="text-lg text-gray-600">Essential items for your trial session</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {requirements.map((item, index) => (
                <Card key={index} className="p-4 flex items-center gap-3 shadow">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="font-medium text-secondary">{item}</span>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Look For */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
              What We Look For
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Qualities we assess during trials
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {lookingFor.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full shadow-lg">
                  <item.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="font-medium text-secondary">{item.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
