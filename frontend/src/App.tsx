import { Header } from "./components/header/Header";
import { Topbar } from "./components/header/Topbar";
import { GlobalModal } from "./components/modals/GlobalModal";
import { TodoTable } from "./components/todo-table/TodoTable";

function App() {
  return (
    <div className="h-full flex flex-col bg-green-700 overflow-hidden">
      <Header />
      <Topbar />
      <TodoTable />
      <GlobalModal />
    </div>
  );
}

export default App;
