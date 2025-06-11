
// FirebaseUser import removed as Firebase auth is no longer used.
// export interface UserProfile extends FirebaseUser {
// Add any custom profile properties here if needed
// }

// UserProfile is no longer needed if auth is removed.
export interface UserProfile {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}


export interface HistoryEntry {
  id: string;
  // userId: string; // userId might be removed if no user concept
  articleUrl?: string | null;
  articleText?: string | null;
  summary: string;
  modelUsed: string;
  // createdAt: number; // Timestamps less relevant without db persistence
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
