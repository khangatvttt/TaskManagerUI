import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Moment from 'moment';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBIcon,
  MDBBadge
} from 'mdb-react-ui-kit';
import Header from './Header';
import userService from './service/userService';

export default function ProfilePage() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    address:'',
    birthdate:'',
    createdAt:'',
    email:'',
    gender:'',
    mainJob:'', 
    name:'',
    profilePicture:'',
  })
  const [taskSummary, setTaskSummary] = useState({
    taskInvolved: 0,
    taskManage: 0,
    inprogressTask: 0,
    completedTask: 0
  })
  const { userId } = useParams()
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () =>{
      userService.getUserInfo(userId)
      .then(res=>{
        setUserInfo(res.data)
      })
      .catch(e => {
          console.error(e); 
          setError(e.response.data.status)
      });

      userService.getTaskSummary(userId)
      .then(res=>{
        setTaskSummary(res.data)
      })
      .catch(e => {
          console.error(e); 
          setError(e.response.data.status)
      });
    }
    fetchData()
  }, []); 

  const handleEditButton= ()=>{
    navigate(`/user/${userId}/editprofile`)
  }

  if (error){
    return (
      <div>{error}</div>
    )
  }


  return (
    <div>
      <Header/>
      <section style={{ backgroundColor: '#eee' }}>
        <MDBContainer className="py-3">
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="d-flex justify-content-center align-items-center"  style={{ height: '502px'}}>
                <MDBCardBody className="text-center d-flex justify-content-center align-items-center">
                  <div>
                  <MDBCardImage
                      src={userInfo.profilePicture}
                      alt="avatar"
                      className="rounded-circle mb-4"
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover', // Ensures the image fills the container
                      }}
                      fluid
                    />
                  <p className="text-muted mb-1">{userInfo.name}</p>
                  <p className="text-muted mb-1">{userId.gender?'Male':'Female'}</p>
                  <p className="text-muted mb-4">{userInfo.mainJob}</p>
                  <div className="d-flex justify-content-center mb-2">
                    <MDBBtn onClick={()=>handleEditButton()}>Update your info</MDBBtn>
                  </div>
                  <div className="d-flex justify-content-center mb-3 mt-3">
                    <MDBBtn color="secondary" onClick={() => navigate('/home')}>
                      <MDBIcon fas icon="home" className="me-2" />
                      Back to Home Page
                    </MDBBtn>
                  </div>
                  </div>
                </MDBCardBody>
              </MDBCard>

              
            </MDBCol>
            <MDBCol lg="8">
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Email</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{userInfo.email}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Birthdate</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{Moment(userInfo.birthdate).format('DD-MM-yyyy')}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Address</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{userInfo.address}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Account created at</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{Moment(userInfo.createdAt).format('HH:mm DD-MM-yyyy')}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  
                </MDBCardBody>
              </MDBCard>

              <MDBRow>
                <MDBCol md="12">
                  <MDBCard className="mb-4 mb-md-0">
                    <MDBCardBody>
                      <MDBCardText className="mb-3">
                        <p className="text-primary font-italic me-1">Task Summary</p>
                      </MDBCardText>
                      <MDBRow>
                        <MDBCol md="6">
                          <p><MDBIcon fas icon="tasks" className="me-2 mt-3"/> Tasks you're involved in: <MDBBadge color="primary" className='ms-2'>{taskSummary.taskInvolved}</MDBBadge></p>
                        </MDBCol>
                        <MDBCol md="6">
                          <p><MDBIcon fas icon="user-tie" className="me-2 mt-3"/> Tasks you manage: <MDBBadge color="success" className='ms-2'>{taskSummary.taskManage}</MDBBadge></p>
                        </MDBCol>
                      </MDBRow>
                      <hr />
                      <MDBRow>
                        <MDBCol md="6">
                          <p><MDBIcon fas icon="hourglass-half" className="me-3 mt-3 mb-2"/> In-progress tasks: <MDBBadge color="warning" className='ms-2'>{taskSummary.inprogressTask}</MDBBadge></p>
                        </MDBCol>
                        <MDBCol md="6">
                          <p><MDBIcon fas icon="check-circle" className="me-2 mt-3 mb-2"/> Completed tasks: <MDBBadge color="info" className='ms-2'>{taskSummary.completedTask}</MDBBadge></p>
                        </MDBCol>
                      </MDBRow>
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