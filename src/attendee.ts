export interface Attendee {
  userId: string;
  username: string;
}

export function createAttendee(data: Partial<Attendee> = {}): Attendee {
  return {
    userId: data.userId,
    username: data.username,
  };
}
