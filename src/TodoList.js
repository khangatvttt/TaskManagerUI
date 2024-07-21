import React, { useState, useEffect } from 'react';
import './TodoList.css';
import Header from './Header';
import userService from './service/userService';
import Moment from 'moment';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CountDownTimer from './CountDownTimer';
import StatusBadge from './StatusBadge';


const TodoList = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [tasks, setTasks] = useState([
        { id: 1, taskName: 'Create a react project ✌️', status: false, timestamp: '5:23 AM, 01/06/2022', priority: 1, dueAt: '5:23 AM, 01/06/2022', description: 'haha', createAt: '5:23 AM, 01/06/2022'},
        { id: 2, text: 'Learn React ❤️', completed: false, timestamp: '5:22 AM, 01/06/2022' },
        { id: 3, text: 'Create a Todo App 📋', completed: true, timestamp: '5:21 AM, 01/06/2022' }
    ]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            userService.getAllTasks(localStorage.getItem('User ID'))
            .then(res =>{
                console.log(res)
                setTasks(res.data)
            })
            .catch(e=>{
                console.log(e)
                console.log(e.response.data)
                setError(e.response.data.error);
            })

        };
    
        fetchData();
      }, []);

    const handleAddTask = () => {
        // Add task functionality here
    };

    const handleSeeDetail = () => {
        console.log('Task name clicked!');
    };

    const handleCompleteTask = (id) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };

    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const filteredTasks = filter === 'All' ? tasks : tasks.filter(task => filter === 'Completed' ? task.completed : !task.completed);

    return (
        <div>
            <Header/>
            <div className="body-todo">
                <div className="todo-list"> 
                    <h1>TODO LIST</h1>
                    <div className="header">
                        <button onClick={handleAddTask}>ADD</button>
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="All">All</option>
                            <option value="Completed">Completed</option>
                            <option value="Delayed">Delayed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="InProgress">In progress</option>
                        </select>
                    </div>
                    <ul className="task-list">
                        {filteredTasks.map(task => (
                            <li key={task.taskName} className='task'>
                                <div className="task-text ms-1">
                                    <div className="ms-1">
                                        <b className="task-name clickable" onClick={handleSeeDetail}>{task.taskName}</b>
                                    </div>
                                    <div className="timestamp ms-1">Deadline: {Moment(task.createAt).format('HH:mm DD-MM-yyyy')} ({ <CountDownTimer targetDate={task.createAt} />})</div>
                                    <StatusBadge status={task.status}/>
                                </div>
                                <div className="actions">
                                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>Delete</Button>
                                    <Button variant="outlined" color="secondary" startIcon={<EditIcon />}>Edit</Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TodoList;