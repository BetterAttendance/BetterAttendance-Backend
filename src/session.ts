export interface Session {
  host: string;
  title: string;
  attendees: Map<String, String>;
}

export function createSession(data: Partial<Session> = {}): Session {
  return {
    host: data.host,
    title: data.title || 'My Attendance',
    attendees: data.attendees || new Map<String, String>(),
  };
}
