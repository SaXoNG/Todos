import { JSX } from "react";
import { Notification } from "../components/Notification";

export const Header = (): JSX.Element => {
  return (
    <div className="relative h-30 flex-shrink-0 flex items-center justify-center bg-green-800 text-gray-900">
      <h1 className="text-8xl font-bold">todos</h1>
      <Notification />
    </div>
  );
};
