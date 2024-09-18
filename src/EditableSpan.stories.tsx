import {EditableSpan} from "./EditableSpan";
import {action} from "@storybook/addon-actions"

export default {
    title: "Editable Span"
}

const editableSpanOnChangeHandler = action("Value changed")


export const EditableSpanDemo = () => {
    return <EditableSpan title={"Cringe"} onChange={editableSpanOnChangeHandler}/>
}