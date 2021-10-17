import {addTodolistAC, removeTodolistAC, setTodolistsAC} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todoApi, UpdateTaskModelType} from '../../api/todolist-api';
import {Dispatch} from 'redux';
import {AppRootStateType} from '../../app/store';
import {setAppStatusAC} from '../../app/app-reducer';
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


const initialState: TasksStateType = {};

export const fetchTasksTC = createAsyncThunk(
    'tasks/fetchTasks',
    async (todolistId: string, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

        const res = await todoApi.getTasks(todolistId)
        const tasks = res.data.items

        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))

        return {tasks, todolistId}
    })
export const removeTaskTC = createAsyncThunk(
    'tasks/removeTask',
    async (param: { todolistId: string, taskId: string }, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))

        await todoApi.deleteTask(param.todolistId, param.taskId)

        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
        return {taskId: param.taskId, todolistId: param.todolistId}
    })
export const createTaskTC = createAsyncThunk(
    'tasks/createTask',
    (param: { todolistId: string, title: string }, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        return todoApi.createTask(param.todolistId, param.title)
            .then((res) => {
                const task = res.data.data.item;
                // thunkAPI.dispatch(addTaskAC({task}))
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                return {task, todolistId: param.todolistId, title: param.title}
            })
    })
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


const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
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
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
        });
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                tasks.splice(index, 1);
            }
        });
        builder.addCase(createTaskTC.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        })
    }
})


export const tasksReducer = slice.reducer;
export const {updateTaskAC} = slice.actions;


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
