import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db/index";
import todosRouter from "./routes/todos";
import listsRouter from "./routes/lists";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/lists", listsRouter);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ message: "✅ Сервер працює", dbTime: result.rows[0].now });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: "Помилка підключення до БД" });
  }
});

app.use("/api/todos", todosRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущено на порту ${PORT}`));
