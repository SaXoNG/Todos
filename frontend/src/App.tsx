import { useEffect } from "react";
import { useTodoStore } from "./storage/todoStore";
import { Header } from "./components/Header";
import { Topbar } from "./components/Topbar";
import { TodoTable } from "./components/TodoTable";
import { Loader } from "./components/Loader";

function App() {
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
    <div className="h-full flex flex-col bg-green-700 overflow-hidden">
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

export default App;
