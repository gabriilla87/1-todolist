import React, {useEffect, useState} from 'react'
import {todolistsApi} from "../api/todolists-api";

export default {
    title: 'API',
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsApi.getTodolist()
            .then(res => {
                setState(res.data)
            })
            .catch(error => {
                setState(error)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistsApi.createTodolist("Hop-hey-lalaley")
            .then(res => {
                setState(res.status)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "3337707e-7ee3-471b-a49c-1ff6b38bc27b"
        todolistsApi.deleteTodolist(todolistId)
            .then(res => {
                console.log(res)
                setState(res.status)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "b009a9e7-496c-4818-bec4-008d08aca038"
        todolistsApi.updateTodolistTitle(todolistId, "asdasdsdasd")
            .then(res => {
                setState(res.status)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = "b009a9e7-496c-4818-bec4-008d08aca038"
        todolistsApi.getTasks(todolistId)
            .then(res => {
                setState(res.data.items)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}

export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>("")
    const [title, setTitle] = useState<string>("")

    const onClickDeployHandler = () => {
        todolistsApi.createTask(todolistId, title)
            .then(res => {
                setState(res.data.resultCode)
            })
    }

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input type={"text"}
                       placeholder={"todolistId"}
                       value={todolistId}
                       onChange={(e) => setTodolistId(e.currentTarget.value)}
                />
                <input type={"text"}
                       placeholder={"title"}
                       value={title}
                       onChange={(e) => setTitle(e.currentTarget.value)}
                />
                <button onClick={onClickDeployHandler}>deploy</button>
            </div>
        </div>
    )
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>("")
    const [taskId, setTaskId] = useState<string>("")

    const onClickDeployHandler = () => {
        todolistsApi.deleteTask(todolistId, taskId)
            .then(res => {
                setState(res.data.resultCode)
            })
    }

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input type={"text"}
                       placeholder={"todolistId"}
                       value={todolistId}
                       onChange={(e) => setTodolistId(e.currentTarget.value)}
                />
                <input type={"text"}
                       placeholder={"taskId"}
                       value={taskId}
                       onChange={(e) => setTaskId(e.currentTarget.value)}
                />
                <button onClick={onClickDeployHandler}>deploy</button>
            </div>
        </div>
    )
}

export const UpdateTaskTitle = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>("")
    const [taskId, setTaskId] = useState<string>("")
    const [title, setTitle] = useState<string>("")

    const onClickDeployHandler = () => {
        todolistsApi.updateTaskTitle(todolistId, taskId, title)
            .then(res => {
                setState(res.data.resultCode)
            })
    }
    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input type={"text"}
                       placeholder={"todolistId"}
                       value={todolistId}
                       onChange={(e) => setTodolistId(e.currentTarget.value)}
                />
                <input type={"text"}
                       placeholder={"taskId"}
                       value={taskId}
                       onChange={(e) => setTaskId(e.currentTarget.value)}
                />
                <input type={"text"}
                       placeholder={"title"}
                       value={title}
                       onChange={(e) => setTitle(e.currentTarget.value)}
                />
                <button onClick={onClickDeployHandler}>deploy</button>
            </div>
        </div>
    )
}