import { Header } from "./components/Header";
import { Topbar } from "./components/Topbar";
import { TodoTable } from "./components/TodoTable";
import { GlobalInfoModal } from "./components/GlobalInfoModal";

function App() {
  return (
    <div className="h-full flex flex-col bg-green-700 overflow-hidden">
      <Header />
      <Topbar />
      <TodoTable />
      <GlobalInfoModal />
    </div>
  );
}

export default App;
