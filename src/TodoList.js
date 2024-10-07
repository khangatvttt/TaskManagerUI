import React, { useState, useEffect } from 'react';
import './TodoList.css';
import Header from './Header';
import userService from './service/userService';
import Moment from 'moment';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import ClearIcon from '@mui/icons-material/Clear';
import CountDownTimer from './CountDownTimer';
import StatusBadge from './StatusBadge';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import taskService from './service/taskService';


const TodoList = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false); //Open confirm delete Dialog 
    const [openAccept, setOpenAccept] = useState('close'); //Open confirm accept/refuse task Diaglog
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [taskTarget, setTaskTarget] = useState(null); // Store the task that show in Dialog
    const [contentSnackbar, setContentSnackbar] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [taskNameSearch, setTaskNameSearch] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const [tasks, setTasks] = useState({});
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const taskName = new URLSearchParams(location.search).get('taskName') || '';
        fetchData(currentPage, filter, taskName);
    }, [location.search]);


    const fetchData = async (currentPage, filter, searchQuery) => {

        const sizeEachPage = 4
        userService.getTaskByPage(localStorage.getItem('User ID'), filter, currentPage - 1, sizeEachPage, searchQuery)
            .then(res => {
                setTasks(prevTasks => ({
                    ...prevTasks,
                    [filter]: {
                        ...prevTasks[filter],
                        [currentPage]: res.data || []
                    }
                }))
                setTotalPage(res.headers['x-total-pages'])
            })
            .catch(e => {
                console.log(e)
                console.log(e.response.data)
                setError(e.response.data);
            })

    };

    useEffect(() => {
        const taskName = new URLSearchParams(location.search).get('taskName')
        //always fetch if user search
        if (taskName!=null){
            fetchData(currentPage, filter, taskName);
        }
        //If page hasn't been fetched, fetch it
        else if ((!tasks[filter] || !tasks[filter][currentPage])) {
            fetchData(currentPage, filter, '');
        }
    }, [currentPage, filter]);

    const handleAddTask = () => {
        navigate('/createTask')
    };

    const handleSeeDetail = (taskId) => {
        const userId = localStorage.getItem('User ID')
        navigate(`/user/${userId}/task/${taskId}`);
    };

    const handleDeleteTask = (task) => {
        setTaskTarget(task);
        setOpen(true);
    };

    const handleConfirmDeleteTask = () => {
        if (!taskTarget) return;

        taskService.abandonTaskAssignment(taskTarget.taskId, localStorage.getItem('User ID'))
            .then(() => {
                setTasks({})
                fetchData(currentPage, filter)
                setSnackbarOpen(true);
                setContentSnackbar('Delete Successfully!')
                setOpen(false);
            })
            .catch(e => {
                console.log(e);
                setError(e);
            });
    };


    const handleAcceptRefuseTask = (taskId) => {
        if (openAccept === 'accept') {
            taskService.acceptTask(taskId, localStorage.getItem('User ID'))
                .then(() => {
                    setSnackbarOpen(true);
                    setContentSnackbar('You have joined task successfully')
                    window.location.reload()
                })
                .catch(e => {
                    console.log(e)
                    setError(e)
                })


        }
        else (
            handleConfirmDeleteTask()
        )
        setOpenAccept('close')
    }

    const handleAcceptClick = (task) => {
        setTaskTarget(task)
        setOpenAccept('accept')
    }

    const handleRefuseClick = (task) => {
        setTaskTarget(task)
        setOpenAccept('refuse')
    }

    const handleClose = () => {
        setOpen(false);
        setOpenAccept('close');
    };


    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1); // Reset to the first page when the filter changes
    };

    const currentTasks = (tasks[filter] && tasks[filter][currentPage]) || [];

    if (error) {
        return (
            <div>
                {error.status == 'Unauthorized' ? 'Your login has expired, please login again.' : error.error}
            </div>
        )
    }

    return (
        <div>
            <Header />
            <div className="body-todo">
                <div className="todo-list">
                    <h1>TASK LIST</h1>
                    <div className="header">
                        <Button onClick={handleAddTask} className='newTaskButton'>New Task</Button>
                        <Stack spacing={2}>
                            <Pagination count={totalPage} page={currentPage} onChange={handleChangePage} color="primary" />
                        </Stack>
                        <select value={filter} onChange={handleFilterChange}>
                            <option value="All">All</option>
                            <option value="Completed">Completed</option>
                            <option value="Delayed">Delayed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="InProgress">In progress</option>
                            <option value="Invitation">Invitation</option>
                        </select>
                    </div>
                    <ul className="task-list">
                        {currentTasks.map(task => (
                            <li key={task.taskId} className='task'>
                                <div className="task-text ms-1">
                                    <div className="ms-1">
                                        <b className="task-name clickable" onClick={() => handleSeeDetail(task.taskId)}>{task.taskName} {!task.accept && "(Invitation)"}</b>
                                    </div>
                                    <i className="timestamp ms-1">Your task: {task.subTask}</i>
                                    <div className="timestamp ms-1">
                                        Deadline: {Moment(task.dueAt).format('HH:mm DD-MM-yyyy')}
                                        <div className="countdown-container">
                                            (<CountDownTimer targetDate={task.dueAt} />)
                                        </div>
                                    </div>
                                    <StatusBadge status={task.status} />
                                </div>
                                <div className="actions">
                                    {task.accept ? (
                                        <>
                                            <Button variant="outlined" color="error" onClick={() => handleDeleteTask(task)} startIcon={<DeleteIcon />}>Delete</Button>
                                            <Button variant="outlined" color="secondary" onClick={() => navigate(`/user/${localStorage.getItem("User ID")}/task/${task.taskId}/edit`)} startIcon={<EditIcon />}>Edit</Button>
                                        </>)
                                        : (
                                            <>
                                                <Button variant="outlined" color="success" onClick={() => handleAcceptClick(task)} startIcon={<PlaylistAddCheckIcon />}>Accept</Button>
                                                <Button variant="outlined" color="error" onClick={() => handleRefuseClick(task)} startIcon={<ClearIcon />}>Refuse</Button>
                                            </>)}

                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {`Abandon '${taskTarget?.taskName}' task?`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        If you are a manager of this task, all members of it will be abandoned as well. This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDeleteTask} color="error">Delete</Button>
                    <Button onClick={handleClose} autoFocus>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openAccept != 'close'}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title" >
                    {openAccept === 'accept' && `Do you want to join '${taskTarget?.taskName}' task?`}
                    {openAccept === 'refuse' && `Do you want to refuse '${taskTarget?.taskName}' task?`}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => handleAcceptRefuseTask(taskTarget?.taskId)} color="error">{openAccept === 'accept' ? 'Join' : 'Refuse'}</Button>
                    <Button onClick={handleClose} autoFocus>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}>
                    {contentSnackbar}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default TodoList;
