// import React, {useReducer} from 'react';
// import './App.css';
// import TodoList from './TodoList';
// import {v1} from 'uuid';
// import AddItemForm from './AddItemForm';
// import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
// import {Menu} from '@material-ui/icons';
// import {
//     addTodolistAC,
//     changeTodoListFilterAC, changeTodoListTitleAC,
//     removeTodolistAC,
//     todolistsReducer
// } from './state/todolists-reducer';
// import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from './state/tasks-reducer';
//
// export type TaskType = {
//     id: string
//     title: string
//     isDone: boolean
// };
//
// export type FilterValuesType = 'All' | 'Active' | 'Completed';
//
// export type TodoListType = {
//     id: string
//     title: string
//     filter: FilterValuesType
// }
//
// export type TasksStateType = {
//     [key: string]: Array<TaskType>
// }
//
// function AppWithReducers() {
//
//     const todoListID_1 = v1();
//     const todoListID_2 = v1();
//
//     const [todoLists, dispatchToTodoLists] = useReducer(todolistsReducer,[
//         {id: todoListID_1, title: 'What to learn', filter: 'All'},
//         {id: todoListID_2, title: 'What to buy', filter: 'All'}
//     ]);
//
//     const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
//         [todoListID_1]: [
//             {id: v1(), isDone: true, title: 'HTML'},
//             {id: v1(), isDone: true, title: 'CSS'},
//             {id: v1(), isDone: false, title: 'React'}
//         ],
//         [todoListID_2]: [
//             {id: v1(), isDone: true, title: 'Bread'},
//             {id: v1(), isDone: true, title: 'Milk'},
//             {id: v1(), isDone: false, title: 'Meet'}
//         ],
//     });
//
//     function onFilterTasks(todoList: TodoListType): Array<TaskType> {
//         switch (todoList.filter) {
//             case 'Active':
//                 return tasks[todoList.id].filter(t => !t.isDone)
//             case 'Completed':
//                 return tasks[todoList.id].filter(t => t.isDone)
//             default:
//                 return tasks[todoList.id]
//         }
//     }
//
//     function removeTask(taskID: string, todoListID: string) {
//         dispatchToTasks(removeTaskAC(taskID, todoListID))
//     }
//     function addTask(title: string, todoListID: string) {
//         dispatchToTasks(addTaskAC(title, todoListID))
//     }
//     function changeTaskStatus(taskId: string, newIsDoneValue: boolean, todoListID: string) {
//         dispatchToTasks(changeTaskStatusAC(taskId, newIsDoneValue, todoListID))
//     }
//     function changeTaskTitle(taskId: string, title: string, todoListID: string) {
//         dispatchToTasks(changeTaskTitleAC(taskId, title, todoListID))
//     }
//
//     function changeTodoListFilter(newFilterValue: FilterValuesType, todoListID: string) {
//         dispatchToTodoLists(changeTodoListFilterAC(todoListID, newFilterValue))
//     }
//     function removeTodoList(todoListID: string) {
//         dispatchToTodoLists(removeTodolistAC(todoListID))
//         dispatchToTasks(removeTodolistAC(todoListID))
//     }
//     function addTodoList(title: string) {
//         let action = addTodolistAC(title);
//        dispatchToTasks(action);
//        dispatchToTodoLists(action);
//     }
//     function changeTodoListTitle(title: string, todoListID: string) {
//         dispatchToTodoLists(changeTodoListTitleAC(title, todoListID))
//     }
//
//     const todolistComponents = todoLists.map(tl => {
//         return (
//             <Grid item key={tl.id}>
//                 <Paper elevation={6} style={{padding: '0 15px 15px 15px'}}>
//                     <TodoList
//                         key={tl.id}
//                         id={tl.id}
//                         title={tl.title}
//                         todoListFilter={tl.filter}
//                         tasks={onFilterTasks(tl)}
//                         changeFilterValue={changeTodoListFilter}
//                         removeTask={removeTask}
//                         addTask={addTask}
//                         changeTaskStatus={changeTaskStatus}
//                         removeTodoList={removeTodoList}
//                         changeTaskTitle={changeTaskTitle}
//                         changeTodoListTitle={changeTodoListTitle}/>
//                 </Paper>
//             </Grid>
//         )
//     })
//
//     return (
//         <div className="App">
//             <AppBar position="static">
//                 <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
//                     <IconButton edge="start" color="inherit" aria-label="menu">
//                         <Menu/>
//                     </IconButton>
//                     <Typography variant="h6">
//                         TodoList
//                     </Typography>
//                     <Button variant={'outlined'} color="inherit">Login</Button>
//                 </Toolbar>
//             </AppBar>
//             <Container fixed style={{padding: '20px 0px'}}>
//                 <Grid container style={{padding: '20px 0px'}}>
//                     <AddItemForm addItem={addTodoList}/>
//                 </Grid>
//                 <Grid container style={{padding: '20px 0px'}} spacing={3}>
//                     {todolistComponents}
//                 </Grid>
//             </Container>
//         </div>
//     );
// }
//
// export default AppWithReducers;
export let b = 1;
