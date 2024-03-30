const EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  UPDATE_USERS: 'update-connected-users',
  DISCONNECT_USERS: 'disconnect-users',
  CLIENT: {
    JOIN_SESSION: 'c-join-session',
    HOST_QUIT_SESSION: 'c-host-quit-session',
    ATTENDEE_QUIT_SESSION: `c-attendee-quit-session`,
    CREATE_SESSION: 'c-create-session',
  },
  SERVER: {
    JOIN_SESSION: 's-join-session',
    HOST_QUIT_SESSION: 's-host-quit-session',
    ATTENDEE_QUIT_SESSION: `s-attendee-quit-session`,
    CREATE_SESSION: 's-create-session',
    VALIDATE_SESSION_CODE: 's-validate-session-code',
    VALIDATE_HOST: 's-validate-host',
  },
};

export default EVENTS;
