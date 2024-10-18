import { appReducer, AppInitialStateType, setAppError, setAppStatus } from "state/appSlice";

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
