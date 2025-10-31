
export enum AppMode {
  ASK_QUESTION = 'Ask a Question',
  VERIFY_ARTICLE = 'Verify Article Snippet',
  FIND_DOCTOR = 'Find a Doctor',
  HEALTH_TIP = 'Health Tip of the Day',
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  bio: string;
  imageUrl: string;
  profileUrl: string;
}

export enum MessageSender {
  USER = 'user',
  BOT = 'bot',
}

export interface ChatMessage {
  sender: MessageSender;
  text: string;
}
