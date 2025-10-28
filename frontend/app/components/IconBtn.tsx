import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import { MouseEvent } from "react";

type Props = {
  type?: "button" | "submit";
  icon: "delete" | "edit" | "cancel" | "done";
  onClick?: () => void;
  onMouseDown?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const IconBtn = ({ type = "button", icon, onClick }: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center justify-center p-0 hover:bg-black/10 rounded-full h-7 w-7 cursor-pointer"
    >
      {icon === "delete" && <DeleteIcon sx={{ fontSize: 20 }} />}
      {icon === "edit" && <EditIcon sx={{ fontSize: 20 }} />}
      {icon === "cancel" && <CloseIcon sx={{ fontSize: 20 }} />}
      {icon === "done" && <CheckIcon sx={{ fontSize: 20 }} />}
    </button>
  );
};
