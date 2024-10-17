import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAppDispatch, useAppSelector } from "state/store";
import { setAppError } from "state/appSlice";

export function ErrorSnackbar() {
  const error = useAppSelector<string | null>((state) => state.app.error);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(setAppError({ error: null }));
  };

  return (
    <div>
      <Snackbar
        open={!!error}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={6000}
      >
        <Alert onClose={handleClose} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}
