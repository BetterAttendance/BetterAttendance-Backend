const CONFIG = {
  PORT: '3333',
  DEBUG: true,
  corsOrigin: '*',
  QUIZ: {
    MAX_QUESTIONS: 4,
    MAX_OPTIONS: 3,
    MAX_PICS: 10,
    TYPE: {
      NUMBER: 'number',
      PICS: 'pics',
      OBJECT: 'object',
    },
  },
};

export default CONFIG;
