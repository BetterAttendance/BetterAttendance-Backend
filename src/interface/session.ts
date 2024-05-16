import { Quiz } from './quiz';
import { Attendee } from './attendee';

export interface Session {
  host: string;
  title: string;
  status: string; // 'waiting', 'running', 'ended'
  attendees: Map<string, Attendee>;
  quizzes: Quiz[];
  answeredAttendees: number;
}

export function createSessionInterface(data: Partial<Session> = {}): Session {
  return {
    host: data.host,
    title: data.title || 'My Attendance',
    status: data.status || 'waiting',
    attendees: data.attendees || new Map<string, Attendee>(),
    quizzes: [],
    answeredAttendees: 0,
  };
}
