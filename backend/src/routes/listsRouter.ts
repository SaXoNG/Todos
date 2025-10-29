import { Router } from "express";
import { supabaseAdmin } from "../lib/supabaseClient";

const router = Router();

router.post("/", async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("lists")
      .insert([{ title }])
      .select();

    if (error) throw error;

    res.status(201).json({
      ...data[0],
      todos: [],
    });
  } catch (err: any) {
    console.error("❌ Error creating list:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("lists")
      .select("*")
      .order("title", { ascending: true });

    if (error) throw error;

    const listsWithTodos = data.map((list) => ({
      ...list,
      todos: [],
    }));

    res.json(listsWithTodos);
  } catch (err: any) {
    console.error("❌ Error fetching lists:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
