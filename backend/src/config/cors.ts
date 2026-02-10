import { CorsOptions } from "cors";
import { env } from "process";

const allowedOrigins = env.CLIENT_URLS?.split(",").map((o) => o.trim()) ?? [];

export const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
