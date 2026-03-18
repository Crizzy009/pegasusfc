export type ContentStatus = "draft" | "published";

export type ImageAsset = {
  url: string;
  alt?: string;
  caption?: string;
};

export type HomeTeam = {
  title: string;
  subtitle: string;
  ages: string;
  focus: string;
  time: string;
  days: string;
  trainerName?: string;
  trainerTitle?: string;
  trainerPhotoUrl?: string;
  order?: number;
};

export type HomeHighlight = {
  title: string;
  description: string;
  image: ImageAsset;
  publishedAt?: string;
  order?: number;
};

export type Facility = {
  name: string;
  descriptionHtml: string;
  amenities: string[];
  images: ImageAsset[];
  order?: number;
};

export type Program = {
  title: string;
  subtitle: string;
  ages: string;
  focus: string;
  time: string;
  days: string;
  fee: string;
  duration?: string;
  eligibility?: string[];
  description: string;
  curriculum: string[];
  instructor?: {
    name?: string;
    title?: string;
    qualifications?: string[];
    photoUrl?: string;
  };
  order?: number;
};

export type Coach = {
  name: string;
  title: string;
  bio?: string;
  photo: ImageAsset;
  order?: number;
};

export type Player = {
  name: string;
  jersey: number;
  position: string;
  age: number;
  category: string;
  height?: string;
  goals?: number;
  assists?: number;
  cleanSheets?: number;
  bioHtml?: string;
  photo: ImageAsset;
  status?: "active" | "inactive";
  order?: number;
};

export type SquadStarPlayers = {
  topScorerName: string;
  topScorerDetail: string;
  mostImprovedName: string;
  mostImprovedDetail: string;
  bestGoalkeeperName: string;
  bestGoalkeeperDetail: string;
  order?: number;
};

export type Partner = {
  name: string;
  tier: "platinum" | "gold" | "silver" | "bronze" | "community";
  descriptionHtml: string;
  logo: ImageAsset;
  websiteUrl?: string;
  order?: number;
};

export type Star = {
  name: string;
  achievement: string;
  quote: string;
  image: ImageAsset;
  visitDate: string;
  order?: number;
};

export type Achievement = {
  season: string;
  title: string;
  description: string;
  date?: string;
  category?: string;
  image?: ImageAsset;
  highlight?: boolean;
  order?: number;
};

export type MediaPhoto = {
  title: string;
  category: string;
  date: string;
  image: {
    originalUrl: string;
    largeUrl?: string;
    mediumUrl?: string;
    thumbUrl?: string;
  };
  caption?: string;
  order?: number;
};

export type NewsPost = {
  title: string;
  excerpt: string;
  bodyHtml: string;
  date: string;
  image: ImageAsset;
  scheduledAt?: string;
  order?: number;
};

export type Trial = {
  dateLabel: string;
  isoDate: string;
  time: string;
  ageGroups: string;
  venue: string;
  registrationLimit?: number;
  status?: "available" | "full" | "closed";
  expiresAtIso?: string;
  order?: number;
};

export type Registration = {
  programTitle: string;
  playerName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  school?: string;
  position?: string;
  experience?: string;
  medicalConditions?: string;
  guardianName: string;
  phone: string;
  email: string;
  emergencyContact: string;
  status?: "new" | "contacted" | "enrolled" | "closed";
  notes?: string;
  createdAtIso?: string;
  order?: number;
};

export type TrialBooking = {
  playerName: string;
  age: string;
  ageGroup: string;
  guardianName: string;
  phone: string;
  email: string;
  status?: "new" | "contacted" | "booked" | "closed";
  notes?: string;
  createdAtIso?: string;
  order?: number;
};

export type ContactMessage = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: "new" | "replied" | "closed";
  notes?: string;
  createdAtIso?: string;
  order?: number;
};

export type ContentType =
  | "homeTeam"
  | "homeHighlight"
  | "facility"
  | "program"
  | "coach"
  | "player"
  | "squadStarPlayers"
  | "partner"
  | "star"
  | "achievement"
  | "mediaPhoto"
  | "newsPost"
  | "trial"
  | "registration"
  | "trialBooking"
  | "contactMessage";

export type ContentItem<T> = {
  id: string;
  type: ContentType;
  data: T;
  createdAt: number;
  updatedAt: number;
};

export type AdminContentItem<T> = ContentItem<T> & {
  status: ContentStatus;
};
