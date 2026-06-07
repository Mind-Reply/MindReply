import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  bookingsTable,
  lexiconsTable,
  membershipsTable,
  professionalsTable,
} from "../lib/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function main() {
  console.log("Seeding MindReply database...");

  await db.delete(bookingsTable);
  await db.delete(lexiconsTable);
  await db.delete(membershipsTable);
  await db.delete(professionalsTable);

  await db.insert(membershipsTable).values([
    {
      tier: "curator",
      name: "Curator",
      price: 49,
      description: "For emerging professionals refining their communication presence.",
      features: "5 professional lexicons, 3 micro-tools, monthly behavioral insights, community access, 50 monthly credits",
      highlighted: false,
    },
    {
      tier: "strategist",
      name: "Strategist",
      price: 149,
      description: "For established professionals leading teams and client relationships.",
      features: "20+ lexicons, full micro-tool suite, analytics dashboard, priority concierge support, unlimited credits",
      highlighted: true,
    },
    {
      tier: "sovereign",
      name: "Sovereign",
      price: 499,
      description: "For executive leadership and organizational transformation.",
      features: "Dedicated communication architect, organization lexicons, predictive modeling, crisis protocol development",
      highlighted: false,
    },
  ]);

  await db.insert(professionalsTable).values([
    {
      name: "Dr. Sarah Jenkins",
      role: "Clinical Psychologist",
      niche: "CBT, trauma, and executive resilience",
      bio: "Clinical psychologist helping leaders communicate through pressure, conflict, and sensitive change.",
      rating: 4.9,
      reviewCount: 124,
      priceText: 80,
      priceVoice: 120,
      priceVideo: 150,
      availabilityStatus: "available",
      languages: "English, Bulgarian",
      photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
      specializations: "Restructuring communication, emotional regulation, trust repair",
      yearsExperience: 15,
    },
    {
      name: "Aisha Khan",
      role: "Legal Counsel",
      niche: "Corporate law, employment risk, compliance",
      bio: "Corporate counsel focused on clear, defensible language for high-stakes professional decisions.",
      rating: 4.9,
      reviewCount: 145,
      priceText: 120,
      priceVoice: 210,
      priceVideo: 300,
      availabilityStatus: "available",
      languages: "English",
      photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      specializations: "Contracts, employment communication, compliance positioning",
      yearsExperience: 18,
    },
    {
      name: "James Chen",
      role: "Financial Advisor",
      niche: "Wealth strategy and business planning",
      bio: "Advisor helping founders and executives align financial decisions with calm stakeholder communication.",
      rating: 4.7,
      reviewCount: 210,
      priceText: 100,
      priceVoice: 180,
      priceVideo: 250,
      availabilityStatus: "busy",
      languages: "English, Mandarin",
      photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      specializations: "Founder finance, runway planning, board communication",
      yearsExperience: 16,
    },
  ]);

  await db.insert(lexiconsTable).values([
    {
      name: "Founder Clarity Lexicon",
      description: "Language patterns for founders under pressure: calm, precise, decisive.",
      terms: "decision memo, runway clarity, stakeholder confidence, risk framing",
      category: "Leadership",
    },
    {
      name: "Clinical Psychologist Lexicon",
      description: "Therapeutic, boundary-aware language for sensitive professional correspondence.",
      terms: "validation, safety planning, collaborative framing, scope boundaries",
      category: "Clinical",
    },
    {
      name: "Legal Counsel Lexicon",
      description: "Clear and defensible phrasing for legal, HR, and compliance contexts.",
      terms: "without prejudice, documented basis, risk exposure, compliance posture",
      category: "Legal",
    },
  ]);

  console.log("Seed complete.");
  await pool.end();
}

main().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
