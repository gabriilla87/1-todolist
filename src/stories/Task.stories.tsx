import {Task} from "../features/TodolistsList/Todolist/Task/Task";
import {action} from "@storybook/addon-actions"
import {ReduxStoreProviderDecorator} from "./decorators/ReduxStoreProviderDecorator";
import {TaskPriorities, TaskStatuses} from "../api/todolists-api";

export default {
    title: "Task",
    decorators: [ReduxStoreProviderDecorator]
}

const removeTaskCallback = action("Task removed")
const changeTaskStatusCallback = action("Status changed")
const changeTaskTitleCallback = action("Title changed")


export const TasksWithCheckedAndUncheckedCheckbox = () => {
    return (
        <>
            <Task task={
                {
                    id: "taskId1",
                    status: TaskStatuses.Completed,
                    title: "Checked Task",
                    todoListId: "todolistId1",
                    addedDate: "",
                    order: 0,
                    deadline: "",
                    description: "",
                    priority: TaskPriorities.Low,
                    startDate: "",
                    entityStatus: "idle"
                }
            }
                  todolistId={"todolistId1"}
                  removeTask={removeTaskCallback}
                  changeTaskTitle={changeTaskTitleCallback}
                  changeTaskStatus={changeTaskStatusCallback}
            />
            <Task task={
                {
                    id: "taskId2",
                    status: TaskStatuses.Completed,
                    title: "Unchecked Task",
                    todoListId: "todolistId2",
                    addedDate: "",
                    order: 0,
                    deadline: "",
                    description: "",
                    priority: TaskPriorities.Low,
                    startDate: "",
                    entityStatus: "idle"
                }
            }
                  todolistId={"todolistId2"}
                  removeTask={removeTaskCallback}
                  changeTaskTitle={changeTaskTitleCallback}
                  changeTaskStatus={changeTaskStatusCallback}
            />
        </>
    )
}