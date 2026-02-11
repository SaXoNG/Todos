import { Notification } from "./Notification";
import { ShowAllListsButton } from "./showAllListsButton";

export const Header = () => {
  return (
    <div className="relative h-30 flex-shrink-0 flex items-center justify-center bg-green-800 text-gray-900">
      <ShowAllListsButton />
      <Notification />
      <h1 className="text-8xl font-bold">todos</h1>
    </div>
  );
};
