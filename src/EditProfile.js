import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Moment from 'moment';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBInput,
} from 'mdb-react-ui-kit';
import Header from './Header';
import userService from './service/userService';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

export default function EditProfile() {

  const [userInfo, setUserInfo] = useState({
    address:'',
    birthdate:'',
    createdAt:'',
    email:'',
    gender:'',
    mainJob:'', 
    name:'',
    profilePicture:'',
  });
  const { userId } = useParams();
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await userService.getUserInfo(userId);
        setUserInfo(userResponse.data);
        
      } catch (e) {
        console.error(e);
        setError(e.response?.data?.status || 'Error fetching data');
      }
    };
    fetchData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleButtonClick = () => {
    document.getElementById('fileInput').click();
  };

  const isValidBirthdate = (birthdate) => {
    return Moment(birthdate).isValid() && Moment(birthdate).isBefore(Moment());
  };

  const handleSubmit = async () => {
    const { name, birthdate, address, mainJob } = userInfo;

    if (!name || !birthdate || !address || !mainJob ) {
      setValidationError(`All fields must be filled.`);
      return;
    }


    if (!isValidBirthdate(birthdate)) {
      setValidationError('Please enter a valid birthdate (cannot be in the future).');
      return;
    }

    const formData = new FormData();

    Object.keys(userInfo).forEach((key) => {
      if (key === 'gender') {
        userInfo[key] === 'Male' ? formData.append(key, true) : formData.append(key, false);
        return;
      }
      if (key !== 'createdAt' && key !== 'profilePicture'  && key !== 'email') {
        formData.append(key, userInfo[key]);
      }
    });

    if (selectedImage) {
      const imageFile = document.getElementById('fileInput').files[0];
      formData.append('image', imageFile);
    }
    setLoading(true);
    userService.updateUserProfile(localStorage.getItem('User ID'),formData)
    .then(res=>{
      setValidationError(''); 
      setLoading(false); 
    })
    .catch(e=>{
      console.error(e);
      setLoading(false); 
      alert(`Failed to update profile. ${e.response.data || 'Some thing went wrong'}`);
    })
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Header />
      <section style={{ backgroundColor: '#eee' }}>
        <MDBContainer className="py-3 pt-3">
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="d-flex justify-content-center align-items-center" style={{ height: '440px' }}>
                <MDBCardBody className="text-center d-flex justify-content-center align-items-center">
                  <div>
                    <MDBCardImage
                      src={selectedImage || userInfo.profilePicture}
                      alt="avatar"
                      className="rounded-circle mb-4"
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover', // Ensures the image fills the container
                      }}
                      fluid
                    />
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                    <div className="d-flex justify-content-center mb-2">
                      <MDBBtn onClick={handleButtonClick}>Change your avatar</MDBBtn>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol lg="8">
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <MDBRow className="py-2">
                    <MDBCol sm="3">
                      <label>Full Name</label>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput
                        type="text"
                        name="name"
                        value={userInfo.name}
                        onChange={handleChange}
                      />
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <label>Gender</label>
                    </MDBCol>
                    <MDBCol sm="9">
                      <select
                        className="form-control"
                        name="gender"
                        value={userInfo.gender}
                        onChange={handleChange}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <label>Job</label>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput
                        type="text"
                        name="mainJob"
                        value={userInfo.mainJob}
                        onChange={handleChange}
                      />
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <label>Email</label>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput
                        type="email"
                        name="email"
                        value={userInfo.email}
                        readonly
                      />
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <label>Birthdate</label>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput
                        type="date"
                        name="birthdate"
                        value={Moment(userInfo.birthdate).format('YYYY-MM-DD')}
                        onChange={handleChange}
                      />
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <label>Address</label>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBInput
                        type="text"
                        name="address"
                        value={userInfo.address}
                        onChange={handleChange}
                      />
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>

              <div className="text-end">
                <MDBBtn onClick={handleSubmit} disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : 'Save Changes'}
                </MDBBtn>
              </div>
              {validationError && (
                <div className="alert-container">
                  <Alert severity="error">{validationError}</Alert>
                </div>
              )}
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </div>
  );
}
