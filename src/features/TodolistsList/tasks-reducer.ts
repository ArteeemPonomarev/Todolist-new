import {TaskPriorities, TaskStatuses, TaskType, UpdateTaskModelType} from '../../api/types';
import {handleAsyncServerAppError, handleAsyncServerNetworkError,} from "../../utils/error-utils";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AppRootStateType, ThunkError} from '../../utils/types';
import {appActions} from "../CommonActions/App";
import {todoApi} from '../../api/todolist-api';
import {asyncActions as asyncTodolistsActions} from './todolists-reducer'


const initialState: TasksStateType = {};

export const fetchTasks = createAsyncThunk<{ tasks: TaskType[], todolistId: string }, string, ThunkError>(
    'tasks/fetchTasks',
    async (todolistId: string, thunkAPI) => {
        thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const res = await todoApi.getTasks(todolistId)
            const tasks = res.data.items
            thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))

            return {tasks, todolistId}
        } catch (error) {
            return handleAsyncServerNetworkError(error, thunkAPI)
        }
    })
export const removeTask = createAsyncThunk<{ taskId: string, todolistId: string }, { taskId: string, todolistId: string }, ThunkError>(
    'tasks/removeTask',
    async (param, thunkAPI) => {
        thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            await todoApi.deleteTask(param.todolistId, param.taskId)
            thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {taskId: param.taskId, todolistId: param.todolistId}
        } catch (error) {
            return handleAsyncServerNetworkError(error, thunkAPI)
        }
    })
export const createTask = createAsyncThunk<TaskType, { title: string, todolistId: string }, ThunkError>(
    'tasks/createTask',
    async (param, thunkAPI) => {
        thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const res = await todoApi.createTask(param.todolistId, param.title)
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return res.data.data.item
            } else {
                return handleAsyncServerAppError(res.data, thunkAPI, false)
            }
        } catch (err) {
            return handleAsyncServerNetworkError(err, thunkAPI, false)
        }
    })

export const updateTask = createAsyncThunk('tasks/updateTask', async (param: { taskId: string, model: UpdateDomainTaskModelType, todolistId: string },
                                                                      thunkAPI) => {
    const state = thunkAPI.getState() as AppRootStateType;
    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId)

    if (!task) {
        return thunkAPI.rejectWithValue('task not found in the state')
    }

    if (task) {
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            status: task.status,
            ...param.model
        }
        thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))

        try {
            const res = await todoApi.updateTask(param.todolistId, param.taskId, apiModel)

            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
                return param
            } else {
                return handleAsyncServerAppError(res.data, thunkAPI)
            }
        } catch (error) {
            return handleAsyncServerNetworkError(error, thunkAPI)
        }
    }
})

export const asyncActions = {
    fetchTasks,
    removeTask,
    createTask,
    updateTask
}

export const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(asyncTodolistsActions.createTodolistTC.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(asyncTodolistsActions.deleteTodolistTC.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(asyncTodolistsActions.fetchTodolistsTC.fulfilled, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = []
                })
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex(t => t.id === action.payload.taskId);
                if (index > -1) {
                    tasks.splice(index, 1);
                }
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state[action.payload.todoListId].unshift(action.payload)
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.model}
                }
            })
    }
})


//types
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
