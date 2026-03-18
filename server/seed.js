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
      title: "U7 & U9",
      subtitle: "Foundation Program",
      ages: "6-9 years",
      focus: "Fun & Fundamentals",
      time: "4:00 PM - 5:00 PM",
      days: "Friday & Saturday",
      trainerName: "",
      trainerTitle: "",
      trainerPhotoUrl: "",
      order: 10,
    },
    {
      title: "U10",
      subtitle: "Development Squad",
      ages: "10 years",
      focus: "Skill Development",
      time: "5:00 PM - 6:00 PM",
      days: "Friday & Saturday",
      trainerName: "",
      trainerTitle: "",
      trainerPhotoUrl: "",
      order: 20,
    },
    {
      title: "U11-U13",
      subtitle: "Junior Academy",
      ages: "11-13 years",
      focus: "Tactical Awareness",
      time: "5:00 PM - 6:30 PM",
      days: "Friday & Saturday",
      trainerName: "",
      trainerTitle: "",
      trainerPhotoUrl: "",
      order: 30,
    },
    {
      title: "U14-U16",
      subtitle: "Youth Elite",
      ages: "14-16 years",
      focus: "Elite Performance",
      time: "6:00 PM - 7:30 PM",
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
      title: "U10 Champions",
      description: "Badore Community Cup Winners 2025",
      image: {
        url: "https://images.unsplash.com/photo-1764438344341-d4700ad674f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        alt: "U10 Champions",
        caption: "",
      },
      publishedAt: "2026-02-15",
      order: 10,
    },
    {
      title: "200+ Active Players",
      description: "Growing community across all age groups",
      image: {
        url: "https://images.unsplash.com/photo-1731673092066-cff4ea887d57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        alt: "200+ Active Players",
        caption: "",
      },
      publishedAt: "2026-02-10",
      order: 20,
    },
    {
      title: "Lagos State Trials",
      description: "5 players selected for U15 trials",
      image: {
        url: "https://images.unsplash.com/photo-1770237711414-e91a21755b4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        alt: "Lagos State Trials",
        caption: "",
      },
      publishedAt: "2026-01-28",
      order: 30,
    },
  ];

  highlights.forEach((h) => seed("homeHighlight", "published", h));

  seed("squadStarPlayers", "published", {
    topScorerName: "Joseph Musa",
    topScorerDetail: "15 goals - U10",
    mostImprovedName: "Tobenna Okeke",
    mostImprovedDetail: "U7-U9 Category",
    bestGoalkeeperName: "Samuel Nwankwo",
    bestGoalkeeperDetail: "10 clean sheets",
    order: 10,
  });

  const mediaPhotos = [
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

  const newsPosts = [
    {
      title: "U10 Squad Wins Badore Community Cup",
      excerpt: "In an exciting final, our U10 team secured a 3-1 victory to claim the championship trophy.",
      bodyHtml:
        "<p>In an exciting final, our U10 team secured a 3-1 victory to claim the championship trophy.</p>",
      date: "Feb 15, 2026",
      image: {
        url: "https://images.unsplash.com/photo-1764408721535-2dcb912db83e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        alt: "U10 Squad Wins Badore Community Cup",
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
    {
      title: "5 Players Selected for State Trials",
      excerpt: "Congratulations to our talented athletes chosen to represent Lagos State at U15 level.",
      bodyHtml:
        "<p>Congratulations to our talented athletes chosen to represent Lagos State at U15 level.</p>",
      date: "Jan 28, 2026",
      image: {
        url: "https://images.unsplash.com/photo-1769383924825-44706af97281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        alt: "5 Players Selected for State Trials",
        caption: "",
      },
      scheduledAt: "",
      order: 30,
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
}
