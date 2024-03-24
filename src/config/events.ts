const EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  UPDATE_USERS: 'update-connected-users',
  CLIENT: {
    JOIN_SESSION: 'c-join-session',
    HOST_QUIT_SESSION: 'c-host-quit-session',
    USER_QUIT_SESSION: `c-user-quit-session`,
    CREATE_SESSION: 'c-create-session',
    CHECK_IF_HOST: 'c-check-if-host',
    VALIDATE_SESSION: 'c-validate-session',
  },
  SERVER: {
    JOIN_SESSION: 's-join-session',
    HOST_QUIT_SESSION: 's-host-quit-session',
    USER_QUIT_SESSION: `s-user-quit-session`,
    CREATE_SESSION: 's-create-session',
    CHECK_IF_HOST: 's-check-if-host',
    VALIDATE_SESSION: 's-validate-session',
  },
};

export default EVENTS;
