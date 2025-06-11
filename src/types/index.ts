import type { User as FirebaseUser } from 'firebase/auth';

export interface UserProfile extends FirebaseUser {
  // Add any custom profile properties here if needed
}

export interface HistoryEntry {
  id: string;
  userId: string;
  articleUrl?: string | null;
  articleText?: string | null;
  summary: string;
  modelUsed: string;
  createdAt: number; // Store as Firestore Timestamp.toDate().getTime() or serverTimestamp
  generatedContent?: {
    platform: 'linkedin' | 'twitter' | 'newsletter';
    tone?: string;
    post: string;
  }[];
}

export type AiModel = "Gemini Flash" | "OpenAI GPT-4" | "Grok" | "Mistral Large" | "Mistral (Self-Hosted)";
export const AiModelOptions: AiModel[] = ["Gemini Flash", "OpenAI GPT-4", "Grok", "Mistral Large", "Mistral (Self-Hosted)"];

export type SocialPlatform = "linkedin" | "twitter" | "newsletter";
export const SocialPlatformOptions: SocialPlatform[] = ["linkedin", "twitter", "newsletter"];
