import axios from "axios"

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'API-KEY': '9b6aada9-34d3-4135-a32f-7e9aacf37623'
    }
})

type CommonResponseType<T> = {
    resultCode: number
    messages: Array<string>
    fieldsError: Array<string>
    data: T
}

type TodoType = {
    id: string
    addedDate: string
    order: number
    title: string
}


export const todoApi = {
    getTodos() {
        return instance.get<Array<TodoType>>('todo-lists')
    },
    createTodo(title: string) {
        return instance.post<CommonResponseType<{item: TodoType}>>(`todo-lists`, {title})
    },
    deleteTodo(todolistId: string) {
        return instance.delete<CommonResponseType<{}>>(`todo-lists/${todolistId}`)
    },
    updateTodoTitle(todolistId: string, title: string) {
        return instance.put<CommonResponseType<{}>>(`todo-lists/${todolistId}`, {title})
    }
 }