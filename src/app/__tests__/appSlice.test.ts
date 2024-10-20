import { appReducer, AppInitialStateType, setAppError, setAppStatus, initializeApp } from "app/appSlice";
import { TestAction } from "common/types/types";

let startState: AppInitialStateType;

beforeEach(() => {
  startState = {
    error: null,
    status: "idle",
    isInitialized: false,
  };
});

test("status should be changed to the correct value", () => {
  const endState = appReducer(startState, setAppStatus({ status: "loading" }));

  expect(endState.status).toBe("loading");
});

test("error should be changed to the correct value", () => {
  const endState = appReducer(startState, setAppError({ error: "some error" }));

  expect(endState.error).toBe("some error");
});

test("app should be initilized", () => {
  const action: TestAction<typeof initializeApp.fulfilled> = {
    type: initializeApp.fulfilled.type,
    payload: {
      value: true,
    },
  };

  const endState = appReducer(startState, action);

  expect(endState.isInitialized).toBeTruthy();
});
