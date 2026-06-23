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
      title: "Pedro Carrena 100 Goals Milestone",
      description: "Pedro Carrena scored his historic 100th goal, establishing an unmatched record.",
      image: {
        url: "/pegasus archive/PEDRO CARRENA 100 Goals Milestone/WhatsApp Image 2026-06-12 at 2.43.57 PM.jpeg",
        alt: "Pedro Carrena 100 Goals Milestone",
        caption: "Pedro Carrena 100 Goals Milestone",
      },
      order: 1,
    },
    {
      title: "Wolverhampton & Brentford Scouting",
      description: "Hosted professional English Premier League scouts at our academy fields.",
      image: {
        url: "/pegasus archive/Scout game from WolverhampthonWanderers and Brentforf FC in England/WhatsApp Image 2026-06-12 at 2.43.58 PM.jpeg",
        alt: "Wolverhampton & Brentford Scouting",
        caption: "Wolverhampton & Brentford Scouting",
      },
      order: 2,
    },
    {
      title: "Basketball Academy Grand Launch",
      description: "Celebrated the official team launch and photoshoot on June 5, 2026.",
      image: {
        url: "/pegasus archive/We lunched our basketball team 5th of June/image 6.jpeg",
        alt: "Basketball Academy Grand Launch",
        caption: "Basketball Academy Grand Launch",
      },
      order: 3,
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

  seed("coach", "published", {
    name: "Mr. Deji Daniel",
    title: "Sporting & Technical Director",
    bio: "Overseeing sporting programs, coaching structure, player development pathways, and overall technical direction of the academy.",
    photo: {
      url: "/deji sporting dir.jpeg",
      alt: "Mr. Deji Daniel - Sporting & Technical Director",
      caption: "",
    },
    order: 1,
  });

  const mediaPhotos = [
    {
      title: "Pedro Carrena 100 Goals Celebration",
      category: "Milestone",
      date: "June 2026",
      image: {
        originalUrl: "/pegasus archive/PEDRO CARRENA 100 Goals Milestone/WhatsApp Image 2026-06-12 at 2.43.57 PM.jpeg",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "Pedro Carrena receiving award for scoring 100 academy goals.",
      order: 0.1,
    },
    {
      title: "Wolverhampton & Brentford English Scouts at Pegasus",
      category: "Scouting",
      date: "June 2026",
      image: {
        originalUrl: "/pegasus archive/Scout game from WolverhampthonWanderers and Brentforf FC in England/WhatsApp Image 2026-06-12 at 2.43.58 PM.jpeg",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "English Premier League scouts watching trial games at Pegasus.",
      order: 0.2,
    },
    {
      title: "Beyond Limits vs Pegasus",
      category: "Matches",
      date: "June 2026",
      image: {
        originalUrl: "/pegasus archive/Pictures from our last game against beyond limits in Ogun state/WhatsApp Image 2026-06-12 at 2.55.39 PM (3).jpeg",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "Intense action against Beyond Limits in Ogun State.",
      order: 0.3,
    },
    {
      title: "Inaugural Basketball Squad Official Launch",
      category: "Basketball",
      date: "June 5, 2026",
      image: {
        originalUrl: "/pegasus archive/We lunched our basketball team 5th of June/image 6.jpeg",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "The grand launch of the Pegasus Basketball Academy.",
      order: 0.35,
    },
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
        originalUrl: "/pegasus archive/pegasus moments/WhatsApp Image 2026-06-12 at 2.43.48 PM.jpeg",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "Agility and coordination drills on the pitch.",
      order: 10,
    },
    {
      title: "Youth Fun League 2024 Celebration",
      category: "Champions",
      date: "Dec 2024",
      image: {
        originalUrl: "/pegasus archive/youth fun league 2024.jpeg",
        largeUrl: "",
        mediumUrl: "",
        thumbUrl: "",
      },
      caption: "Winning squad of the Youth Fun League 2024.",
      order: 20,
    },
  ];

  mediaPhotos.forEach((p) => seed("mediaPhoto", "published", p));

  const mediaVideos = [
    {
      title: "Congratulations on your success \"PEDRO CARRENA\" 100 Goals Milestone",
      category: "Milestone",
      date: "2026",
      videoUrl: "https://youtube.com/shorts/oQW8nfkT9vo?si=zgqp9eeDXWTNpx7I",
      platform: "youtube",
      order: 10,
    },
    {
      title: "RYAN DICKSON INTERVIEW AFTER THE SCOUTING PROGRAM",
      category: "Interview",
      date: "2026",
      videoUrl: "https://youtu.be/0bTj7_QmW_Q?si=SIBMQXAsukhu32Af",
      platform: "youtube",
      order: 20,
    },
    {
      title: "SCOUTS FROM ENGLAND",
      category: "Scouting",
      date: "2026",
      videoUrl: "https://youtu.be/bPckYiFCCIM?si=AsubYpvCX3llFuHM",
      platform: "youtube",
      order: 30,
    },
    {
      title: "PEGASUS ACADEMY BASKETBALL TEAM TRAINING",
      category: "Basketball",
      date: "2026",
      videoUrl: "https://youtu.be/57ly26n3wJo?si=knpTV4LZ3ASVICN2",
      platform: "youtube",
      order: 40,
    },
    {
      title: "Training time - Agility, strength, endurance & ball mastery",
      category: "Training",
      date: "2026",
      videoUrl: "https://youtu.be/brUxA4v6hx4?si=STF-vB1FK2HijoZw",
      platform: "youtube",
      order: 50,
    },
    {
      title: "Beautiful solo goal from our 14 years old \"FRIDAY EWUNTIN\"",
      category: "Match Highlight",
      date: "2026",
      videoUrl: "https://youtu.be/v9yGJg6DJPA?si=v03cYn9az4tY2Kd3",
      platform: "youtube",
      order: 60,
    },
    {
      title: "BEYOND LIMITS - PEGASUS ACADEMY",
      category: "Media",
      date: "2026",
      videoUrl: "https://youtu.be/VtfONgiA338?si=t_demn-ipCEDZMxM",
      platform: "youtube",
      order: 70,
    },
    {
      title: "Training time - Under 6",
      category: "Training",
      date: "2026",
      videoUrl: "https://youtu.be/HrjyqjiGYiQ?si=3fyQa6asXccNuaxe",
      platform: "youtube",
      order: 80,
    },
    {
      title: "Training time - Under 10",
      category: "Training",
      date: "2026",
      videoUrl: "https://youtu.be/vy5ahJsy-Zc?si=azFxKW2C611bVSlC",
      platform: "youtube",
      order: 90,
    },
    {
      title: "Training time - Under 12",
      category: "Training",
      date: "2026",
      videoUrl: "https://youtu.be/GkRXuMKBNlY?si=BjRVtXbxy-AbqAQW",
      platform: "youtube",
      order: 100,
    },
    {
      title: "MRS CHIGOZIE",
      category: "Interview",
      date: "2026",
      videoUrl: "https://youtu.be/PTvjJElAX68?si=DyhHI2Ic74zOZO5F",
      platform: "youtube",
      order: 110,
    },
    {
      title: "HANNIEL IFEOLUWA TIJANI",
      category: "Interview",
      date: "2026",
      videoUrl: "https://youtu.be/hH5zRQzWDgY?si=WFfJkdvqIkLwwELm",
      platform: "youtube",
      order: 120,
    },
    {
      title: "SCOUTING PROGRAM (first)",
      category: "Scouting",
      date: "2026",
      videoUrl: "https://youtube.com/shorts/O3bOWFMQmOA?si=Nm-EiRon9e2-XhMh",
      platform: "youtube",
      order: 130,
    },
    {
      title: "SCOUTING PROGRAM (second)",
      category: "Scouting",
      date: "2026",
      videoUrl: "https://youtube.com/shorts/_AKhUOEdvsM?si=es7trA2bSXzEYuKj",
      platform: "youtube",
      order: 140,
    },
    {
      title: "Pegasus Sports Academy top-notch facilities",
      category: "Facilities",
      date: "2026",
      videoUrl: "https://youtu.be/_PFKOfk5sgM?si=GMxIJBxJmiPQeU-g",
      platform: "youtube",
      order: 150,
    },
  ];

  mediaVideos.forEach((v) => seed("mediaVideo", "published", v));

  const newsPosts = [
    {
      title: "Mr. Deji Daniel Appointed Sporting & Technical Director",
      excerpt: "We are pleased to announce the appointment of Mr. Deji Daniel as the new Sporting and Technical Director of Pegasus Sports Academy, effective immediately.",
      bodyHtml:
        "<p>We are pleased to announce the appointment of Mr. Deji Daniel as the new Sporting and Technical Director of Pegasus Sports Academy, effective immediately.</p><p>Mr. Deji brings a wealth of experience and a strong passion for youth development, player growth, and technical excellence. In this role, he will oversee our sporting programs, coaching structure, player development pathways, and overall technical direction of the academy.</p><p>Please join us in welcoming him to the Pegasus family and giving him your full support as we take the next step forward. Let's keep building together!</p>",
      date: "June 2026",
      image: {
        url: "/deji sporting dir.jpeg",
        alt: "Mr. Deji Daniel - Sporting & Technical Director",
        caption: "Congratulations Mr. Deji Daniel",
      },
      scheduledAt: "",
      order: 0.1,
    },
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

  const players = [
    {
      name: "Nathan Chukwuyem",
      jersey: 9,
      position: "Forward",
      age: 16,
      category: "u14-u18",
      height: "5'11\"",
      goals: 32,
      assists: 12,
      cleanSheets: 0,
      bioHtml: "<p>Academy Top Scorer with exceptional clinical finishing.</p>",
      photo: {
        url: "/pegasus archive/nathan.jpeg",
        alt: "Nathan Chukwuyem",
        caption: "Academy Top Scorer",
      },
      status: "active",
      order: 10,
    },
    {
      name: "Melvin",
      jersey: 10,
      position: "Midfielder",
      age: 15,
      category: "u14-u18",
      height: "5'9\"",
      goals: 18,
      assists: 24,
      cleanSheets: 0,
      bioHtml: "<p>Highly creative playmaker with stellar vision and passing accuracy.</p>",
      photo: {
        url: "/pegasus archive/melvin.jpeg",
        alt: "Melvin",
        caption: "Star Playmaker",
      },
      status: "active",
      order: 20,
    },
    {
      name: "Amarachi",
      jersey: 4,
      position: "Defender",
      age: 16,
      category: "u14-u18",
      height: "6'0\"",
      goals: 2,
      assists: 4,
      cleanSheets: 12,
      bioHtml: "<p>Solid rock center-back with immense strength and tactical awareness.</p>",
      photo: {
        url: "/pegasus archive/amarachi.jpeg",
        alt: "Amarachi",
        caption: "Solid rock center-back",
      },
      status: "active",
      order: 30,
    },
    {
      name: "Chigozie",
      jersey: 11,
      position: "Forward",
      age: 17,
      category: "u14-u18",
      height: "5'10\"",
      goals: 14,
      assists: 8,
      cleanSheets: 0,
      bioHtml: "<p>Winger with exceptional pace and dribbling skills.</p>",
      photo: {
        url: "/pegasus archive/chigozie.jpeg",
        alt: "Chigozie",
        caption: "Winger with exceptional pace",
      },
      status: "active",
      order: 40,
    },
    {
      name: "Ebube",
      jersey: 5,
      position: "Defender",
      age: 15,
      category: "u14-u18",
      height: "5'10\"",
      goals: 1,
      assists: 3,
      cleanSheets: 10,
      bioHtml: "<p>Calm and composed defender who reads the game brilliantly.</p>",
      photo: {
        url: "/pegasus archive/ebube.jpeg",
        alt: "Ebube",
        caption: "Calm and composed defender",
      },
      status: "active",
      order: 50,
    },
    {
      name: "Jesse",
      jersey: 8,
      position: "Midfielder",
      age: 12,
      category: "u9-u12",
      height: "5'2\"",
      goals: 6,
      assists: 14,
      cleanSheets: 0,
      bioHtml: "<p>Highly creative midfielder with excellent ball control and work ethic.</p>",
      photo: {
        url: "/pegasus archive/jesse.jpeg",
        alt: "Jesse",
        caption: "Highly creative midfielder",
      },
      status: "active",
      order: 60,
    },
    {
      name: "King Josh",
      jersey: 1,
      position: "Goalkeeper",
      age: 11,
      category: "u9-u12",
      height: "5'0\"",
      goals: 0,
      assists: 1,
      cleanSheets: 15,
      bioHtml: "<p>Spectacular shot stopper with amazing reflexes and distribution.</p>",
      photo: {
        url: "/pegasus archive/king josh.jpeg",
        alt: "King Josh",
        caption: "Spectacular shot stopper",
      },
      status: "active",
      order: 70,
    },
    {
      name: "Michael",
      jersey: 3,
      position: "Defender",
      age: 14,
      category: "u14-u18",
      height: "5'8\"",
      goals: 3,
      assists: 5,
      cleanSheets: 8,
      bioHtml: "<p>Hardworking full-back who excels at overlapping runs and crossing.</p>",
      photo: {
        url: "/pegasus archive/micheal.jpeg",
        alt: "Michael",
        caption: "Hardworking full-back",
      },
      status: "active",
      order: 80,
    },
    {
      name: "Toyin",
      jersey: 7,
      position: "Midfielder",
      age: 9,
      category: "u6-u9",
      height: "4'6\"",
      goals: 8,
      assists: 11,
      cleanSheets: 0,
      bioHtml: "<p>Incredibly agile winger who is a nightmare for opposing defenders.</p>",
      photo: {
        url: "/pegasus archive/toyin.jpeg",
        alt: "Toyin",
        caption: "Incredibly agile winger",
      },
      status: "active",
      order: 90,
    },
    {
      name: "Marvin",
      jersey: 11,
      position: "Forward",
      age: 8,
      category: "u6-u9",
      height: "4'5\"",
      goals: 11,
      assists: 6,
      cleanSheets: 0,
      bioHtml: "<p>Goal machine in his category with a natural instinct for finding space.</p>",
      photo: {
        url: "/pegasus archive/marvin.jpeg",
        alt: "Marvin",
        caption: "Goal machine in his category",
      },
      status: "active",
      order: 100,
    },
  ];

  players.forEach((p) => seed("player", "published", p));

  const achievements = [
    {
      season: "2026",
      title: "100 Goals Milestone",
      description: "Pedro Carrena scored his 100th goal, a historic milestone for Pegasus Football Academy.",
      category: "record",
      highlight: true,
      image: {
        url: "/pegasus archive/PEDRO CARRENA 100 Goals Milestone/WhatsApp Image 2026-06-12 at 2.43.57 PM.jpeg",
        alt: "Pedro Carrena 100 Goals Celebration",
        caption: "Pedro Carrena celebrates 100 goals",
      },
      order: 1,
    },
    {
      season: "2026",
      title: "Wolverhampton & Brentford Scouting",
      description: "Hosted professional English Premier League scouts at our academy fields.",
      category: "trials",
      highlight: true,
      image: {
        url: "/pegasus archive/Scout game from WolverhampthonWanderers and Brentforf FC in England/WhatsApp Image 2026-06-12 at 2.43.58 PM.jpeg",
        alt: "EPL Scouting Session",
        caption: "Wolverhampton and Brentford FC scouts at Pegasus Academy",
      },
      order: 2,
    },
    {
      season: "2026",
      title: "Basketball Academy Launch",
      description: "Officially unveiled our basketball team with a stunning photoshoot on June 5th, 2026.",
      category: "event",
      highlight: true,
      image: {
        url: "/pegasus archive/We lunched our basketball team 5th of June/image 6.jpeg",
        alt: "Basketball Team Unveiling",
        caption: "Basketball team launch group photo",
      },
      order: 3,
    },
    {
      season: "2026",
      title: "Beyond Limits Ogun Match",
      description: "Played an intense, highly competitive match against Beyond Limits in Ogun state.",
      category: "match",
      highlight: false,
      image: {
        url: "/pegasus archive/Pictures from our last game against beyond limits in Ogun state/WhatsApp Image 2026-06-12 at 2.55.40 PM.jpeg",
        alt: "Match against Beyond Limits",
        caption: "Pegasus match actions against Beyond Limits",
      },
      order: 4,
    },
    {
      season: "2023",
      title: "Academy Launch",
      description: "Academy successfully launched in Badore, Ajah",
      category: "milestone",
      highlight: false,
      order: 10,
    },
    {
      season: "2023",
      title: "Enrollment Growth",
      description: "Enrolled 150+ players across 6 age categories",
      category: "growth",
      highlight: false,
      order: 20,
    },
    {
      season: "2023",
      title: "Training Facility",
      description: "Established training facility in Lekki axis",
      category: "facility",
      highlight: false,
      order: 30,
    },
    {
      season: "2023",
      title: "School Partnerships",
      description: "Partnered with local schools for talent identification",
      category: "partner",
      highlight: false,
      order: 40,
    },
    {
      season: "2023",
      title: "Pegasus Open Day",
      description: "Hosted inaugural Pegasus Open Day with 300+ attendees",
      category: "event",
      highlight: false,
      order: 50,
    },
    {
      season: "2024",
      title: "Youth Fun League",
      description: "Champions of Youth Fun League 2024 - Term 2",
      category: "trophy",
      highlight: true,
      image: {
        url: "/pegasus archive/youth fun league 2024.jpeg",
        alt: "Youth Fun League 2024 Champions",
        caption: "Winning squad of YFL 2024",
      },
      order: 10,
    },
    {
      season: "2024",
      title: "Cooperative Tournament",
      description: "Champions of Badore Cooperative Tournament 2024",
      category: "trophy",
      highlight: true,
      image: {
        url: "/pegasus archive/cooperative tournament.jpeg",
        alt: "Cooperative Tournament Celebration",
        caption: "Celebrating Badore Cooperative Tournament win",
      },
      order: 20,
    },
    {
      season: "2024",
      title: "Pegasus Free Age vs Remo Stars",
      description: "Pegasus Free Age vs Remo Stars Main Team",
      category: "match",
      highlight: true,
      image: {
        url: "/pegasus archive/pegasus vs remo stars .jpeg",
        alt: "Pegasus vs Remo Stars Match",
        caption: "Match line up vs Remo Stars",
      },
      order: 25,
    },
    {
      season: "2024",
      title: "League Participation",
      description: "Participated in Lagos Junior Football League",
      category: "league",
      highlight: false,
      order: 30,
    },
    {
      season: "2024",
      title: "Ajah District Cup",
      description: "U11 team reached semi-finals of Ajah District Cup",
      category: "tournament",
      highlight: false,
      order: 40,
    },
    {
      season: "2024",
      title: "Lekki Tournament",
      description: "U14 team won 3rd place in Lekki Inter-Academy Tournament",
      category: "tournament",
      highlight: false,
      order: 50,
    },
    {
      season: "2024",
      title: "State Trials",
      description: "5 players selected for Lagos State U15 trials",
      category: "trials",
      highlight: false,
      order: 60,
    },
    {
      season: "2024",
      title: "Star Clinic",
      description: "Hosted Nigerian football star clinic",
      category: "event",
      highlight: false,
      order: 70,
    },
    {
      season: "2024",
      title: "Development Program",
      description: "Established U7 & U9 development program",
      category: "program",
      highlight: false,
      order: 80,
    },
    {
      season: "2025",
      title: "NFE Youth Cup",
      description: "Second place champions, Monday Yahaya MVP, Nathan Chukwuyem highest goal scorer",
      category: "trophy",
      highlight: true,
      image: {
        url: "/pegasus archive/nfe youth cup.jpeg",
        alt: "NFE Youth Cup Celebration",
        caption: "Celebrating NFE Youth Cup second place",
      },
      order: 5,
    },
    {
      season: "2025",
      title: "Badore Community Cup",
      description: "U10 team - Champions, Badore Community Cup",
      category: "trophy",
      highlight: true,
      order: 10,
    },
    {
      season: "2025",
      title: "Youth Championship",
      description: "U13 team - Runners-up, Lagos Elite Youth Championship",
      category: "trophy",
      highlight: true,
      order: 20,
    },
    {
      season: "2025",
      title: "Academy Growth",
      description: "300+ active players enrolled",
      category: "growth",
      highlight: false,
      order: 30,
    },
    {
      season: "2025",
      title: "Player Pathway",
      description: "Partnership with local clubs for player pathway",
      category: "partner",
      highlight: false,
      order: 40,
    },
  ];

  achievements.forEach((a) => seed("achievement", "published", a));
}
