import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../lib/supabaseClient";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    const { title } = req.body as { title?: string };

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }

    try {
      const { data, error } = await supabaseAdmin
        .from("lists")
        .insert([{ title }])
        .select();

      if (error) throw error;

      return res.status(201).json({
        ...data![0],
        todos: [],
      });
    } catch (err: any) {
      console.error("❌ Error creating list:", err.message);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === "GET") {
    try {
      const { data, error } = await supabaseAdmin
        .from("lists")
        .select("*")
        .order("title", { ascending: true });

      if (error) throw error;

      const listsWithTodos = data!.map((list) => ({
        ...list,
        todos: [],
      }));

      return res.status(200).json(listsWithTodos);
    } catch (err: any) {
      console.error("❌ Error fetching lists:", err.message);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
