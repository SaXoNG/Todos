"use client";

import { Topbar } from "./components/Topbar";
import { TodoTable } from "./components/TodoTable";
import { Header } from "./components/Header";
import { useEffect } from "react";
import { useTodoStore } from "./storage/todoStore";
import { Loader } from "./components/Loader";

export default function Home() {
  const { loading, todosList, fetchTodoList, setLoading } = useTodoStore();

  useEffect(() => {
    const value = localStorage.getItem("listID");

    if (value) {
      fetchTodoList(value);
    } else {
      setLoading(false);
    }
  }, [fetchTodoList, setLoading]);

  return (
    <div className="h-full flex flex-col">
      <Header />
      <Topbar />
      <TodoTable todos={todosList?.todos} />
      {loading === true && <Loader />}
      {!todosList && !loading && (
        <div className="flex-1 flex justify-center items-center font-bold text-6xl">
          List is not selected!
        </div>
      )}
    </div>
  );
}
