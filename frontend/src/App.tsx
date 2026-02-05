import { Header } from "./components/Header";
import { Topbar } from "./components/Topbar";
import { TodoTable } from "./components/TodoTable";

function App() {
  return (
    <div className="h-full flex flex-col bg-green-700 overflow-hidden">
      <Header />
      <Topbar />
      <TodoTable />
    </div>
  );
}

export default App;
