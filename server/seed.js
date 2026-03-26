import { createId } from "./auth.js";

export function ensureSeedData(db) {
  const count = db.prepare("SELECT COUNT(*) as c FROM content").get().c;
  if (count > 0) return;

  const now = Date.now();
  const insert = db.prepare(
    `INSERT INTO content (id, type, status, data_json, created_at, updated_at)
     VALUES (@id, @type, @status, @data_json, @created_at, @updated_at)`
  );

  const seed = (type, status, data) => {
    insert.run({
      id: createId(type),
      type,
      status,
      data_json: JSON.stringify(data),
      created_at: now,
      updated_at: now,
    });
  };

  const homeTeams = [
    {
      title: "U5-U2",
      subtitle: "Early Stars",
      ages: "2-5 years",
      focus: "Introduction to Football",
      time: "2:45 PM - 7:00 PM",
      days: "Friday & Saturday",
      trainerName: "",
      trainerTitle: "",
      trainerPhotoUrl: "",
      order: 10,
    },
    {
      title: "U9-U6",
      subtitle: "Foundation Program",
      ages: "6-9 years",
      focus: "Fun & Fundamentals",
      time: "2:45 PM - 7:00 PM",
      days: "Friday & Saturday",
      trainerName: "",
      trainerTitle: "",
      trainerPhotoUrl: "",
      order: 20,
    },
    {
      title: "U12-U9",
      subtitle: "Development Squad",
      ages: "9-12 years",
      focus: "Skill Development",
      time: "2:45 PM - 7:00 PM",
      days: "Friday & Saturday",
      trainerName: "",
      trainerTitle: "",
      trainerPhotoUrl: "",
      order: 30,
    },
    {
      title: "U18-U14",
      subtitle: "Youth Elite",
      ages: "14-18 years",
      focus: "Elite Performance",
      time: "2:45 PM - 7:00 PM",
      days: "Friday & Saturday",
      trainerName: "",
      trainerTitle: "",
      trainerPhotoUrl: "",
      order: 40,
    },
  ];

  homeTeams.forEach((t) => seed("homeTeam", "published", t));

  const highlights = [
    {
      title: "Youth Fun League Champions",
      description: "Winners of the 2024 Youth Fun League",
      image: {
        url: "https://images.unsplash.com/photo-1764438344341-d4700ad674f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        alt: "Youth Fun League Champions",
        caption: "",
      },
      publishedAt: "2024-12-15",
      order: 10,
    },
    {
      title: "300+ Active Players",
      description: "Growing community across all age groups",
      image: {
        url: "https://images.unsplash.com/photo-1731673092066-cff4ea887d57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        alt: "300+ Active Players",
        caption: "",
      },
      publishedAt: "2026-02-10",
      order: 20,
    },
    {
      season: "2025",
      title: "NFE Youth Cup",
      description: "Second place champions, Tega Yahaya MVP, Chuwkunywm highest goal scorer",
      category: "trophy",
      highlight: true,
      order: 5,
      image: { url: "/pegasus archive/nfe youth cup.jpeg", alt: "NFE Youth Cup Celebration" },
    },
    {
      season: "2024",
      title: "Cooperative Tournament",
      description: "Champions of Badore Cooperative Tournament 2024",
      category: "trophy",
      highlight: true,
      order: 20,
      image: { url: "/pegasus archive/cooperative tournament.jpeg", alt: "Cooperative Tournament Celebration" },
    },
    {
      season: "2024",
      title: "Pegasus Free Age vs Remo Stars",
      description: "Pegasus Free Age vs Remo Stars Main Team",
      category: "match",
      highlight: true,
      order: 25,
      image: { url: "/pegasus archive/pegasus vs remo stars .jpeg", alt: "Pegasus vs Remo Stars Match" },
    },
  ];

  highlights.forEach((h) => seed("homeHighlight", "published", h));

  const stars = [
    {
      name: "Ogenyi Onazi",
      achievement: "Super Eagle's Midfielder",
      quote:
        "The future of Nigerian football is bright with academies like Pegasus. It was great to see such passion and discipline from the young players.",
      image: {
        url: "/pegasus archive/ogeneyi.jpeg",
        alt: "Ogenyi Onazi",
        caption: "",
      },
      visitDate: "2025",
      order: 0.5,
    },
    {
      name: "Osinachi Ohale",
      achievement: "Super Falcon Defender",
      quote:
        "It was a pleasure visiting Pegasus Academy. The energy and potential of these young athletes are truly inspiring!",
      image: {
        url: "/placeholders/pegasus archive/WhatsApp Image 2026-03-24 at 10.13.39 AM.jpeg",
        alt: "Osinachi Ohale",
        caption: "",
      },
      visitDate: "March 2026",
      order: 1,
    },
  ];

  stars.forEach((s) => seed("star", "published", s));

  seed("squadStarPlayers", "published", {
    topScorerName: "Inas Opeke",
    topScorerDetail: "50 goals (Academy Record)",
    mostImprovedName: "Tobenna Okeke",
    mostImprovedDetail: "U7-U9 Category",
    bestGoalkeeperName: "Samuel Nwankwo",
    bestGoalkeeperDetail: "10 clean sheets",
    order: 10,
  });

  const mediaPhotos = [
    {
      title: "Ogenyi Onazi with Academy Players",
      category: "Special Guest",
      date: "2025",
      image: {
        originalUrl: "/pegasus archive/ogeneyi.jpeg",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "Super Eagle Ogenyi Onazi with our academy stars.",
      order: 0.4,
    },
    {
      title: "The Rising Stars Project NGO Launch",
      category: "Launch",
      date: "2025",
      image: {
        originalUrl: "/pegasus archive/rising stars project .jpeg",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "The Rising Stars Project officially launching their NGO with Pegasus.",
      order: 0.5,
    },
    {
      title: "Osinachi Ohale Visit",
      category: "Special Guest",
      date: "March 2026",
      image: {
        originalUrl: "/placeholders/pegasus archive/WhatsApp Image 2026-03-24 at 10.13.39 AM.jpeg",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "Super Falcon defender Osinachi Ohale visiting the academy.",
      order: 1,
    },
    {
      title: "Osinachi Ohale with Young Stars",
      category: "Special Guest",
      date: "March 2026",
      image: {
        originalUrl: "/placeholders/pegasus archive/WhatsApp Image 2026-03-24 at 10.13.41 AM.jpeg",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "Super Falcon defender Osinachi Ohale with our young academy players.",
      order: 1.1,
    },
    {
      title: "Osinachi Ohale at Pegasus",
      category: "Special Guest",
      date: "March 2026",
      image: {
        originalUrl: "/placeholders/pegasus archive/WhatsApp Image 2026-03-24 at 10.13.41 AM (1).jpeg",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "Super Falcon defender Osinachi Ohale visiting Pegasus Academy.",
      order: 1.2,
    },
    {
      title: "Infinity Estate Branch Opening",
      category: "Expansion",
      date: "March 2026",
      image: {
        originalUrl: "/pegasus archive/infifity.jpeg",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "Expanding the legacy to Infinity Estate, Addo Road, Ajah.",
      order: 2,
    },
    {
      title: "Basketball Academy Launch",
      category: "Launch",
      date: "March 2026",
      image: {
        originalUrl: "/basketball flyer .jpeg",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "Exciting news! Basketball Academy coming to Ajah.",
      order: 5,
    },
    {
      title: "Saturday Skills Session",
      category: "Training",
      date: "Feb 15, 2026",
      image: {
        originalUrl: "https://images.unsplash.com/photo-1731673092066-cff4ea887d57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "",
      order: 10,
    },
    {
      title: "U10 Championship Celebration",
      category: "Match",
      date: "Feb 10, 2026",
      image: {
        originalUrl: "https://images.unsplash.com/photo-1764438344341-d4700ad674f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "",
      order: 20,
    },
    {
      title: "Coaching Masterclass",
      category: "Training",
      date: "Jan 28, 2026",
      image: {
        originalUrl: "https://images.unsplash.com/photo-1762053275412-03726506562a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "",
      order: 30,
    },
    {
      title: "Match Day Action",
      category: "Match",
      date: "Jan 20, 2026",
      image: {
        originalUrl: "https://images.unsplash.com/photo-1762013315117-1c8005ad2b41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "",
      order: 40,
    },
    {
      title: "Youth Development Program",
      category: "Training",
      date: "Jan 15, 2026",
      image: {
        originalUrl: "https://images.unsplash.com/photo-1770237711414-e91a21755b4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "",
      order: 50,
    },
    {
      title: "Team Photo Day",
      category: "Events",
      date: "Jan 05, 2026",
      image: {
        originalUrl: "https://images.unsplash.com/photo-1764438246710-83c535cada80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "",
      order: 60,
    },
  ];

  mediaPhotos.forEach((p) => seed("mediaPhoto", "published", p));

  const mediaVideos = [
    {
      title: "Superscreen Interview",
      category: "Media",
      date: "2025",
      videoUrl: "https://youtu.be/GNJ5U_m6Cc4?si=EGKaFJ7AAtMWXhqe",
      platform: "youtube",
      order: 10,
    },
    {
      title: "Osinachi Ohale's Visit",
      category: "Event",
      date: "2025",
      videoUrl: "https://youtu.be/RUeGKwCz27s?si=c2QlXhwWVG59sW7m",
      platform: "youtube",
      order: 20,
    },
    {
      title: "Superstar Agent Visit",
      category: "Event",
      date: "2025",
      videoUrl: "https://youtube.com/shorts/Krr3bYqsNZw?si=e8b0IYrrNFrfV7gF",
      platform: "youtube",
      order: 30,
    },
    {
      title: "Pegasus Chat",
      category: "Media",
      date: "2025",
      videoUrl: "https://youtu.be/V1GH7l8tp_4?si=g5f-5ERaKAvS32XW",
      platform: "youtube",
      order: 40,
    },
    {
      title: "Interview with Mrs Maya",
      category: "Media",
      date: "2025",
      videoUrl: "https://youtu.be/aiJAIJtytAQ?si=nIQTGvNpRLVtIubK",
      platform: "youtube",
      order: 50,
    },
    {
      title: "Facebook Academy Moments",
      category: "Community",
      date: "2025",
      videoUrl: "https://www.facebook.com/share/v/1C2YyiynnA/?mibextid=WC7FNe",
      platform: "facebook",
      order: 60,
    },
  ];

  mediaVideos.forEach((v) => seed("mediaVideo", "published", v));

  const newsPosts = [
    {
      title: "Super Eagle Ogenyi Onazi Visits Pegasus",
      excerpt: "We were thrilled to welcome Super Eagles midfielder Ogenyi Onazi to our academy for a special training and inspiration session.",
      bodyHtml:
        "<p>It was an incredible day at Pegasus Academy as we hosted Super Eagles midfielder Ogenyi Onazi! He spent time with our young athletes, sharing his professional journey and providing valuable insights during a special training session. His presence and encouragement have left a lasting impact on our next generation of football stars.</p>",
      date: "2025",
      image: {
        url: "/pegasus archive/ogeneyi 1.jpeg",
        alt: "Ogenyi Onazi Visit",
        caption: "",
      },
      scheduledAt: "",
      order: 0.4,
    },
    {
      title: "The Rising Stars Project NGO Launch with Pegasus",
      excerpt: "A huge thank you to The Rising Stars Project for traveling from the USA to officially launch their NGO with Pegasus Football Academy!",
      bodyHtml:
        "<p>Huge thank you to The Rising Stars Project for traveling all the way from the United States of America 🇺🇸 to officially launch their NGO with Pegasus Football Academy! ❤️⚽ It was an incredible occasion. Your dedication to developing young talents and uplifting grassroots football is truly inspiring. This is more than just football—it's about creating opportunities and building a brighter future for the next generation! 🌟👏 Made even more special with Super Screen TV covering the event. Moments like these inspire and uplift the future of grassroots football.</p>",
      date: "2025",
      image: {
        url: "/pegasus archive/rising star projects.jpeg",
        alt: "The Rising Stars Project Launch",
        caption: "",
      },
      scheduledAt: "",
      order: 0.5,
    },
    {
      title: "Super Falcon Osinachi Ohale Visits Pegasus Academy",
      excerpt: "Professional defender Osinachi Ohale visited our academy to inspire the next generation of football stars.",
      bodyHtml:
        "<p>We were honored to host Super Falcon defender Osinachi Ohale at Pegasus Academy! She shared her experiences as a professional athlete and inspired our young players with her journey to the top of Nigerian football. Her visit included a special session with the academy players at our Badore location.</p>",
      date: "March 2026",
      image: {
        url: "/placeholders/pegasus archive/WhatsApp Image 2026-03-24 at 10.13.39 AM.jpeg",
        alt: "Osinachi Ohale Visit",
        caption: "",
      },
      scheduledAt: "",
      order: 1,
    },
    {
      title: "New Branch: Infinity Estate, Addo Road",
      excerpt: "Pegasus Football Academy is coming to Infinity Estate, Addo Road, Ajah! Expanding the Legacy with a new branch opening.",
      bodyHtml:
        "<p>Welcome to Pegasus Football Academy/Club where we nurture, breed and mould young Talented and creative minds in their respective Football Careers/Aspirations. <strong>New Branch Opening at 4th Avenue No 22, Infinity Estate, Addo Road, Ajah, Lagos.</strong> Training days: Monday (4pm-7pm) and Saturday (4pm-7:30pm). Ages 2-17 years, Male & Female welcomed.</p>",
      date: "March 2026",
      image: {
        url: "/pegasus archive/infifity.jpeg",
        alt: "Infinity Estate Branch Opening",
        caption: "",
      },
      scheduledAt: "",
      order: 2,
    },
    {
      title: "Basketball Academy Launch in Ajah",
      excerpt: "Pegasus Academy is thrilled to announce the launch of its Basketball Academy at Ajah! Training commences April 2026.",
      bodyHtml:
        "<p>Pegasus Academy is thrilled to announce the launch of its Basketball Academy at Ajah! Training is set to commence April 2026, offering aspiring basketball stars a chance to hone their skills and reach new heights in the sport. Join us as we embark on this incredible journey to develop the next generation of basketball talent in Nigeria!</p>",
      date: "March 2026",
      image: {
        url: "/basketball flyer .jpeg",
        alt: "Basketball Academy Launch",
        caption: "",
      },
      scheduledAt: "",
      order: 5,
    },
    {
      title: "Inas Opeke Sets New Academy Record",
      excerpt: "Inas Opeke has reached a historic milestone, scoring 50 goals for the academy.",
      bodyHtml:
        "<p>Inas Opeke has reached a historic milestone, scoring 50 goals for the academy. This incredible achievement sets a new benchmark for future Pegasus athletes.</p>",
      date: "Feb 28, 2026",
      image: {
        url: "https://images.unsplash.com/photo-1764408721535-2dcb912db83e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        alt: "Inas Opeke Goal Record",
        caption: "",
      },
      scheduledAt: "",
      order: 10,
    },
    {
      title: "Registration Open for New Term",
      excerpt: "We're accepting new registrations for all age categories. Limited spaces available!",
      bodyHtml:
        "<p>We're accepting new registrations for all age categories. Limited spaces available!</p>",
      date: "Feb 10, 2026",
      image: {
        url: "https://images.unsplash.com/photo-1623596146585-29891bcf8e4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        alt: "Registration Open for New Term",
        caption: "",
      },
      scheduledAt: "",
      order: 20,
    },
  ];

  newsPosts.forEach((n) => seed("newsPost", "published", n));

  const trials = [
    {
      dateLabel: "Saturday, March 2, 2026",
      isoDate: "2026-03-02",
      time: "9:00 AM - 12:00 PM",
      ageGroups: "U7, U9, U10",
      venue: "Badore, Ajah, Lagos",
      registrationLimit: 50,
      status: "available",
      expiresAtIso: "",
      order: 10,
    },
    {
      dateLabel: "Saturday, March 9, 2026",
      isoDate: "2026-03-09",
      time: "9:00 AM - 12:00 PM",
      ageGroups: "U11, U12, U13",
      venue: "Badore, Ajah, Lagos",
      registrationLimit: 50,
      status: "available",
      expiresAtIso: "",
      order: 20,
    },
    {
      dateLabel: "Saturday, March 16, 2026",
      isoDate: "2026-03-16",
      time: "9:00 AM - 12:00 PM",
      ageGroups: "U14, U15, U16",
      venue: "Badore, Ajah, Lagos",
      registrationLimit: 50,
      status: "available",
      expiresAtIso: "",
      order: 30,
    },
  ];

  trials.forEach((t) => seed("trial", "published", t));

  const partners = [
    {
      name: "The Rising Stars Project",
      tier: "global",
      descriptionHtml:
        "A US-based NGO dedicated to developing young talents and uplifting grassroots football. Officially launched with Pegasus in 2025.",
      logo: {
        url: "/pegasus archive/rising stars project .jpeg",
        alt: "The Rising Stars Project",
        caption: "",
      },
      websiteUrl: "",
      order: 5,
    },
    {
      name: "Peninsula Youth Football League",
      tier: "community",
      descriptionHtml: "Official league participation and competition partner",
      logo: { url: "", alt: "Peninsula Youth Football League", caption: "" },
      websiteUrl: "",
      order: 10,
    },
  ];

  partners.forEach((p) => seed("partner", "published", p));
}
