const EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  UPDATE_USERS: 'update-connected-users',
  DISCONNECT_USERS: 'disconnect-users',
  CLIENT: {
    JOIN_SESSION: 'c-session:join',
    HOST_QUIT_SESSION: 'c-session:host-quit',
    ATTENDEE_QUIT_SESSION: `c-session:attendee-quit`,
    CREATE_SESSION: 'c-session:create',
    START_QUIZ: 'c-session:start-quiz',
    SUBMIT_ANSWER: 'c-session:submit-answer',
    NEXT_QUIZ: 'c-session:next-quiz',
    END_QUIZ: 'c-session:end-quiz',
    DOWNLOAD_CSV: 'c-session:download-csv',
    CSV_DOWNLOADED: 'c-session:csv-downloaded',
  },
  SERVER: {
    JOIN_SESSION: 's-session:join',
    HOST_QUIT_SESSION: 's-session:host-quit',
    ATTENDEE_QUIT_SESSION: `s-session:attendee-quit`,
    CREATE_SESSION: 's-session:create',
    VALIDATE_SESSION_CODE: 's-session:validate',
    START_QUIZ: 's-session:start-quiz', // To tell the attendee front-end to switch to quiz mode
    QUIZ_STARTED: 's-session:quiz-started',
    QUIZ_RESULT: 's-session:quiz-result',
    NEXT_QUIZ: 's-session:next-quiz',
    END_QUIZ: 's-session:end-quiz',
    DOWNLOAD_CSV: 's-session:download-csv',
  },
};

export default EVENTS;
