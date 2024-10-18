import { AppRootStateType, AppThunkDispatch } from "state/store";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppThunkDispatch;
  rejectValue: null;
}>();
