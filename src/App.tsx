// import React, {useState} from 'react';
// import './App.css';
// import {TodoList} from './TodoList';
// import {v1} from 'uuid';
// import {AddItemForm} from './AddItemForm';
// import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
// import {Menu} from '@material-ui/icons';
// import {TaskPriorities, TaskStatuses, TaskType} from './api/todolist-api';
// import {FilterValuesType, TodolistDomainType} from './state/todolists-reducer';
//
//
// export type TasksStateType = {
//     [key: string]: Array<TaskType>
// }
//
// function App() {
//
//     const todoListID_1 = v1();
//     const todoListID_2 = v1();
//
//     const [todoLists, setTodoLists] = useState<Array<TodolistDomainType>>([
//         {
//             id: todoListID_1, title: 'What to learn', filter: 'All', addedDate: '',
//             order: 1
//         },
//         {
//             id: todoListID_2, title: 'What to buy', filter: 'All', addedDate: '',
//             order: 0
//         }
//     ]);
//
//     const [tasks, setTasks] = useState<TasksStateType>({
//         [todoListID_1]: [
//             {
//                 id: v1(),
//                 title: 'HTML',
//                 status: TaskStatuses.Completed,
//                 todoListId: todoListID_1,
//                 startDate: '',
//                 deadline: '',
//                 addedDate: '',
//                 order: 1,
//                 description: '',
//                 priority: TaskPriorities.Low
//             },
//             {
//                 id: v1(),
//                 status: TaskStatuses.New,
//                 title: 'React',
//                 todoListId: todoListID_1,
//                 startDate: '',
//                 deadline: '',
//                 addedDate: '',
//                 order: 0,
//                 description: '',
//                 priority: TaskPriorities.Low
//             }
//         ],
//         [todoListID_2]: [
//             {
//                 id: v1(),
//                 status: TaskStatuses.Completed,
//                 title: 'Milk',
//                 todoListId: todoListID_2,
//                 startDate: '',
//                 deadline: '',
//                 addedDate: '',
//                 order: 1,
//                 description: '',
//                 priority: TaskPriorities.Low
//             },
//             {
//                 id: v1(),
//                 status: TaskStatuses.New,
//                 title: 'Meet',
//                 todoListId: todoListID_2,
//                 startDate: '',
//                 deadline: '',
//                 addedDate: '',
//                 order: 1,
//                 description: '',
//                 priority: TaskPriorities.Low
//             }
//         ],
//     });
//
//     function onFilterTasks(todoList: TodolistDomainType): Array<TaskType> {
//         switch (todoList.filter) {
//             case 'Active':
//                 return tasks[todoList.id].filter(t => t.status === TaskStatuses.New)
//             case 'Completed':
//                 return tasks[todoList.id].filter(t => t.status === TaskStatuses.Completed)
//             default:
//                 return tasks[todoList.id]
//         }
//     }
//
//     function removeTask(taskID: string, todoListID: string) {
//         const filteredTasks = tasks[todoListID].filter(t => t.id !== taskID);
//         setTasks({...tasks, [todoListID]: filteredTasks})
//     }
//
//     function addTask(title: string, todoListID: string) {
//         const newTask: TaskType = {
//             id: v1(),
//             title,
//             status: TaskStatuses.New,
//             todoListId: todoListID,
//             startDate: '',
//             deadline: '',
//             addedDate: '',
//             order: 1,
//             description: '',
//             priority: TaskPriorities.Low
//         };
//         setTasks({...tasks, [todoListID]: [newTask, ...tasks[todoListID]]});
//     }
//
//     function changeTaskStatus(taskId: string, status: TaskStatuses, todoListID: string) {
//         const updatedTasks = tasks[todoListID].map(t => {
//             if (t.id === taskId) {
//                 return {
//                     ...t, status
//                 }
//             }
//             return t;
//         });
//         setTasks({...tasks, [todoListID]: updatedTasks});
//     }
//
//     function changeTaskTitle(taskId: string, title: string, todoListID: string) {
//         const updatedTasks = tasks[todoListID].map(t => {
//             if (t.id === taskId) {
//                 return {
//                     ...t, title
//                 }
//             }
//             return t;
//         });
//         setTasks({...tasks, [todoListID]: updatedTasks});
//     }
//
//     function changeTodoListFilter(newFilterValue: FilterValuesType, todoListID: string) {
//         setTodoLists(todoLists.map(tl => tl.id === todoListID ? {...tl, filter: newFilterValue} : tl));
//     }
//
//     function removeTodoList(todoListID: string) {
//         const updatedTodoLists = todoLists.filter(tl => tl.id !== todoListID)
//         setTodoLists(updatedTodoLists)
//         delete tasks[todoListID];
//     }
//
//     function addTodoList(title: string) {
//         const newTodoListID = v1()
//         const newTodoList: TodolistDomainType = {
//             id: newTodoListID,
//             title,
//             addedDate: '',
//             order: 3,
//             filter: 'All'
//         }
//         setTodoLists([...todoLists, newTodoList]);
//         setTasks({...tasks, [newTodoListID]: []})
//     }
//
//     function changeTodoListTitle(title: string, todoListID: string) {
//         const updatedTodoLists = todoLists.map(tl => tl.id === todoListID ? {...tl, title} : tl);
//         setTodoLists(updatedTodoLists)
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

export let a = 1;

