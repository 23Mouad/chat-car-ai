export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface UserProfile {
  name?: string;
  age?: string;
  country?: string;
  gender?: string;
  language?: "English" | "French" | "Arabic" | "Turkish";
}

export type ProfileKey = keyof UserProfile;
