import { Attendee, createAttendeeInterface } from '../interface/attendee';
import { createSessionInterface, Session } from '../interface/session';
import { customAlphabet, nanoid } from 'nanoid';
import { generateSessionCSV } from '../util/dataProcessing';

const sessions = new Map<string, Session>();

const createRandomSession = () => {
  const attendees = new Map<string, Attendee>();

  populateAttendees(attendees);

  return createSessionInterface({
    host: nanoid(),
    title: 'My Attendance',
    attendees: attendees,
  });
};

const populateAttendees = (attendees: Map<string, Attendee>) => {
  for (let i = 1; i <= Math.floor(Math.random() * 10) + 1; i++) {
    const attendee = createAttendeeInterface({
      username: `user${i}`,
      correctAns: Math.floor(Math.random() * 5),
    });
    attendees.set(nanoid(), attendee);
  }
};

// main
const generateSessionCode = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  5
);

const sessionCode = generateSessionCode();
sessions.set(sessionCode, createRandomSession());

console.log(sessions);
sessions.forEach((sessions) => console.log(sessions.attendees));

generateSessionCSV(sessionCode, sessions.get(sessionCode));
