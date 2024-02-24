const EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  UPDATE_USERS: 'update-connected-users',
  CLIENT: {
    JOIN_SESSION: 'c-join-session',
    LEAVE_SESSION: 'c-leave-session',
    CREATE_SESSION: 'c-create-session',
  },
  SERVER: {
    JOIN_SESSION: 's-join-session',
    LEAVE_SESSION: 's-leave-session',
    CREATE_SESSION: 's-create-session',
  },
};

export default EVENTS;
