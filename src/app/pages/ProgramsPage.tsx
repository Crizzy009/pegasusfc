import { useEffect, useRef, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Calendar, Clock, MapPin, Users, Target, TrendingUp, Award, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export function ProgramsPage() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardWidthRef = useRef(280);
  const [containerHeight, setContainerHeight] = useState(640);
  const maxCardHRef = useRef(520);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startProgressRef = useRef(0);
  const lastMovesRef = useRef<Array<{ t: number; x: number }>>([]);
  const rafRef = useRef<number | null>(null);
  const [formData, setFormData] = useState({
    playerName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    school: "",
    position: "",
    experience: "",
    medicalConditions: "",
    guardianName: "",
    phone: "",
    email: "",
    emergencyContact: "",
  });

  const programs = [
    {
      id: "u7-u9",
      title: "U7 & U9",
      subtitle: "Foundation Program",
      ages: "6-9 years",
      focus: "Fun & Fundamentals",
      time: "4:00 PM - 5:00 PM",
      days: "Friday & Saturday",
      fee: "₦15,000/month",
      color: "from-orange-400 to-orange-600",
      description: "Introduction to football through fun games and basic skills development",
      curriculum: [
        "Basic ball control and dribbling",
        "Simple passing techniques",
        "Fun small-sided games",
        "Coordination and balance",
        "Teamwork and sportsmanship",
      ],
    },
    {
      id: "u10",
      title: "U10",
      subtitle: "Development Squad",
      ages: "10 years",
      focus: "Skill Development",
      time: "5:00 PM - 6:00 PM",
      days: "Friday & Saturday",
      fee: "₦18,000/month",
      color: "from-orange-500 to-orange-700",
      description: "Building technical skills and introducing tactical concepts",
      curriculum: [
        "Advanced dribbling techniques",
        "Passing and receiving",
        "Shooting accuracy",
        "Basic positioning",
        "Introduction to match play",
      ],
    },
    {
      id: "u11-u13",
      title: "U11-U13",
      subtitle: "Junior Academy",
      ages: "11-13 years",
      focus: "Tactical Awareness",
      time: "5:00 PM - 6:30 PM",
      days: "Friday & Saturday",
      fee: "₦20,000/month",
      color: "from-orange-600 to-orange-800",
      description: "Developing tactical understanding and competitive match experience",
      curriculum: [
        "Tactical formations and positioning",
        "Team play and communication",
        "Speed and agility training",
        "Match strategy",
        "Regular competitive matches",
      ],
    },
    {
      id: "u14-u16",
      title: "U14-U16",
      subtitle: "Youth Elite",
      ages: "14-16 years",
      focus: "Elite Performance",
      time: "6:00 PM - 7:30 PM",
      days: "Friday & Saturday",
      fee: "₦25,000/month",
      color: "from-orange-700 to-orange-900",
      description: "High-performance training for competitive football and talent pathway",
      curriculum: [
        "Advanced tactical systems",
        "Physical conditioning",
        "Mental preparation",
        "Video analysis",
        "Pathway to professional clubs",
      ],
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send data to a server
    const pegasusId = `PEG-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    alert(`Registration Successful!\n\nYour Pegasus ID: ${pegasusId}\n\nYou will receive a confirmation via WhatsApp and email shortly.\n\nSee you on the pitch!`);
    setSelectedProgram(null);
    setFormData({
      playerName: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      school: "",
      position: "",
      experience: "",
      medicalConditions: "",
      guardianName: "",
      phone: "",
      email: "",
      emergencyContact: "",
    });
  };

  useEffect(() => {
    setProgress(0);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    const resize = () => {
      if (!el) return;
      const w = el.getBoundingClientRect().width;
      cardWidthRef.current = Math.max(220, Math.min(320, Math.floor(w * 0.82)));
      const maxH = Math.floor(cardWidthRef.current * 1.55);
      maxCardHRef.current = maxH;
      setContainerHeight(maxH + 64);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const clampIndex = (i: number) => {
    const max = Math.max(0, programs.length - 1);
    return Math.max(0, Math.min(max, i));
  };

  const animateTo = (target: number, duration = 420) => {
    const from = progress;
    const to = target;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const v = from + (to - from) * ease(p);
      setProgress(v);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCurrentIndex(Math.round(to));
        rafRef.current = null;
      }
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    draggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
    startProgressRef.current = progress;
    lastMovesRef.current = [{ t: performance.now(), x: startXRef.current }];
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!draggingRef.current) return;
    const x = e.touches[0].clientX;
    const dx = x - startXRef.current;
    const w = cardWidthRef.current || 300;
    const np = startProgressRef.current - dx / w;
    setProgress(np);
    const now = performance.now();
    lastMovesRef.current.push({ t: now, x });
    if (lastMovesRef.current.length > 5) lastMovesRef.current.shift();
  };

  const onTouchEnd = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const pts = lastMovesRef.current;
    let v = 0;
    if (pts.length >= 2) {
      const a = pts[pts.length - 2];
      const b = pts[pts.length - 1];
      const dt = Math.max(1, b.t - a.t);
      v = (b.x - a.x) / dt;
    }
    const w = cardWidthRef.current || 300;
    const projected = progress - (v * 220) / w;
    const target = clampIndex(Math.round(projected));
    animateTo(target, 420);
  };

  const getCardStyle = (i: number) => {
    const d = i - progress;
    const w = cardWidthRef.current || 300;
    const x = d * (w * 0.68);
    const z = -Math.min(3, Math.abs(d)) * 140 + (Math.abs(d) < 0.3 ? 80 : 0);
    const sBase = 1 - Math.min(0.4, Math.abs(d) * 0.1) + (Math.abs(d) < 0.3 ? 0.03 : 0);
    const s = Math.min(1.0, sBase);
    const o = 1 - Math.min(0.6, Math.abs(d) * 0.18);
    const bl = Math.min(6, Math.abs(d) * 2);
    const zi = 100 - Math.abs(Math.round(d)) * 10 + (Math.abs(d) < 0.5 ? 50 : 0);
    return {
      width: `${w}px`,
      transform: `translate3d(${x}px, 0, ${z}px) scale(${s})`,
      opacity: o,
      filter: `blur(${bl}px)`,
      zIndex: zi,
      willChange: "transform, opacity, filter",
      transition: draggingRef.current
        ? "none"
        : "transform 360ms cubic-bezier(.22,.61,.36,1), opacity 360ms, filter 360ms",
      pointerEvents: Math.abs(d) < 0.7 ? "auto" : "none",
      boxShadow:
        Math.abs(d) < 0.3
          ? "0 25px 50px -12px rgba(0,0,0,0.5)"
          : "0 10px 30px -12px rgba(0,0,0,0.35)",
    } as React.CSSProperties;
  };

  const next = () => {
    const target = clampIndex(currentIndex + 1);
    animateTo(target);
  };
  const prev = () => {
    const target = clampIndex(currentIndex - 1);
    animateTo(target);
  };

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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Programs</h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Structured training programs for every age group, every Friday and Saturday
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="md:hidden mb-10">
            <div
              ref={containerRef}
              className="relative mx-auto w-full"
              style={{
                perspective: "1000px",
                touchAction: "pan-y",
                overscrollBehaviorX: "contain",
                height: `${containerHeight}px`,
                overflowX: "hidden",
                overflowY: "visible",
              } as React.CSSProperties}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onTouchCancel={onTouchEnd}
            >
              <div className="absolute inset-0">
                {programs.map((program, i) => (
                  <div
                    key={program.id}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={getCardStyle(i)}
                  >
                    <Card
                      className="overflow-hidden rounded-[30px] bg-white flex flex-col"
                      style={{ maxHeight: `${maxCardHRef.current}px` }}
                    >
                      <div className={`bg-gradient-to-br ${program.color} text-white p-4`}>
                        <h2 className="text-2xl font-bold mb-1">{program.title}</h2>
                        <p className="text-sm opacity-90 mb-3">{program.subtitle}</p>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {program.ages}
                          </div>
                          <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {program.time}
                          </div>
                          <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {program.days}
                          </div>
                        </div>
                      </div>
                      <div className="px-4 pt-4 pb-2 flex-1 min-h-0 overflow-y-auto">
                        <div className="mb-3">
                          <div className="text-xs text-gray-600 mb-1">Focus Area</div>
                          <div className="text-base font-semibold text-secondary flex items-center gap-2">
                            <Target className="w-4 h-4 text-primary" />
                            {program.focus}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm mb-3">{program.description}</p>
                        <div className="mb-3">
                          <div className="text-sm font-semibold text-secondary mb-2">Training Curriculum</div>
                          <ul className="space-y-1.5">
                            {program.curriculum.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-4 pt-3 pb-4 border-t flex-shrink-0 bg-white">
                          <div>
                            <div className="text-xs text-gray-600">Monthly Fee</div>
                            <div className="text-xl font-bold text-primary">{program.fee}</div>
                          </div>
                          <Button
                            onClick={() => setSelectedProgram(program.id)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            Register Now
                          </Button>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
              <button
                aria-label="Previous"
                onClick={prev}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                disabled={currentIndex <= 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-[200] p-3 rounded-full bg-white/80 text-secondary shadow-lg backdrop-blur-md active:scale-95 disabled:opacity-40"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                aria-label="Next"
                onClick={next}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                disabled={currentIndex >= Math.max(0, programs.length - 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-[200] p-3 rounded-full bg-white/80 text-secondary shadow-lg backdrop-blur-md active:scale-95 disabled:opacity-40"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="hidden md:grid md:grid-cols-2 gap-8 mb-16">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden rounded-[30px] shadow-lg hover:shadow-2xl transition-shadow h-full">
                  <div className={`bg-gradient-to-br ${program.color} text-white p-6`}>
                    <h2 className="text-3xl font-bold mb-2">{program.title}</h2>
                    <p className="text-lg opacity-90 mb-4">{program.subtitle}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {program.ages}
                      </div>
                      <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {program.time}
                      </div>
                      <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {program.days}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-1">Focus Area</div>
                      <div className="text-lg font-semibold text-secondary flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        {program.focus}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{program.description}</p>
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-secondary mb-2">Training Curriculum:</div>
                      <ul className="space-y-2">
                        {program.curriculum.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="text-sm text-gray-600">Monthly Fee</div>
                        <div className="text-2xl font-bold text-primary">{program.fee}</div>
                      </div>
                      <Button
                        onClick={() => setSelectedProgram(program.id)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Register Now
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center text-secondary">What's Included</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Award, text: "Professional CAF-certified coaching" },
                { icon: Users, text: "Training kit (jersey, shorts, socks)" },
                { icon: Target, text: "Access to all training equipment" },
                { icon: TrendingUp, text: "Performance tracking and reports" },
                { icon: MapPin, text: "Safe training environment" },
                { icon: CheckCircle2, text: "Basic sports insurance coverage" },
              ].map((item, index) => (
                <Card key={index} className="p-4 flex items-center gap-4 shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-medium text-secondary">{item.text}</span>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      {selectedProgram && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="p-8 shadow-xl">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 text-secondary">Player Registration</h2>
                  <p className="text-gray-600">
                    Registering for:{" "}
                    <span className="font-semibold text-primary">
                      {programs.find((p) => p.id === selectedProgram)?.title}
                    </span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Player Information */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-secondary">Player Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="playerName">Full Name *</Label>
                        <Input
                          id="playerName"
                          required
                          value={formData.playerName}
                          onChange={(e) => handleInputChange("playerName", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          required
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender *</Label>
                        <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="position">Preferred Position</Label>
                        <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
                            <SelectItem value="defender">Defender</SelectItem>
                            <SelectItem value="midfielder">Midfielder</SelectItem>
                            <SelectItem value="forward">Forward</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="address">Home Address *</Label>
                      <Input
                        id="address"
                        required
                        placeholder="Area in Lagos"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                      />
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="school">School Attended</Label>
                      <Input
                        id="school"
                        value={formData.school}
                        onChange={(e) => handleInputChange("school", e.target.value)}
                      />
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="experience">Previous Football Experience</Label>
                      <Textarea
                        id="experience"
                        placeholder="Describe any previous football experience..."
                        value={formData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                      />
                    </div>
                    <div className="mt-4">
                      <Label htmlFor="medicalConditions">Medical Conditions/Allergies</Label>
                      <Textarea
                        id="medicalConditions"
                        placeholder="Please list any medical conditions or allergies..."
                        value={formData.medicalConditions}
                        onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Guardian Information */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-secondary">Parent/Guardian Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="guardianName">Parent/Guardian Name *</Label>
                        <Input
                          id="guardianName"
                          required
                          value={formData.guardianName}
                          onChange={(e) => handleInputChange("guardianName", e.target.value)}
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
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                        <Input
                          id="emergencyContact"
                          type="tel"
                          required
                          placeholder="+234-XXX-XXX-XXXX"
                          value={formData.emergencyContact}
                          onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" size="lg">
                      Complete Registration
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedProgram(null)}
                      size="lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
