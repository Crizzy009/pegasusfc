import { z } from "zod";
import sanitizeHtml from "sanitize-html";

const allowedHtml = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "ul",
    "ol",
    "li",
    "h2",
    "h3",
    "h4",
    "blockquote",
    "a",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    span: ["style"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
};

function cleanHtml(value) {
  if (typeof value !== "string") return "";
  return sanitizeHtml(value, allowedHtml);
}

function isAbsoluteUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isUploadUrl(value) {
  return typeof value === "string" && value.startsWith("/uploads/");
}

const assetUrlSchema = z
  .string()
  .min(1)
  .refine((v) => isAbsoluteUrl(v) || isUploadUrl(v), { message: "invalid_url" });

const imageSchema = z.object({
  url: assetUrlSchema,
  alt: z.string().optional().default(""),
  caption: z.string().optional().default(""),
});

const homeTeamSchema = z.object({
  title: z.string().min(1).max(50),
  subtitle: z.string().min(1).max(80),
  ages: z.string().min(1).max(30),
  focus: z.string().min(1).max(60),
  time: z.string().min(1).max(40),
  days: z.string().min(1).max(40),
  trainerName: z.string().max(80).optional().default(""),
  trainerTitle: z.string().max(80).optional().default(""),
  trainerPhotoUrl: z
    .string()
    .optional()
    .default("")
    .refine((v) => v === "" || isAbsoluteUrl(v) || isUploadUrl(v), { message: "invalid_url" }),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const homeHighlightSchema = z.object({
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(160),
  image: imageSchema,
  publishedAt: z.string().optional().default(""),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const facilitySchema = z.object({
  name: z.string().min(1).max(80),
  descriptionHtml: z.string().min(1).transform(cleanHtml),
  amenities: z.array(z.string().min(1).max(80)).default([]),
  images: z.array(imageSchema).min(1),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const programSchema = z.object({
  title: z.string().min(1).max(50),
  subtitle: z.string().min(1).max(80),
  ages: z.string().min(1).max(30),
  focus: z.string().min(1).max(60),
  time: z.string().min(1).max(40),
  days: z.string().min(1).max(40),
  fee: z.string().min(1).max(40),
  duration: z.string().max(80).optional().default(""),
  eligibility: z.array(z.string().min(1).max(120)).default([]),
  description: z.string().min(1).max(240),
  curriculum: z.array(z.string().min(1).max(120)).min(1),
  instructor: z
    .object({
      name: z.string().max(80).optional().default(""),
      title: z.string().max(80).optional().default(""),
      qualifications: z.array(z.string().min(1).max(120)).default([]),
      photoUrl: z
        .string()
        .optional()
        .default("")
        .refine((v) => v === "" || isAbsoluteUrl(v) || isUploadUrl(v), { message: "invalid_url" }),
    })
    .default({}),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const playerSchema = z.object({
  name: z.string().min(1).max(80),
  jersey: z.number().int().min(0).max(99),
  position: z.string().min(1).max(40),
  age: z.number().int().min(3).max(25),
  category: z.string().min(1).max(20),
  height: z.string().max(20).optional().default(""),
  goals: z.number().int().min(0).max(999).optional().default(0),
  assists: z.number().int().min(0).max(999).optional().default(0),
  cleanSheets: z.number().int().min(0).max(999).optional().default(0),
  bioHtml: z.string().optional().default("").transform(cleanHtml),
  photo: imageSchema,
  status: z.enum(["active", "inactive"]).optional().default("active"),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const squadStarPlayersSchema = z.object({
  topScorerName: z.string().min(1).max(80),
  topScorerDetail: z.string().min(1).max(80),
  mostImprovedName: z.string().min(1).max(80),
  mostImprovedDetail: z.string().min(1).max(80),
  bestGoalkeeperName: z.string().min(1).max(80),
  bestGoalkeeperDetail: z.string().min(1).max(80),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const partnerSchema = z.object({
  name: z.string().min(1).max(120),
  tier: z.enum(["platinum", "gold", "silver", "bronze", "community"]).default("community"),
  descriptionHtml: z.string().min(1).transform(cleanHtml),
  logo: imageSchema,
  websiteUrl: z.string().url().optional().or(z.literal("")).default(""),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const starSchema = z.object({
  name: z.string().min(1).max(120),
  achievement: z.string().min(1).max(120),
  quote: z.string().min(1).max(240),
  image: imageSchema,
  visitDate: z.string().min(1).max(40),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const achievementSchema = z.object({
  season: z.string().min(1).max(20),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(280),
  date: z.string().optional().default(""),
  category: z.string().optional().default(""),
  image: imageSchema.optional(),
  highlight: z.boolean().optional().default(false),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const mediaPhotoSchema = z.object({
  title: z.string().min(1).max(120),
  category: z.string().min(1).max(40),
  date: z.string().min(1).max(40),
  image: z.object({
    originalUrl: assetUrlSchema,
    largeUrl: z
      .string()
      .optional()
      .default("")
      .refine((v) => v === "" || isAbsoluteUrl(v) || isUploadUrl(v), { message: "invalid_url" }),
    mediumUrl: z
      .string()
      .optional()
      .default("")
      .refine((v) => v === "" || isAbsoluteUrl(v) || isUploadUrl(v), { message: "invalid_url" }),
    thumbUrl: z
      .string()
      .optional()
      .default("")
      .refine((v) => v === "" || isAbsoluteUrl(v) || isUploadUrl(v), { message: "invalid_url" }),
  }),
  caption: z.string().max(240).optional().default(""),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const newsPostSchema = z.object({
  title: z.string().min(1).max(140),
  excerpt: z.string().min(1).max(240),
  bodyHtml: z.string().min(1).transform(cleanHtml),
  date: z.string().min(1).max(40),
  image: imageSchema,
  scheduledAt: z.string().optional().default(""),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const coachSchema = z.object({
  name: z.string().min(1).max(80),
  title: z.string().min(1).max(120),
  bio: z.string().max(1200).optional().default(""),
  photo: imageSchema,
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const managerSchema = z.object({
  name: z.string().min(1).max(80),
  title: z.string().min(1).max(120),
  bio: z.string().max(1200).optional().default(""),
  photo: imageSchema,
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const trialSchema = z.object({
  dateLabel: z.string().min(1).max(80),
  isoDate: z.string().min(1).max(40),
  time: z.string().min(1).max(40),
  ageGroups: z.string().min(1).max(80),
  venue: z.string().min(1).max(160),
  registrationLimit: z.number().int().min(1).max(500).optional().default(50),
  status: z.enum(["available", "full", "closed"]).optional().default("available"),
  expiresAtIso: z.string().optional().default(""),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const registrationSchema = z.object({
  programTitle: z.string().min(1).max(80),
  playerName: z.string().min(1).max(120),
  dateOfBirth: z.string().min(1).max(40),
  gender: z.string().min(1).max(20),
  address: z.string().min(1).max(200),
  school: z.string().max(120).optional().default(""),
  position: z.string().max(40).optional().default(""),
  experience: z.string().max(2000).optional().default(""),
  medicalConditions: z.string().max(2000).optional().default(""),
  guardianName: z.string().min(1).max(120),
  phone: z.string().min(5).max(40),
  email: z.string().min(3).max(160),
  emergencyContact: z.string().min(5).max(40),
  status: z.enum(["new", "contacted", "enrolled", "closed"]).optional().default("new"),
  notes: z.string().max(2000).optional().default(""),
  createdAtIso: z.string().optional().default(""),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const trialBookingSchema = z.object({
  playerName: z.string().min(1).max(120),
  age: z.string().min(1).max(10),
  ageGroup: z.string().min(1).max(40),
  guardianName: z.string().min(1).max(120),
  phone: z.string().min(5).max(40),
  email: z.string().min(3).max(160),
  status: z.enum(["new", "contacted", "booked", "closed"]).optional().default("new"),
  notes: z.string().max(2000).optional().default(""),
  createdAtIso: z.string().optional().default(""),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const contactMessageSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().min(3).max(160),
  phone: z.string().max(40).optional().default(""),
  subject: z.string().min(1).max(80),
  message: z.string().min(1).max(5000),
  status: z.enum(["new", "replied", "closed"]).optional().default("new"),
  notes: z.string().max(2000).optional().default(""),
  createdAtIso: z.string().optional().default(""),
  order: z.number().int().min(0).max(9999).optional().default(0),
});

const schemaByType = {
  homeTeam: homeTeamSchema,
  homeHighlight: homeHighlightSchema,
  facility: facilitySchema,
  program: programSchema,
  coach: coachSchema,
  manager: managerSchema,
  player: playerSchema,
  squadStarPlayers: squadStarPlayersSchema,
  partner: partnerSchema,
  star: starSchema,
  achievement: achievementSchema,
  mediaPhoto: mediaPhotoSchema,
  newsPost: newsPostSchema,
  trial: trialSchema,
  registration: registrationSchema,
  trialBooking: trialBookingSchema,
  contactMessage: contactMessageSchema,
};

export function validateContent(type, data) {
  const schema = schemaByType[type];
  if (!schema) {
    const err = new Error(`Unknown content type: ${type}`);
    err.statusCode = 400;
    throw err;
  }
  return schema.parse(data);
}

export function listContentTypes() {
  return Object.keys(schemaByType);
}
