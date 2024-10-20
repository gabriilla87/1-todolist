import { authReducer, setIsLoggedIn } from "features/auth/model/authSlice";

let startState: { isLoggedIn: boolean };

beforeEach(() => {
  startState = {
    isLoggedIn: false,
  };
});

test("user should logged in", () => {
  const endState = authReducer(startState, setIsLoggedIn({ value: true }));

  expect(endState.isLoggedIn).toBeTruthy();
});
