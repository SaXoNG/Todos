import { Notification } from "../components/Notification";

export const Header = () => {
  return (
    <div className="relative h-30 flex-shrink-0 flex items-center justify-center bg-green-800 text-gray-900">
      <Notification />
      <h1 className="text-8xl font-bold">todos</h1>
    </div>
  );
};
