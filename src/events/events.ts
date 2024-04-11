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
  },
  SERVER: {
    JOIN_SESSION: 's-session:join',
    HOST_QUIT_SESSION: 's-session:host-quit',
    ATTENDEE_QUIT_SESSION: `s-session:attendee-quit`,
    CREATE_SESSION: 's-session:create',
    VALIDATE_SESSION_CODE: 's-session:validate',
    VALIDATE_NAME: 's-session:validate-name',
    QUIZ_STARTED: 's-session:quiz-started',
  },
};

export default EVENTS;
