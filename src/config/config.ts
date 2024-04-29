const CONFIG = {
  PORT: '3333',
  DEBUG: true,
  corsOrigin: '*',
  QUIZ: {
    MAX_OPTIONS: 3,
    TYPE: {
      NUMBER: 'number',
      PICS: 'pics',
      QUESTION: 'question',
      TF: 'true_false',
    },
  },
};

export default CONFIG;
