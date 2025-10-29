import { Router } from "express";
import { supabaseAdmin } from "../lib/supabaseClient";

const router = Router();

type TodoPosition = {
  position: number;
  id: string;
};

const validStatuses = ["todo", "in_process", "completed"] as const;
type TodoStatusType = (typeof validStatuses)[number];

router.put("/:listId/reorder", async (req, res) => {
  const { listId } = req.params;
  const newOrder: TodoPosition[] = req.body;

  try {
    const queries = newOrder.map((t) =>
      supabaseAdmin
        .from("todos")
        .update({ position: t.position })
        .eq("id", t.id)
        .eq("list_id", listId)
    );

    await Promise.all(queries);
    res.json({ message: "Order updated" });
  } catch (err: any) {
    console.error("❌ Error reordering todos:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:listId", async (req, res) => {
  const { listId } = req.params;

  try {
    const { data: todos, error } = await supabaseAdmin
      .from("todos")
      .select("*")
      .eq("list_id", listId)
      .order("position", { ascending: true });

    if (error) throw error;

    res.json({ listId, todos: todos || [] });
  } catch (err: any) {
    console.error("❌ Error fetching todos:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:listId", async (req, res) => {
  const { listId } = req.params;
  let { title, status, description } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Title is required" });
  }

  status = status || "todo";
  description = description || "";

  if (!validStatuses.includes(status as TodoStatusType)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const { data: todos, error: fetchError } = await supabaseAdmin
      .from("todos")
      .select("id, position")
      .eq("list_id", listId)
      .order("position", { ascending: true });

    if (fetchError) throw fetchError;

    const updateQueries = todos.map((t) =>
      supabaseAdmin
        .from("todos")
        .update({ position: t.position + 1 })
        .eq("id", t.id)
    );
    await Promise.all(updateQueries);

    const { data, error } = await supabaseAdmin
      .from("todos")
      .insert([{ title, list_id: listId, status, description, position: 1 }])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (err: any) {
    console.error("❌ Error creating todo:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:listId/:todoId", async (req, res) => {
  const { listId, todoId } = req.params;
  const { title, status, description } = req.body;

  if (!title && !status && !description) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  if (status && !validStatuses.includes(status as TodoStatusType)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  const updateData: Partial<{
    title: string;
    status: TodoStatusType;
    description: string;
  }> = {};
  if (title !== undefined) updateData.title = title;
  if (status !== undefined) updateData.status = status;
  if (description !== undefined) updateData.description = description;

  try {
    const { data, error } = await supabaseAdmin
      .from("todos")
      .update(updateData)
      .eq("id", todoId)
      .eq("list_id", listId)
      .select();

    if (error) throw error;
    if (!data || data.length === 0)
      return res.status(404).json({ error: "Todo not found" });

    res.json(data[0]);
  } catch (err: any) {
    console.error("❌ Error updating todo:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:listId/:todoId", async (req, res) => {
  const { listId, todoId } = req.params;

  try {
    const { data, error } = await supabaseAdmin
      .from("todos")
      .delete()
      .eq("id", todoId)
      .eq("list_id", listId)
      .select();

    if (error) throw error;
    if (!data || data.length === 0)
      return res.status(404).json({ error: "Todo not found" });

    res.json({ message: "Todo deleted", todo: data[0] });
  } catch (err: any) {
    console.error("❌ Error deleting todo:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
