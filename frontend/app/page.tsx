"use client";

import { Header } from "@/components/Header";
import { Loader } from "@/components/Loader";
import { TodoTable } from "@/components/TodoTable";
import { Topbar } from "@/components/Topbar";
import { useTodoStore } from "@/storage/todoStore";
import { useEffect } from "react";

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
