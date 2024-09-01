import React, { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBRange,
  MDBCardText,
} from 'mdb-react-ui-kit';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useParams } from 'react-router-dom';
import Header from './Header';
import taskService from './service/taskService';
import Moment from 'moment';
import { useNavigate } from "react-router-dom";


const EditTask = () => {
  const navigate = useNavigate();
  const { userId, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState(null);
  const [taskData, setTaskData] = useState({
    taskName: '',
    description: '',
    dueAt: '',
    status: '',
  });
  
  const [taskAssignmentData, setTaskAssignmentData] = useState({
    personalStatus: '',
    priority: 0,
    progression: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await taskService.getTaskAssignment(taskId, userId);
        setTask(res.data);
        setTaskData({
          taskName: res.data.taskName,
          description: res.data.description,
          dueAt: Moment(res.data.dueAt).format('YYYY-MM-DDTHH:mm'),
          status: res.data.status,
        });
        setTaskAssignmentData({
          personalStatus: res.data.personalStatus,
          priority: res.data.priority,
          progression: res.data.progression,
        })
      } catch (e) {
        console.error(e);
        setError(e.response?.data?.error || "Failed to fetch task data");
      }
    };

    fetchData();
  }, [taskId, userId]);

  const handleTaskDataChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const { taskName, description} = taskData;

      if (!taskName || !description) {
        alert("Please fill in all fields.");
        return;
      }

      if (task.taskOwnerId==localStorage.getItem("User ID")){
        await taskService.updateTask(taskId, taskData)
      }
      await taskService.updateTaskAssignment(taskId,userId,taskAssignmentData)

      navigate(`/user/${userId}/task/${taskId}`)

    } catch (e) {
      console.error(e);
      alert("Failed to update task");
    }
  };

  const handleStatusChange = (event) => {
    const value = event.target.value;
    setTaskData({ ...taskData, status: value });
  };

  const handlePersonalStatusChange = (event) => {
    const value = event.target.value;
    setTaskAssignmentData({ ...taskAssignmentData, personalStatus: value });
  };

  const handlePriorityChange = (e) => {
    const value = parseInt(e.target.value);
    setTaskAssignmentData({ ...taskAssignmentData, priority: value });
  };

  const handleProgressionChange = (e) => {
    const value = parseInt(e.target.value);
    setTaskAssignmentData({ ...taskAssignmentData, progression: value });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <section style={{ backgroundColor: '#eee' }}>
        <MDBContainer className="py-5">
          <MDBRow>
            <MDBCol lg="12">
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <MDBCardText className="mb-4"><b>Update General Task (Owner only)</b></MDBCardText>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Task name</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput
                        value={taskData.taskName}
                        name="taskName"
                        onChange={handleTaskDataChange}
                        className="text-muted"
                        readOnly={task.taskOwnerId!=localStorage.getItem("User ID")}
                      />
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Description</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput
                        type="textarea"
                        value={taskData.description}
                        name="description"
                        onChange={handleTaskDataChange}
                        className="text-muted"
                        readOnly={task.taskOwnerId!=localStorage.getItem("User ID")}
                      />
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Due at</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput
                        type="datetime-local"
                        value={taskData.dueAt}
                        name="dueAt"
                        onChange={handleTaskDataChange}
                        className="text-muted"
                        readOnly={task.taskOwnerId!=localStorage.getItem("User ID")}
                      />
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Status</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <Select
                        id="demo-simple-select"
                        value={taskData.status}
                        onChange={handleStatusChange}
                        disabled={task.taskOwnerId!=localStorage.getItem("User ID")}
                        sx={{
                          height: '40px', width: '130px',
                          '.MuiSelect-select': {
                            padding: '10px 14px',
                            fontSize: '1rem',
                          },
                        }}
                      >
                        <MenuItem value="COMPLETED">Completed</MenuItem>
                        <MenuItem value="DELAYED">Delayed</MenuItem>
                        <MenuItem value="CANCELLED">Cancelled</MenuItem>
                        <MenuItem value="INPROGRESS">In progress</MenuItem>
                      </Select>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
              <MDBRow>
                <MDBCol md="12">
                  <MDBCard className="mb-4 mb-md-0">
                    <MDBCardBody>
                      <MDBCardText className="mb-2"><b>Update Personal Task Status</b></MDBCardText>
                      <MDBCardText className="mt-2 mb-2" style={{ fontSize: '.88rem' }}><i>Your task: {task.subTask}</i></MDBCardText>
                      <MDBCardText className="mt-2 mb-2" style={{ fontSize: '.88rem' }}><i>Assigned at: {Moment(task.assignedAt).format('HH:mm DD-MM-yyyy')}</i></MDBCardText>
                      <div className="d-flex align-items-center my-4">
                        <div className="d-flex align-items-center" style={{ width: '150px' }}>
                          <h6
                            htmlFor="progressionRange"
                            className="form-label"
                            style={{ marginBottom: '0' }}
                          >
                            Personal Status
                          </h6>
                        </div>
                        <Box sx={{ maxWidth: 200, minWidth: 130 }}>
                          <FormControl fullWidth sx={{ '.MuiInputBase-root': { minHeight: '40px' } }}>
                            <Select
                              id="demo-simple-select"
                              value={taskAssignmentData.personalStatus}
                              onChange={handlePersonalStatusChange}
                              sx={{
                                height: '40px',
                                '.MuiSelect-select': {
                                  padding: '10px 14px',
                                  fontSize: '1rem',
                                },
                              }}
                            >
                              <MenuItem value="COMPLETED">Completed</MenuItem>
                              <MenuItem value="DELAYED">Delayed</MenuItem>
                              <MenuItem value="CANCELLED">Cancelled</MenuItem>
                              <MenuItem value="INPROGRESS">In progress</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </div>
                      <div className="d-flex align-items-center my-4">
                        <div className="d-flex align-items-center" style={{ width: '150px' }}>
                          <h6
                            htmlFor="progressionRange"
                            className="form-label"
                            style={{ marginBottom: '0' }}
                          >
                            Progression
                          </h6>
                        </div>
                        <MDBRange
                          id="progressionRange"
                          defaultValue={taskAssignmentData.progression}
                          onChange={handleProgressionChange}
                          min="0"
                          max="100"
                          step="1"
                          className="form-range flex-grow-1"
                          style={{ width: '900px' }}
                        />
                      </div>
                      <div className="d-flex align-items-center my-4">
                        <div className="d-flex align-items-center" style={{ width: '150px' }}>
                          <h6
                            htmlFor="priorityRange"
                            className="form-label"
                            style={{ marginBottom: '0' }}
                          >
                            Priority
                          </h6>
                        </div>
                        <MDBRange
                          id="priorityRange"
                          defaultValue={taskAssignmentData.priority}
                          onChange={handlePriorityChange}
                          min="1"
                          max="10"
                          step="1"
                          className="form-range flex-grow-1"
                          style={{ width: '900px' }}
                        />
                      </div>
                      <MDBBtn color="primary" onClick={handleSave} className="mt-4">Save Changes</MDBBtn>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </div>
  );
};

export default EditTask;
