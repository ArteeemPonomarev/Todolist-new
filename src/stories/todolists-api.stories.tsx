import React, {useState} from 'react'
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
    const getTodolists = () => {
        todoApi.getTodos()
            .then((res) => {
                setState(res.data);
            })
    }

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <button onClick={getTodolists}>Get Todos</button>
            </div>
        </div>
    )
}

export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [todoTitle, setTodoTitle] = useState<string>('')


    const createTodo = () => {
        todoApi.createTodo(todoTitle)
            .then((res) => {
                setState(res.data);
            })
            .finally(() => {
                setTodoTitle('')
            })

    }

    return (
        <div>
            {JSON.stringify(state)}
            <input placeholder={'todo title'}
                   onChange={e => setTodoTitle(e.currentTarget.value)}
                   value={todoTitle}/>
            <button onClick={createTodo}>Create Todo</button>
        </div>
    )
}

export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [todoId, setTodoId] = useState<string>('')

    const deleteTodolist = () => {
        todoApi.deleteTodo(todoId)
            .then((res) => {
                setState(res.data);
            })
            .finally(() => {
                setTodoId('')
            })
    }

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input placeholder={'todolistId'}
                       onChange={e => setTodoId(e.currentTarget.value)}
                       value={todoId}/>
                <button onClick={deleteTodolist}>Delete Todolist</button>
            </div>
        </div>
    )
}

export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    const [todoTitle, setTodoTitle] = useState<string>('')
    const [todoId, setTodoId] = useState<string>('')

    const updateTodo = () => {
        todoApi.updateTodoTitle(todoId, todoTitle)
            .then((res) => {
                setState(res.data)
            })
            .finally(() => {
                setTodoId('')
                setTodoTitle('')
            })
    }

    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input placeholder={'todo title'}
                       value={todoTitle}
                       onChange={e => setTodoTitle(e.currentTarget.value)}/>
                <input placeholder={'todo id'}
                       value={todoId}
                       onChange={e => setTodoId(e.currentTarget.value)}/>
                <button onClick={updateTodo}>Update todoList</button>
            </div>
        </div>
    )
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const [todoId, setTodoId] = useState<string>('')

    const getTasks = () => {
        todoApi.getTasks(todoId)
            .then((res) => {
                setState(res.data);
            })
            .finally(() => {

            })
    }


    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input placeholder={'todoID'}
                       value={todoId}
                       onChange={e => setTodoId(e.currentTarget.value)}/>
                <button onClick={getTasks}>Get Tasks</button>
            </div>
        </div>
    )
}


export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const [todoId, setTodoId] = useState<string>('')
    const [taskTitle, setTaskTitle] = useState<string>('')

    const createTask = () => {
        todoApi.createTask(todoId, taskTitle)
            .then((res) => {
                setState(res.data);
            })
            .finally(() => {
                setTaskTitle('')
                setTodoId('')
            })
    }


    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input placeholder={'todoId'}
                       value={todoId}
                       onChange={e => setTodoId(e.currentTarget.value)}/>
                <input placeholder={'taskTitle'}
                       value={taskTitle}
                       onChange={e => setTaskTitle(e.currentTarget.value)}/>
                <button onClick={createTask}>Create task</button>
            </div>
        </div>
    )
}

export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const [todoId, setTodoId] = useState<string>('')
    const [taskId, setTaskId] = useState<string>('')


    const deleteTask = () => {
        todoApi.deleteTask(todoId, taskId)
            .then((res) => {
                setState(res.data);
            })
            .finally(() => {
                setTodoId('')
                setTaskId('')
            })
    }




    return (
        <div>
            {JSON.stringify(state)}
            <div>
                <input placeholder={'todoId'}
                       value={todoId}
                       onChange={e => setTodoId(e.currentTarget.value)}/>
                <input placeholder={'taskId'}
                       value={taskId}
                       onChange={e => setTaskId(e.currentTarget.value)}/>
            </div>
            <button onClick={deleteTask}>Delete Task</button>
        </div>
    )
}


export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    const [todoId, setTodoId] = useState<string>('')
    const [taskId, setTaskId] = useState<string>('')
    const [taskTitle, setTaskTitle] = useState<string>('')


        const updateTask = () => {
            const model = {
                title: taskTitle,
                description: '',
                status: 0,
                priority: 1,
                startDate: '',
                deadline: ''
            }
            todoApi.updateTask(todoId, taskId, model)
                .then((res) => {
                    setState(res.data);
                })
        }


    return(
        <div>
            {JSON.stringify(state)}
            <div>
                <input placeholder={'todoId'}
                       value={todoId}
                       onChange={e => setTodoId(e.currentTarget.value)}/>
                <input placeholder={'taskId'}
                       value={taskId}
                       onChange={e => setTaskId(e.currentTarget.value)}/>
                <input placeholder={'taskTitle'}
                       value={taskTitle}
                       onChange={e => setTaskTitle(e.currentTarget.value)}/>
            </div>
            <button onClick={updateTask}>Update Task Title</button>
        </div>
    )
}