
export enum AppMode {
  ASK_QUESTION = 'Ask a Question',
  VERIFY_ARTICLE = 'Verify Article Snippet',
  FIND_DOCTOR = 'Find a Doctor',
  HEALTH_TIP = 'Health Tip of the Day',
}

export interface Doctor {
  /**
   * Stable slug identifier for the doctor. This should match the ID field in
   * data/doctor_list.json and is used as a key for lookups and validation.
   */
  id: string;
  /** The doctor's full name including honorifics (e.g., "Dr."). */
  name: string;
  /** The doctor's medical specialty or title. */
  specialty: string;
  /** A short biography of the doctor. */
  bio: string;
  /** URL to an image of the doctor. */
  imageUrl: string;
  /** URL to the doctor's official profile on the PMCK website. */
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
