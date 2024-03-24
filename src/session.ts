import { Attendee } from './attendee';

export interface Session {
  host: string;
  title: string;
  attendees: Attendee[];
}

export function createSession(data: Partial<Session> = {}): Session {
  return {
    host: data.host,
    title: data.title || 'My Attendance',
    attendees: data.attendees || [],
  };
}
