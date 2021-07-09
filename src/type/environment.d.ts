declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'production' | 'development' | 'devserver';
      DB_PATH: string;
    }
  }
}

export {};
