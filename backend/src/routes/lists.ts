import express from "express";
import { pool } from "../db/index";

const router = express.Router();

router.post("/", async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO lists (id, title) VALUES (gen_random_uuid(), $1) RETURNING *",
      [title]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error("❌ Error creating list:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM lists ORDER BY title ASC");
    res.json(result.rows);
  } catch (err: any) {
    console.error("❌ Error fetching lists:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
