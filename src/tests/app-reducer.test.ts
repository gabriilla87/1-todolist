import {appReducer, InitialStateType, setAppError, setAppStatus} from "../state/app-reducer";

let startState: InitialStateType

beforeEach(() => {
    startState = {
        error: null,
        status: "idle"
    }
})

test("status should be changed to the correct value", () => {
    const endState = appReducer(startState, setAppStatus("loading"))

    expect(endState.status).toBe("loading")
})

test("error should be changed to the correct value", () => {
    const endState = appReducer(startState, setAppError("some error"))

    expect(endState.error).toBe("some error")
})