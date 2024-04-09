import { Quiz } from "./quiz";

export interface Session {
  host: string;
  title: string;
  attendees: Map<String, String>;
  quizzes: Array<Quiz>;
}

export function createSessionInterface(data: Partial<Session> = {}): Session {
  return {
    host: data.host,
    title: data.title || 'My Attendance',
    attendees: data.attendees || new Map<String, String>(),
    quizzes: new Array<Quiz>,
  };
}
