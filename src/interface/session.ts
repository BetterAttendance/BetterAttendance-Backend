import { Quiz } from "./quiz";

export interface Session {
  host: string;
  title: string;
  attendees: Map<String, String>;
  attendance: Map<String, boolean>;
}

export function createSessionInterface(data: Partial<Session> = {}): Session {
  return {
    host: data.host,
    title: data.title || 'My Attendance',
    attendees: data.attendees || new Map<String, String>(),
    attendance: data.attendance || new Map<String, boolean>(),  // Map of userId to attendance status
  };
}
