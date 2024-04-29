export interface Attendee {
    username: string;
    correctAns: number;
}

export function createAttendeeInterface(data: Partial<Attendee> = {}): Attendee {
    return {
        username: data.username,
        correctAns: data.correctAns || 0,
    };
}