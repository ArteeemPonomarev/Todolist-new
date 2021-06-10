import {TasksStateType} from '../../app/App';
import {AddTodoListAT, RemoveTodoListAT, setTodolistsAC} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todoApi, UpdateTaskModelType} from '../../api/todolist-api';
import {Dispatch} from 'redux';
import {AppRootStateType} from '../../app/store';
import {setAppErrorAC, SetAppErrorType, setAppStatusAC, SetAppStatusType} from '../../app/app-reducer';


const initialState: TasksStateType = {};

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'SET_TASKS':
            return {...state, [action.todolistId]: action.tasks}
        case 'SET-TODOLISTS':
            const stateCopy = {...state}
            action.todolists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        case 'REMOVE_TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD_TASK':
            return {...state, [action.todolistId]: [action.task, ...state[action.todolistId]]}
        case 'UPDATE_TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : {...t})
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            let copyState = {...state};
            delete copyState[action.todoListID]
            return copyState
        default:
            return state
    }
}


//ActionCreators
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE_TASK', taskId, todolistId} as const)
export const addTaskAC = (task: TaskType, todolistId: string) =>
    ({type: 'ADD_TASK', todolistId, task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE_TASK', model, taskId, todolistId} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: 'SET_TASKS', todolistId, tasks} as const)


//Thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType | SetAppStatusType>) => {
    dispatch(setAppStatusAC('loading'))
    todoApi.getTasks(todolistId)
        .then(res => {
            dispatch(setTasksAC(res.data.items, todolistId))
            dispatch(setAppStatusAC('succeeded'))

        })
}
export const removeTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionsType | SetAppStatusType>) => {
    dispatch(setAppStatusAC('loading'))
    todoApi.deleteTask(todolistId, taskId)
        .then(() => {
            dispatch(removeTaskAC(taskId, todolistId))
            dispatch(setAppStatusAC('succeeded'))
        })
}
export const createTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType | SetAppStatusType | SetAppErrorType>) => {
    dispatch(setAppStatusAC('loading'))
    todoApi.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0 ) {
                const task = res.data.data.item;
                dispatch(addTaskAC(task, todolistId))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                if (res.data.messages.length) {
                    dispatch(setAppErrorAC(res.data.messages[0]))
                } else {
                    dispatch(setAppErrorAC('Some error occurred'))
                }
                dispatch(setAppStatusAC('failed'))
            }
        })
        .catch((error) => {
            dispatch(setAppErrorAC(error.message))
            dispatch(setAppStatusAC('failed'))
        })
}
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch<ActionsType | SetAppStatusType | SetAppErrorType>, getState: () => AppRootStateType) => {

        const tasksForCurrentTodolist = getState().tasks[todolistId];
        const task = tasksForCurrentTodolist.find(t => t.id === taskId);

        if (task) {
            const apiModel: UpdateTaskModelType = {
                title: task.title,
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                status: task.status,
                ...domainModel
            }
            dispatch(setAppStatusAC('loading'))
            todoApi.updateTask(todolistId, taskId, apiModel)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(updateTaskAC(taskId, domainModel, todolistId))
                        dispatch(setAppStatusAC('succeeded'))
                    } else {
                        if (res.data.messages.length) {
                            dispatch(setAppErrorAC(res.data.messages[0]))
                        } else {
                            dispatch(setAppErrorAC('Error'))
                        }
                        dispatch(setAppStatusAC('failed'))
                    }
                })
                .catch((error) => {
                    dispatch(setAppErrorAC(error.message))
                    dispatch(setAppStatusAC('failed'))
                })
        }
    }


//types
type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type ActionsType = ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof setTasksAC>
    | AddTodoListAT
    | RemoveTodoListAT;