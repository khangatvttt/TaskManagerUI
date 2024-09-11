import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBRadio,
  MDBIcon
} from 'mdb-react-ui-kit';
import image from './resource/SignUp.png';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import accountService from './service/accountService';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from "react-router-dom";


function SignUp() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    email: "",
    birthdate: null,
    gender: null, // True is Male
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(null)



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'gender') {
      if (value==='1'){
        setUserData({ ...userData, [name]: true });
      }
      else{
        setUserData({ ...userData, [name]: false });
      }

    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleDateChange = (date) => {
    setUserData({ ...userData, birthdate: date });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userData.name.trim()) newErrors.name = '* Full name is required';
    if (dayjs().isBefore(userData.birthdate) || dayjs(userData.birthdate).isBefore(dayjs('1990-01-01')) || !dayjs(userData.birthdate).isValid()) newErrors.birthdate = '* Date is invalid';
    if (userData.gender===null) newErrors.gender = '* Gender is required';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userData.email)) newErrors.email = '* Invalid email format';

    if (!userData.password) newErrors.password = '* Password is required';
    if (userData.password !== userData.confirmPassword) newErrors.confirmPassword = '* Passwords do not match';
    if (userData.password.length<6) newErrors.password = '* Password must contain at least 6 characters'

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()){
      const data = {
        ...userData,
        birthdate: dayjs(userData.birthdate).format('YYYY-MM-DD')
      };
      const { confirmPassword, ...dataToSend } = data;
      accountService.signUp(dataToSend)
      .then( setOpen(true) )
      .catch(e => {
        setError(e.response.data.error)
        setOpen(true)
      })
    }
  };

  const handleClose = () => {
    if (error) {
      setOpen(false);
      setTimeout(() => {
        setError(null);
      }, 500); //Delay to make sure the Dialog is close
    } else {
      navigate('/login');
    }
  };


  return (
    <div>
      <Dialog open={open}>
      <DialogTitle>
        {error ? (
          <ErrorOutlineIcon style={{ color: 'red', marginRight: 8 }} />
        ) : (
          <CheckCircleIcon style={{ color: 'green', marginRight: 8 }} />
        )}
        {error ? 'Sign up fail' : 'Sign up successfully'}
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" color="textSecondary">
          {error?error:"Please verify your email to active your account. You can't login until your email is verified."}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color={error ? 'secondary' : 'primary'} variant="contained">
          {error ? 'Close' : 'Back to login'}
        </Button>
      </DialogActions>
    </Dialog>
    <MDBContainer fluid className='bg-info d-flex justify-content-center align-items-center' style={{ height: '100vh', overflow: 'hidden' }}>
      <MDBCard className='my-4' style={{ maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}>
        <MDBRow className='g-0'>
          <MDBCol md='6' className="d-none d-md-block">
            <MDBCardImage src={image} alt="Sign Up" className='rounded-start w-100 fit-height-image' />
          </MDBCol>
          <MDBCol md='6'>
            <MDBCardBody className='text-black d-flex flex-column justify-content-center p-4'>
              <h3 className="mb-4 text-uppercase fw-bold">Sign Up</h3>

              <MDBInput
                label='Full name'
                size='lg'
                id='form1'
                type='text'
                name='name'
                value={userData.name}
                onChange={handleInputChange}
              />
              {errors.name && <div className="text-danger" style={{ fontSize: '10px' }}>{errors.name}</div>}

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label='Birthday'
                  format="DD/MM/YYYY"
                  className={errors.name ? 'mt-2' : 'mt-4'}
                  slotProps={{ textField: { size: 'small' } }}
                  value={userData.birthdate}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              {errors.birthdate && <div className="text-danger" style={{ fontSize: '10px' }}>{errors.birthdate}</div>}

              <div className={errors.birthdate ? 'd-flex justify-content-start align-items-center mt-2' : 'd-flex justify-content-start align-items-center mt-4'}>
                <h6 className="fw-bold mb-0 me-3">Gender: </h6>
                <MDBRadio name='gender' id='genderFemale' value={0} label='Female' inline onChange={handleInputChange} />
                <MDBRadio name='gender' id='genderMale' value={1} label='Male' inline onChange={handleInputChange} />
                {errors.gender && <div className="text-danger" style={{ fontSize: '10px' }}>{errors.gender}</div>}
                {!errors.gender && <div style={{ fontSize: '10px', color: "white"}}>.................................</div>}
              </div>

              <MDBInput
                wrapperClass='mt-3'
                label='Email ID'
                size='lg'
                id='form2'
                type='text'
                name='email'
                value={userData.email}
                onChange={handleInputChange}
              />
              {errors.email && <div className="text-danger" style={{ fontSize: '10px' }}>{errors.email}</div>}

              <div className={errors.email ? 'position-relative mt-2' : 'position-relative mt-4'}>
                <MDBInput
                  label='Password'
                  size='lg'
                  id='form3'
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={userData.password}
                  onChange={handleInputChange}
                />
                <MDBIcon
                  icon={showPassword ? 'eye-slash' : 'eye'}
                  onClick={togglePasswordVisibility}
                  className="position-absolute top-50 end-0 translate-middle-y me-3"
                  style={{ cursor: 'pointer' }}
                />
              </div>
              {errors.password && <div className="text-danger" style={{ fontSize: '10px' }}>{errors.password}</div>}

              <div className={errors.password ? 'position-relative mt-2' : 'position-relative mt-4'}>
                <MDBInput
                  label='Confirm password'
                  size='lg'
                  id='form4'
                  type={showConfirmPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  value={userData.confirmPassword}
                  onChange={handleInputChange}
                />
                <MDBIcon
                  icon={showConfirmPassword ? 'eye-slash' : 'eye'}
                  onClick={toggleConfirmPasswordVisibility}
                  className="position-absolute top-50 end-0 translate-middle-y me-3"
                  style={{ cursor: 'pointer' }}
                />
              </div>
              {errors.confirmPassword && <div className="text-danger" style={{ fontSize: '10px' }}>{errors.confirmPassword}</div>}

              <div className={errors.confirmPassword ? 'd-flex justify-content-end' : 'd-flex justify-content-end mt-3'}>
                <MDBBtn className='ms-2' color='warning' size='lg' onClick={handleSubmit}>Register</MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
    </div>
  );
}

export default SignUp;
