import express, { Request, Response } from "express";
import cors from "cors";

import todosRouter from "./routes/todosRouter";
import listsRouter from "./routes/listsRouter";
import notFound from "./middleware/not-found";
import { errorHandler } from "./middleware/errorHandler";
import { corsOptions } from "./config/cors";

const app = express();

app.use(cors(corsOptions));

app.use(express.json());
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    version: "1.0.0",
  });
});
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/lists", listsRouter);
app.use("/api/todos", todosRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
