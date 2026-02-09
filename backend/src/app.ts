import express, { Request, Response } from "express";
import cors from "cors";

import todosRouter from "./routes/todosRouter";
import listsRouter from "./routes/listsRouter";
import notFound from "./middleware/not-found";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/lists", listsRouter);
app.use("/api/todos", todosRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
