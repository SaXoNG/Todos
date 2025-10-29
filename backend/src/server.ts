import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import listsRouter from "./routes/listsRouter";
import todosRouter from "./routes/todosRouter";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "✅ Сервер працює" });
});

app.use("/api/lists", listsRouter);
app.use("/api/todos", todosRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущено на порту ${PORT}`));
