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
    CHECK_IF_HOST: 'c-session:check-if-host',
    VALIDATE_SESSION: 'c-session:validate',
  },
  SERVER: {
    JOIN_SESSION: 's-session:join',
    HOST_QUIT_SESSION: 's-session:host-quit',
    ATTENDEE_QUIT_SESSION: `s-session:attendee-quit`,
    CREATE_SESSION: 's-session:create',
    CHECK_IF_HOST: 's-session:check-if-host',
    VALIDATE_SESSION: 's-session:validate',
  },
};

export default EVENTS;
