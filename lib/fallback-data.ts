export type ProfessionalRecord = {
  id: number;
  name: string;
  role: string;
  niche: string;
  bio: string;
  rating: number;
  reviewCount: number;
  priceText: number;
  priceVoice: number;
  priceVideo: number;
  availabilityStatus: "available" | "busy" | "fully_booked";
  languages: string;
  photoUrl: string;
  specializations: string | null;
  yearsExperience: number;
};

export const fallbackProfessionals: ProfessionalRecord[] = [
  {
    id: 1,
    name: "Dr. Isabelle Moreau",
    role: "Relationship & Communication Coach",
    niche: "Executive dialogue, conflict repair, leadership presence",
    bio: "A senior communication strategist helping founders, executives, and high-stakes teams handle sensitive conversations with precision and emotional control.",
    rating: 4.9,
    reviewCount: 184,
    priceText: 90,
    priceVoice: 140,
    priceVideo: 190,
    availabilityStatus: "available",
    languages: "English,French,Spanish",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    specializations: "Conflict repair,Executive tone,Stakeholder conversations",
    yearsExperience: 16,
  },
  {
    id: 2,
    name: "James Hartley",
    role: "Legal Advisor",
    niche: "Employment, corporate risk, negotiation language",
    bio: "A UK legal advisor focused on employment and corporate communication, helping clients reduce ambiguity before sensitive decisions.",
    rating: 4.8,
    reviewCount: 121,
    priceText: 120,
    priceVoice: 180,
    priceVideo: 240,
    availabilityStatus: "available",
    languages: "English,German",
    photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    specializations: "Employment law,Contract language,Negotiation",
    yearsExperience: 20,
  },
  {
    id: 3,
    name: "Aisha Khan",
    role: "Financial Advisor",
    niche: "Wealth planning, investor communication, family office briefings",
    bio: "A financial advisor helping professionals and families turn complex decisions into clear, calm, and accountable communication.",
    rating: 4.9,
    reviewCount: 97,
    priceText: 110,
    priceVoice: 165,
    priceVideo: 220,
    availabilityStatus: "busy",
    languages: "English,Hindi",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    specializations: "Wealth planning,Investor updates,Family governance",
    yearsExperience: 14,
  },
  {
    id: 4,
    name: "Marco Bellini",
    role: "Business Consultant",
    niche: "Growth strategy, operational narratives, board updates",
    bio: "A business consultant translating strategic complexity into concise operating plans, board narratives, and implementation language.",
    rating: 4.7,
    reviewCount: 88,
    priceText: 95,
    priceVoice: 150,
    priceVideo: 210,
    availabilityStatus: "available",
    languages: "English,Italian,Portuguese",
    photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    specializations: "Board updates,Operating cadence,Growth strategy",
    yearsExperience: 18,
  },
  {
    id: 5,
    name: "Dr. Elena Vasileva",
    role: "Adult Mental Health Support",
    niche: "Stress, burnout, emotional regulation, resilient communication",
    bio: "A clinician helping professionals regulate stress and communicate boundaries clearly in demanding work environments.",
    rating: 5.0,
    reviewCount: 76,
    priceText: 85,
    priceVoice: 130,
    priceVideo: 175,
    availabilityStatus: "available",
    languages: "English,Bulgarian",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
    specializations: "Burnout,Boundaries,Emotional regulation",
    yearsExperience: 12,
  },
  {
    id: 6,
    name: "Sofia Mendes",
    role: "Event Manager",
    niche: "Stakeholder coordination, crisis communication, premium events",
    bio: "A premium event strategist who designs communication plans for complex launches, VIP experiences, and operational handoffs.",
    rating: 4.8,
    reviewCount: 64,
    priceText: 70,
    priceVoice: 115,
    priceVideo: 160,
    availabilityStatus: "fully_booked",
    languages: "English,Portuguese,Spanish",
    photoUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop",
    specializations: "Events,Crisis comms,Stakeholder coordination",
    yearsExperience: 11,
  },
];

export const fallbackMemberships = [
  {
    id: 1,
    tier: "curator",
    name: "Curator",
    price: 49,
    description: "For professionals refining personal communication quality and confidence.",
    features: JSON.stringify(["Core AI tools", "Five professional lexicons", "Monthly communication report", "Community access"]),
    highlighted: false,
  },
  {
    id: 2,
    tier: "strategist",
    name: "Strategist",
    price: 149,
    description: "For leaders managing client relationships, teams, and sensitive decisions.",
    features: JSON.stringify(["Full tool suite", "All professional lexicons", "Priority support", "Advanced analytics", "Quarterly strategy session"]),
    highlighted: true,
  },
  {
    id: 3,
    tier: "sovereign",
    name: "Sovereign",
    price: 499,
    description: "For executives and organizations requiring white-glove communication architecture.",
    features: JSON.stringify(["Dedicated communication architect", "Custom lexicons", "Crisis protocol support", "Board-level reporting"]),
    highlighted: false,
  },
];

export const fallbackLexicons = [
  {
    id: 1,
    name: "Executive Restructuring",
    description: "Language for clarity, empathy, and future orientation during organizational change.",
    category: "Leadership",
    professionalId: 1,
    terms: JSON.stringify(["transparent intention", "decision rationale", "continuity plan", "support pathway", "next operating model"]),
  },
  {
    id: 2,
    name: "Legal Risk Precision",
    description: "Phrases that reduce ambiguity in legal and compliance-sensitive correspondence.",
    category: "Legal",
    professionalId: 2,
    terms: JSON.stringify(["material consideration", "documented basis", "reasonable notice", "scope of reliance", "risk threshold"]),
  },
  {
    id: 3,
    name: "Client Wealth Dialogue",
    description: "Calm, structured language for investment, family office, and planning conversations.",
    category: "Finance",
    professionalId: 3,
    terms: JSON.stringify(["planning horizon", "liquidity need", "risk tolerance", "capital preservation", "decision cadence"]),
  },
];

export const fallbackBookings = [
  {
    id: 1,
    professionalId: 1,
    professionalName: "Dr. Isabelle Moreau",
    mode: "video",
    scheduledAt: "2026-06-10T10:00:00Z",
    durationMinutes: 60,
    totalPrice: 190,
    status: "confirmed",
    clientName: "Demo Client",
    clientEmail: "client@example.com",
    notes: "Prepare restructuring communication plan.",
    createdAt: new Date("2026-06-07T10:00:00Z"),
  },
];

export function mapProfessionalRecord(p: ProfessionalRecord) {
  return {
    id: p.id,
    name: p.name,
    role: p.role,
    niche: p.niche,
    bio: p.bio,
    rating: p.rating,
    reviewCount: p.reviewCount,
    priceText: p.priceText,
    priceVoice: p.priceVoice,
    priceVideo: p.priceVideo,
    availabilityStatus: p.availabilityStatus,
    languages: p.languages.split(",").map((language) => language.trim()),
    photoUrl: p.photoUrl,
    specializations: p.specializations ? p.specializations.split(",").map((item) => item.trim()) : null,
    yearsExperience: p.yearsExperience,
  };
}

export function buildFallbackSlots() {
  const slots = [];
  const times = ["09:00", "10:30", "13:00", "15:30", "17:00"];
  for (let day = 1; day <= 7; day += 1) {
    const date = new Date();
    date.setDate(date.getDate() + day);
    const dateString = date.toISOString().slice(0, 10);
    for (const [index, time] of times.entries()) {
      slots.push({ date: dateString, time, available: index !== 2 || day % 2 === 0 });
    }
  }
  return slots;
}
