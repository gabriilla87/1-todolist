type StateType = {
    age: number
    childrenCount: number
    name: string
}

type ActionType = {
    type: string
    [key: string]: any
}

export const userReducer = (state: StateType, action: ActionType ) => {
    switch(action.type) {
        case "BLABLA1":

        case "YO":

        default:
            throw new Error("I don't understand this action type")
    }
}