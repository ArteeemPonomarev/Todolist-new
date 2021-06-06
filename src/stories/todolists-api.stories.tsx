import React, {useEffect, useState} from 'react'
import {todoApi} from '../api/todolist-api';

export default {
    title: 'API'
}

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '9b6aada9-34d3-4135-a32f-7e9aacf37623'
    }
}


export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todoApi.getTodos()
            .then((res) => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todoApi.createTodo('Redux')
            .then((res) => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'deb8e37d-8dc2-457b-a915-5d30d0b48f46';
        todoApi.deleteTodo(todolistId)
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '13092f24-ea56-453d-af4b-9b07cefaa729';
        const updatedTitle = 'Axios';
        todoApi.updateTodoTitle(todolistId, updatedTitle)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '3c71d1e5-ab31-48aa-8b10-313686ebb882';
        todoApi.getTasks(todolistId)
            .then((res) => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}


export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '3c71d1e5-ab31-48aa-8b10-313686ebb882';
        const title = 'Test Task';
        todoApi.createTask(todolistId, title)
            .then((res) => {
                setState(res.data);
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '3c71d1e5-ab31-48aa-8b10-313686ebb882';
        const taskId = "2d9d58fd-5922-4e5f-a1d8-b921e6fbd81d";
        todoApi.deleteTask(todolistId, taskId)
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '3c71d1e5-ab31-48aa-8b10-313686ebb882';
        const taskId = "a9951d0d-304a-44cd-a4b0-ef9ba3a72f74";
        const model = {
            title: 'React-Redux',
            description: null,
            status: 0,
            priority: 1,
            startDate: null,
            deadline: null
        }
        todoApi.updateTask(todolistId, taskId, model)
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}