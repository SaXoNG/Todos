import express from "express";
import { pool } from "../db/index";

const router = express.Router();

type TodoPosition = {
  position: number;
  id: string;
  listId: string;
};

router.put("/:listId/reorder", async (req, res) => {
  const { listId } = req.params;
  const newOrder = req.body;

  try {
    const queries = newOrder.map((t: TodoPosition) =>
      pool.query("UPDATE todos SET position=$1 WHERE id=$2 AND list_id=$3", [
        t.position,
        t.id,
        listId,
      ])
    );

    await Promise.all(queries);
    res.json({ message: "Order updated" });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:listId", async (req, res) => {
  const { listId } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
         l.id AS list_id,
         l.title AS list_title,
         t.id AS todo_id,
         t.title AS todo_title,
         t.description,
         t.status,
         t.position
       FROM lists l
       LEFT JOIN todos t ON l.id = t.list_id
       WHERE l.id = $1
       ORDER BY t.position ASC NULLS LAST`,
      [listId]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "List not found" });

    const listData = {
      id: result.rows[0].list_id,
      title: result.rows[0].list_title,
      todos: result.rows
        .filter((r) => r.todo_id)
        .map((r) => ({
          id: r.todo_id,
          title: r.todo_title,
          description: r.description,
          status: r.status,
          position: r.position,
        })),
    };

    res.json(listData);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  try {
    const result = await pool.query(
      "INSERT INTO lists (id, title) VALUES (gen_random_uuid(), $1) RETURNING *",
      [title]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:listId", async (req, res) => {
  const { listId } = req.params;
  const { title, status, description } = req.body;

  try {
    const list = await pool.query("SELECT id FROM lists WHERE id=$1", [listId]);
    if (list.rows.length === 0)
      return res.status(404).json({ error: "List not found" });

    await pool.query(
      "UPDATE todos SET position = position + 1 WHERE list_id=$1",
      [listId]
    );

    const todo = await pool.query(
      "INSERT INTO todos (title, list_id, status, description, position) VALUES ($1, $2, $3, $4, 1) RETURNING *",
      [title, listId, status || "todo", description || ""]
    );

    res.status(201).json(todo.rows[0]);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:listId/:todoId", async (req, res) => {
  const { listId, todoId } = req.params;
  const { title, status, description } = req.body;

  try {
    const updated = await pool.query(
      "UPDATE todos SET title=$1, status=$2, description=$3 WHERE id=$4 AND list_id=$5 RETURNING *",
      [title, status, description, todoId, listId]
    );

    if (updated.rows.length === 0)
      return res.status(404).json({ error: "Todo not found" });

    res.json(updated.rows[0]);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:listId/:todoId", async (req, res) => {
  const { listId, todoId } = req.params;

  try {
    const deleted = await pool.query(
      "DELETE FROM todos WHERE id=$1 AND list_id=$2 RETURNING *",
      [todoId, listId]
    );

    if (deleted.rows.length === 0)
      return res.status(404).json({ error: "Todo not found" });

    res.json({ message: "Todo deleted", todo: deleted.rows[0] });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
