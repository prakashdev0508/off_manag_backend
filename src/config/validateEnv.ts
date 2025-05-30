import { cleanEnv, str, port, bool, url } from "envalid";

export const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ["development", "production", "test", "staging", "uat"],
    }),
    PORT: port({ default: 5000 }),
    DATABASE_URL: url(),
    JWT_SECRET: str(),
  });
};
