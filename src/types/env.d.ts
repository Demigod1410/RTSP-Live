// This file doesn't get used anywhere, but it provides typings for environment variables
namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}