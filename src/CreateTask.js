import React, { useState } from 'react';
import {
  MDBInput,
  MDBTextArea,
  MDBBtn,
  MDBRange
} from 'mdb-react-ui-kit';
import Header from './Header';
import './CreateTask.css';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs from 'dayjs';
import { Box } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import taskService from './service/taskService';

export default function CreateTask() {
  const currentTime = dayjs();
  const [taskData, setTaskData] = useState({
    taskName: '',
    description: '',
    dueAt: currentTime, // Initialize with current time
    priority: 5, // Default priority
  });
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false); // Alert visibility state

  const handleInputChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateChange = (newDate) => {
    setTaskData({
      ...taskData,
      dueAt: newDate.set('hour', taskData.dueAt.hour()).set('minute', taskData.dueAt.minute())
    });
  };

  const handleTimeChange = (newTime) => {
    setTaskData({
      ...taskData,
      dueAt: taskData.dueAt.set('hour', newTime.hour()).set('minute', newTime.minute())
    });
  };

  const handlePriorityChange = (e) => {
    setTaskData({
      ...taskData,
      priority: parseInt(e.target.value)
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!taskData.taskName.trim()) newErrors.taskName = 'Task name is required';
    if (!taskData.description.trim()) newErrors.description = 'Description is required';
    if (taskData.dueAt.isBefore(currentTime)) newErrors.dueAt = 'Deadline must be a future date and time';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const data = {
        ...taskData,
        dueAt: taskData.dueAt.toISOString()
      };
      taskService.createTask(data)
      .then(res =>{
        setTaskData({
          taskName: '',
          description: '',
          dueAt: currentTime, // Reset to current time
          priority: 5, // Reset priority to default
        });
  
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      })
      .catch(e=>{
        console.log(e)
      })

    }
  };

  return (
    <div>
      <Header />
      <h2 className="new-task-title">Create New Task</h2>
      <div className="containerForm">
        <form onSubmit={handleSubmit}>
          <MDBInput
            id='taskName'
            wrapperClass={`mb-4 ${errors.taskName ? 'is-invalid' : ''}`}
            label='Task name'
            name="taskName"
            value={taskData.taskName}
            onChange={handleInputChange}
          />
          {errors.taskName && <div className="invalid-feedback">{errors.taskName}</div>}
          
          <MDBTextArea
            wrapperClass={`mb-4 ${errors.description ? 'is-invalid' : ''}`}
            label="Description"
            id="description"
            rows="4"
            name="description"
            value={taskData.description}
            onChange={handleInputChange}
          />
          {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <h6 htmlFor="deadline" className="form-label mb-4">
                Deadline:
              </h6>
              
              <DesktopTimePicker
                value={taskData.dueAt}
                onChange={handleTimeChange}
                sx={{
                  mb: 4,
                  '& .MuiInputBase-root': {
                    width: '150px',
                    height: '35px',
                    fontSize: '1.0rem',
                  },
                }}
              />

              <DesktopDatePicker
                value={taskData.dueAt}
                onChange={handleDateChange}
                format="DD-MM-YYYY"
                sx={{
                  mb: 4,
                  '& .MuiInputBase-root': {
                    width: '150px',
                    height: '35px',
                    fontSize: '1.0rem',
                  },
                }}
              />
            </Box>
          </LocalizationProvider>
          {errors.dueAt && <div className="invalid-feedback">{errors.dueAt}</div>}
          
          <div className="d-flex align-items-center my-4">
            <h6 htmlFor="priorityRange" className="form-label me-3">
              Priority: {taskData.priority}
            </h6>
            <MDBRange
              id="priorityRange"
              value={taskData.priority}
              min="1"
              max="10"
              step="1"
              onChange={handlePriorityChange}
              className="form-range flex-grow-1"
              style={{ width: '459px' }}
            />
          </div>

          <MDBBtn type='submit' className='mb-4' block>
            Create Task
          </MDBBtn>
          
        </form>
      </div>

      {showAlert && (
        <div className="alert-container">
          <Alert
            severity="success"
            action={
              <Button color="inherit" size="small" onClick={() => window.location.href = '/home'}>
                HOME PAGE
              </Button>
            }
          >
            Task is created successfully!
          </Alert>
        </div>
      )}
    </div>
  );
}
