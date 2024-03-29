declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'production' | 'development' | 'devserver';
      Settings_Dir: string;
      IS_Packaged: boolean;
    }
  }
}

export {};
