const CONFIG = {
  PORT: '3333',
  DEBUG: true,
  corsOrigin: '*',
  QUIZ: {
    MAX_QUESTIONS: 4,
    MAX_OPTIONS: 3,
    MAX_PICS: 9,
    TYPE: {
      NUMBER: 'number',
      PICS: 'pics',
      OBJECT: 'object',
    },
  },
  OUTPUT_DIR: './output',
};

export default CONFIG;
