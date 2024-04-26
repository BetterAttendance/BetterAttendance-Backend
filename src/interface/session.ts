import { Attendee } from './attendee';

export interface Session {
  host: string;
  title: string;
  attendees: Map<string, Attendee>;
}

export function createSessionInterface(data: Partial<Session> = {}): Session {
  return {
    host: data.host,
    title: data.title || 'My Attendance',
    attendees: data.attendees || new Map<string, Attendee>(),
  };
}
