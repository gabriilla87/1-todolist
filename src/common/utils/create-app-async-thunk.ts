import { AppRootStateType, AppThunkDispatch } from "app/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CommonResponse } from "common/types/types";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppThunkDispatch;
  rejectValue: null | CommonResponse;
}>();
