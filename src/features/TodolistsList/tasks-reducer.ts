import {addTodolistAC, removeTodolistAC, setTodolistsAC} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todoApi, UpdateTaskModelType} from '../../api/todolist-api';
import {Dispatch} from 'redux';
import {AppRootStateType} from '../../app/store';
import {setAppErrorAC, setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState: TasksStateType = {};

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ todolistId: string, taskId: string }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks.splice(index, 1);
            }
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType, todolistId: string }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistAC, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(removeTodolistAC, (state, action) => {
            delete state[action.payload.todoListID]
        });
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach(tl => {
                state[tl.id] = []
            })
        });
    }
})

export const tasksReducer = slice.reducer;
export const {addTaskAC, removeTaskAC, updateTaskAC, setTasksAC} = slice.actions;


//Thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todoApi.getTasks(todolistId)
        .then((res) => {
            if (!res.data.error) {
                dispatch(setTasksAC({tasks: res.data.items, todolistId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                dispatch(setAppErrorAC({error: res.data.error}))
                dispatch(setAppStatusAC({status: 'failed'}))
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}
export const removeTaskTC = (todolistId: string, taskId: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todoApi.deleteTask(todolistId, taskId)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTaskAC({taskId, todolistId}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
export const createTaskTC = (todolistId: string, title: string) =>
    (dispatch: Dispatch) => {
        dispatch(setAppStatusAC({status: 'loading'}))
        todoApi.createTask(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    const task = res.data.data.item;
                    dispatch(addTaskAC({task, todolistId}))
                    dispatch(setAppStatusAC({status: 'succeeded'}))
                } else {
                    handleServerAppError(res.data, dispatch);
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch);
            })
    }
export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: Dispatch, getState: () => AppRootStateType) => {

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
            dispatch(setAppStatusAC({status: 'loading'}))
            todoApi.updateTask(todolistId, taskId, apiModel)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(updateTaskAC({taskId, model: domainModel, todolistId}))
                        dispatch(setAppStatusAC({status: 'succeeded'}))
                    } else {
                        handleServerAppError(res.data, dispatch);
                    }
                })
                .catch((error) => {
                    handleServerNetworkError(error, dispatch);
                })
        }
    }


//types
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
