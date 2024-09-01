import React, {useState} from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput
}
from 'mdb-react-ui-kit';
import './LoginPage.css'
import image from './MainLogin.PNG';
import accountService from './service/accountService';
import Alert from '@mui/material/Alert';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';


function LoginPage() {
  //document.body.style = 'background: #dcfaf7';

  const navigate = useNavigate()

  const [loginInfo, setLoginInfo] = useState({
    email:'',
    password:''
  })
  const [error, setError] = useState(null)


  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleLogin = (e) => {
    e.preventDefault();

    accountService.login(loginInfo)
      .then(res => {
        localStorage.setItem('Token', res.data)
        const decoded = jwtDecode(res.data);
        localStorage.setItem('User ID',decoded.uid)
        navigate("/home")
      })
      .catch(e=>setError(e.response.data.error))

  }

  return (
    <MDBContainer className="my-5">

      <MDBCard>
        <MDBRow className='g-0'>

          <MDBCol md='6'>
          <MDBCardImage src={image} alt="login form" className='rounded-start w-100 fit-height-image'/>
          </MDBCol>

          <MDBCol md='6'>
            <MDBCardBody className='d-flex flex-column'>

              <div className='d-flex flex-row mt-2'>
                <MDBIcon fas icon="business-time fa-3x me-3" style={{ color: '#ff6219' }}/>
                <span className="h1 fw-bold mb-0">Task Manager App</span>
              </div>

              {!error && (
                <h5 className="fw-normal my-5" style={{letterSpacing: '1px'}}>Sign into your account</h5>
              )}              
              {error && (
                <div>
                <h5 className="fw-normal pt-2 pb-1" style={{letterSpacing: '1px'}}>Sign into your account</h5>
                <Alert className='pt-1 pb-1 mb-4' icon={<ErrorIcon fontSize="inherit" />} severity="error" value={error} onClose={()=>setError(null)}>
                {error}
                </Alert>
                </div>
              )}
                <MDBInput wrapperClass='mb-4' label='Email address' id='emailInput'
                          type='email' size="lg" name='email' onChange={handleChange}/>
                <MDBInput wrapperClass='mb-4' label='Password' id='passwordInput'
                          type='password' size="lg" name='password' onChange={handleChange}/>
              <MDBBtn className="mb-4 px-5" color='dark' size='lg' onClick={handleLogin}>Login</MDBBtn>
              <a className="small text-muted" href="#!">Forgot password?</a>
              <p className="mb-5 pb-lg-2" style={{color: '#393f81'}}>Don't have an account? <a href="#!" style={{color: '#114ffa'}}>Register here</a></p>


            </MDBCardBody>
          </MDBCol>

        </MDBRow>
      </MDBCard>

    </MDBContainer>
  );
}

export default LoginPage;