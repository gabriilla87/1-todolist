import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";

type PropsType = {
  onClick: () => void;
};

export const LogoutButton = ({ onClick }: PropsType) => {
  return (
    <IconButton aria-label={"logout"} onClick={onClick}>
      <LogoutIcon color={"action"} />
    </IconButton>
  );
};
