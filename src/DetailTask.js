import React, { useState, useEffect } from 'react';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBBtn,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBSpinner 
} from 'mdb-react-ui-kit';
import { useParams } from 'react-router-dom';
import Header from './Header';
import taskService from './service/taskService';
import Moment from 'moment';
import CountDownTimer from './CountDownTimer';
import StatusBadge from './StatusBadge';
import { useNavigate, useLocation  } from "react-router-dom";
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import {Error, CheckCircle} from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import './DetailTask.css'

const DetailPage = () => {
  const navigate = useNavigate()
  const location = useLocation();

  const { userId, taskId } = useParams()
  const [task, setTask] = useState(null)
  const [openAddMember, setOpenAddmember] = useState(false)
  const [emailList, setEmailList] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [taskInput, setTaskInput] = useState(''); 
  const [errorMessage, setErrorMessage] = useState('');
  const [successCount, setSuccessCount] = useState(0);
  const [response, setResponse] = useState(null);
  const [openResponse, setOpenResponse] = useState(false);

  function timeLeft(timeStart,timeEnd) {
    const start = new Date(timeStart)
    const end = new Date(timeEnd)
    const now = new Date()

    const totalTime = end - start
    const timeLeft = end - now

    const result = ((totalTime - timeLeft) / totalTime) * 100;
    if (result<0){
      return 100
    }
    return result
  }

  useEffect(() => {
    const fetchData = () => {
        taskService.getTaskAssignment(taskId, userId)
        .then(res =>{
            setTask(res.data)
        })
        .catch(e=>{
            console.log(e)
            console.log(e.response.data)
        })

    };

    fetchData();
  }, []);

  const handleBack = () => {
    navigate("/home")
  };

  const handleEdit = () => {
    navigate(`${location.pathname}/edit`)
  };

  const handleOpenDialog = () => {
    if (localStorage.getItem("User ID")==task.taskOwnerId)
      setOpenAddmember(true);
    else {
      alert('Only owner of this task can add member')
    }
  };

  const handleCloseDialog = () => {
    setOpenAddmember(false);
  };

  const handleAdd = (event) => {
    event.preventDefault();
    const emailExists = emailList.some(emailObj => emailObj.email === emailInput);

    if (emailExists) {
      setErrorMessage('This email has already been in list to send.');
    } else if (emailInput.trim() && taskInput.trim()) {
      setEmailList((prevEmails) => [...prevEmails, { email: emailInput, task: taskInput }]);
      setEmailInput('');
      setTaskInput('');
      setErrorMessage(''); 
    }
  };

  const handleDeleteEmail = (emailToDelete) => {
    setEmailList((prevEmails) => prevEmails.filter((emailObj) => emailObj.email !== emailToDelete));
  };

  const sendInvitation = () => {
    if (emailList==[]){
      alert('Please provide at least one user')
    }
    else{
      const dataToSend = emailList.map(emailObj => ({
        email: emailObj.email,
        subTask: emailObj.task
      }));
      taskService.addMembersToTask(taskId,dataToSend)
      .then(res => {
        setResponse(res.data)
        setOpenAddmember(false)
      })
      .catch(error => {
        console.error("There was an error!", error); 
      });
    }
  }

  useEffect(() => {
    if (response) {
      let success = 0
      for (const [email, message] of Object.entries(response)) {
        if (message === "Your invitation has been sent successfully") {
          success += 1;
        }
      }
      setEmailList([])
      setSuccessCount(success);
      setOpenResponse(true);
    }
  }, [response]);

  if (!task) {
    return(
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <MDBSpinner role="status">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
    </div>
    );
  }

    return (
      <div>
      <Header/>



      <section style={{ backgroundColor: '#eee' }}>
        <MDBBtn color="primary"  className="back-button"  onClick={handleBack}>
            <MDBIcon fas icon="arrow-left" className="me-2" />
            Back
        </MDBBtn>
        <MDBContainer className="py-4">

          <MDBRow>
  
            <MDBCol lg="12">
              <MDBCard className="mb-4">
                <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="8">
                    <MDBCardText className="mb-4"><b>General Task Infomation</b></MDBCardText>
                  </MDBCol>
                  {!task.accept ?
                    <>
                    <MDBCol sm="2">
                      <MDBBtn color="success" onClick={handleOpenDialog} >
                        <MDBIcon fas icon="check" className="me-2" />
                        Accept Task
                      </MDBBtn>
                      </MDBCol>
                        <MDBCol sm="2">
                        <MDBBtn color="danger" onClick={handleEdit} >
                          <MDBIcon fas icon="ban" className="me-2" />
                          Refuse Task
                        </MDBBtn>
                      </MDBCol>
                    </>
                   :(
                    <>
                    <MDBCol sm="2">
                      {localStorage.getItem("User ID")==task.taskOwnerId &&
                      <MDBBtn color="secondary" onClick={handleOpenDialog} >
                        <MDBIcon fas icon="user-plus" className="me-2" />
                        Add member
                      </MDBBtn>
                      }
                    </MDBCol>
                      <MDBCol sm="2">
                      <MDBBtn color="success" onClick={handleEdit} className="edit-button" >
                        <MDBIcon fas icon="edit" className="me-2" />
                        Edit
                      </MDBBtn>
                    </MDBCol>
                    </>
                  )}
                     <Dialog
                      open={openAddMember}
                      onClose={handleCloseDialog}
                      PaperProps={{
                        component: 'form'
                      }}
                    >
                      <DialogTitle>Add member</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                          Please enter the email of the user and the task they will do. You can invite many users at the same time. (Press Enter to add)
                        </DialogContentText>
                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                        <TextField
                          autoFocus
                          required
                          margin="dense"
                          name="email"
                          label="Email"
                          type="email"
                          fullWidth
                          variant="standard"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAdd(e);
                            }
                          }}
                        />
                        <TextField
                          required
                          margin="dense"
                          name="task"
                          label="Task"
                          type="text"
                          fullWidth
                          variant="standard"
                          value={taskInput}
                          onChange={(e) => setTaskInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAdd(e);
                            }
                          }}
                        />
                        <Box mt={2}>
                          {emailList.map((emailObj, index) => (
                            <Chip
                              key={index}
                              label={`${emailObj.email} - Task: ${emailObj.task}`}
                              onDelete={() => handleDeleteEmail(emailObj.email)}
                              style={{ marginRight: '5px', marginBottom: '5px' }}
                            />
                          ))}
                        </Box>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={sendInvitation}>Invite</Button>
                      </DialogActions>
                    </Dialog>
                    <Dialog open={openResponse}  maxWidth="sm" fullWidth>
                      <DialogTitle>
                        Invitation Summary
                        <IconButton
                          aria-label="close"
                          sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                          }}
                        >
                        </IconButton>
                      </DialogTitle>

                      {response &&
                      <DialogContent dividers>
                        <Typography variant="h6" gutterBottom>
                          Success: {successCount}/{Object.keys(response).length}
                        </Typography>
                        <List>
                          {Array.isArray(Object.entries(response)) && Object.entries(response).map(([email, message], index) => (
                            <ListItem key={index}>
                              <ListItemIcon>
                                {message === "Your invitation has been sent successfully" ? (
                                  <CheckCircle sx={{ color: 'green' }} />
                                ) : (
                                  <Error sx={{ color: 'red' }} />
                                )}
                              </ListItemIcon>
                              <ListItemText
                                primary={email}
                                secondary={message}
                                primaryTypographyProps={{
                                  color: message === "Your invitation has been sent successfully" ? 'green' : 'red',
                                  fontWeight: 'bold',
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </DialogContent>
                      }
                       <DialogActions>
                        <Button onClick={() => setOpenResponse(false)} color="primary">
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                </MDBRow>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Task name</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{task.taskName}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Description</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{task.description}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Create at</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{Moment(task.createAt).format('HH:mm DD-MM-yyyy')}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Due at</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{Moment(task.dueAt).format('HH:mm DD-MM-yyyy')}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Task owner</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{task.taskOwner}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Number of participants</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{task.teamSize}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>

              <MDBRow>
                <MDBCol md="12">
                  <MDBCard className="mb-4 mb-md-0">
                    <MDBCardBody>
                      <MDBCardText className="mb-2"><b>Personal Task Status</b></MDBCardText>
                      <MDBCardText className="mt-2 mb-2" style={{ fontSize: '.88rem' }}><i>Your task: {task.subTask}</i></MDBCardText>
                      <MDBCardText className="mt-2 mb-2" style={{ fontSize: '.88rem' }}><i>Assigned at: {Moment(task.assignedAt).format('HH:mm DD-MM-yyyy')}</i></MDBCardText>
                      <StatusBadge status={task.personalStatus}/>
                      <MDBCardText className="mt-2 mb-1" style={{ fontSize: '.77rem' }}>Progresstion ({task.progression}%)</MDBCardText>
                      <MDBProgress className="rounded">
                        <MDBProgressBar width={task.progression} valuemin={0} valuemax={100} />
                      </MDBProgress>

                      <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Priority (Level {task.priority})</MDBCardText>
                      <MDBProgress className="rounded">
                        <MDBProgressBar width={task.priority*10} valuemin={0} valuemax={100} />
                      </MDBProgress>

                      <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Time ({ <CountDownTimer targetDate={task.dueAt} />})</MDBCardText>
                      <MDBProgress className="rounded">
                        <MDBProgressBar width={timeLeft(task.assignedAt,task.dueAt)} valuemin={0} valuemax={100} />
                      </MDBProgress>

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
}


export default DetailPage