import { stringify } from 'csv-stringify';
import fs from 'fs';
import { Session } from '../interface/session';
import { Attendee } from '../interface/attendee';
import path from 'path';
import CONFIG from '../config/config';

const dir = CONFIG.OUTPUT_DIR;

const convertAttendeesToArray = (attendees: Map<string, Attendee>) => {
  const attendeesArray = [];

  attendees.forEach((value, key) => {
    const newAttendee = {
      userId: key,
      username: value.username,
      correctAns: value.correctAns,
    };
    attendeesArray.push(newAttendee);
  });

  return attendeesArray;
};

export function generateSessionCSV(sessionCode: string, session: Session) {
  const attendeesArray = convertAttendeesToArray(session.attendees);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const filePath = path.join(dir, sessionCode + '.csv');

  // Convert the data to CSV format
  stringify(attendeesArray, { header: true }, (err, output) => {
    if (err) {
      console.error('Error:', err);
      return;
    }

    const metadata = [
      '# sessionCode: ' + sessionCode,
      '# hostId: ' + session.host,
      '# title: ' + session.title,
      '# created: ' + new Date().toUTCString(),
    ];
    const csvWithMetadata = metadata.join('\n') + '\n' + output;

    // Write the CSV data to a file
    fs.writeFile(filePath, csvWithMetadata, (err) => {
      if (err) {
        console.error('Error:', err);
        return;
      }
      console.log('CSV file generated successfully!');
    });
  });
}
