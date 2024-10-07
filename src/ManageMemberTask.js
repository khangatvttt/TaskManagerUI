import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Chip,
  Grid,
  CircularProgress,
  Divider,
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions
} from "@mui/material";
import Cancel from "@mui/icons-material/Cancel";
import UserIcon from '@mui/icons-material/SupervisorAccount';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import taskService from './service/taskService';
import Header from './Header';
import StatusBadge from './StatusBadge';

const ManageMember = () => {
  const navigate = useNavigate()
  const [taskName, setTaskName] = useState('');
  const [members, setMembers] = useState([]);
  const { userId, taskId } = useParams();
  const [completedMember, setCompletedMember] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [targetUser, setTargetUser] = useState('');

  useEffect(() => {
    const getMembers = async () => {
      taskService.getMemberOfTask(taskId)
        .then(res => {
          setMembers(res.data)
          setTaskName(res.data[0].generalTaskName)
          setCompletedMember(res.data.filter(member => member.status === 'COMPLETED').length)
        })
        .catch(e => {
          console.log(e)
        })
    };

    getMembers();
  }, []);

  useEffect(() => {
    const getMembers = async () => {
      taskService.getMemberOfTask(taskId)
        .then(res => {
          setMembers(res.data)
          console.log(res.data)
        })
        .catch(e => {
          console.log(e)
        })
    };

    getMembers();
  }, []);


  const handleRemoveClick = async (memberId) => {
    setTargetUser(memberId)
    setOpenDialog(true)
  };

  const handleDeleteMember = async (memberId) => {
    taskService.abandonTaskAssignment(taskId, memberId)
      .then(()=>{
        const updatedMembers = members.filter(member => member.id !== memberId)
        setMembers(updatedMembers)
        setOpenSnackbar(true)
        setOpenDialog(false)
      })
      .catch(e=>console.log(e))
  }

  if (members.length===0){
    return (
      <div>This task is no longer existed</div>
    )
  }
  else
  return (
    <div >
      <Header />

      <Grid container spacing={2}>
        <Grid item xs={3}>
            <Button variant="contained" sx={{mt: 3, ml:4}}  startIcon={<ArrowBackIosIcon />} onClick={()=>navigate('/home')}>
              Back to home
            </Button>
          </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" align="center" gutterBottom color="primary" sx={{ mt: 3 }}>
            {taskName}
          </Typography>
        </Grid>
      </Grid>
      <div style={{ marginLeft: "130px" }} >
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>

              <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', mb: 4, mt: 3 }}>
                Task Summary
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <UserIcon sx={{ mr: 1 }} />
                    Total member of this task:
                    <Chip label={members.length} color="primary" sx={{ ml: 2 }} />
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1">
                    <CheckCircleIcon sx={{ mr: 1 }} />
                    Members has completed their task:
                    <Chip label={completedMember} color="success" sx={{ ml: 2 }} />
                  </Typography>
                </Grid>
              </Grid>

            </Grid>
          </Grid>
        </div>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <Typography variant="h6" component="h2" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
            Member List
          </Typography>
          <List>
            {members.map((user) => (
              <ListItem
                key={user.id}
                style={{
                  padding: "10px 0",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Grid container alignItems="center" spacing={1}>
                  {/* Avatar */}
                  <Grid item xs={1}>
                    <ListItemAvatar>
                      <Avatar alt={user.name} src={user.profilePicture} />
                    </ListItemAvatar>
                  </Grid>

                  {/* Name and Description */}
                  <Grid item xs={4}>
                    <ListItemText
                      primary={`${user.name} ${user.id != userId ? '' : '(You)'}`}
                      secondary={user.taskName}
                      primaryTypographyProps={{
                        style: { fontWeight: "bold" },
                      }}
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <Box position="relative" display="inline-flex">
                      <CircularProgress variant="determinate" value={user.progression} size={35} thickness={4} />
                      <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        sx={{ transform: 'translate(-50%, -50%)' }}
                      >
                        <Typography variant="caption" component="div" color="text.secondary">{`${user.progression}%`}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Status */}
                  <Grid item xs={2}>
                    <Grid container spacing={1} justifyContent="flex-start">
                      <Grid item>
                        <StatusBadge status={user.status} />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Kick */}
                  <Grid item xs={2}>
                    <Grid item>
                      <Chip
                        icon={<Cancel />}
                        label="Remove"
                        onClick={() => handleRemoveClick(user.id)}
                        variant="outlined"
                        color="error"
                        sx={{ ml: 2, display: user.id != userId ? 'inline-flex' : 'none' }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          
        </div>
      </div>
      <Dialog
        open={openDialog}
        onClose={()=>setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" >
          Do you want to remove this member from this task?{targetUser}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => handleDeleteMember(targetUser)} color="error">Remove</Button>
          <Button onClick={()=>setOpenDialog(false)} autoFocus>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={()=>setOpenSnackbar(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert
          onClose={()=>setOpenSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}>
          Remove successfully
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ManageMember;
