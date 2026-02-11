import { CorsOptions } from "cors";
import { env } from "process";

const allowedOrigins = [
  env.CLIENT_URL,
  env.DEV_CLIENT_URL,
];

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
