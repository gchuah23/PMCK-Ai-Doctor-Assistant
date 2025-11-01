export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  bio: string;
}

export enum MessageSender {
  USER = 'user',
  BOT = 'bot',
}

export interface ChatMessage {
  sender: MessageSender;
  text: string;
}

// FIX: Add AppMode enum as it is used in WelcomeScreen.tsx and was missing.
export enum AppMode {
  ASK_QUESTION = 'ASK_QUESTION',
  VERIFY_ARTICLE = 'VERIFY_ARTICLE',
  FIND_DOCTOR = 'FIND_DOCTOR',
  HEALTH_TIP = 'HEALTH_TIP',
}
