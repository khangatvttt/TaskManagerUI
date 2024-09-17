import React, {useState, useEffect}  from 'react';
import {
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBContainer,
  MDBNavbar,
  MDBInputGroup,
  MDBIcon,
  MDBInput,
  MDBNavbarLink,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBBadge,
  MDBBtn
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import './Header.css'
import userService from './service/userService';

function Header() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchDataNotification = () => {
        userService.getNotifications(localStorage.getItem("User ID"), 2, page)
        .then(res => setNotifications(res.data))
        .catch(error =>{
          console.log(error)
        })

    };

    fetchDataNotification();
  }, []);


  const handleNavigation = (path) => {
    navigate(path)
  }

  const logout = () =>{
    localStorage.clear()
    navigate('/')
  }

  return (
    <div className='sticky-header'>
    <header>
      <MDBNavbar expand='lg' light className='bg-white'>
        <MDBContainer fluid>
          <MDBInputGroup textAfter={<MDBIcon fas icon='search' />} noBorder>
            <MDBInput
              autoComplete='off'
              className='active'
              type='search'
              placeholder='Search (ctrl + "/" to focus)'
              style={{ minWidth: '225px' }}
            />
          </MDBInputGroup>

          <MDBNavbarNav className='d-flex flex-row' right fullWidth={false}>
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='hidden-arrow me-3 me-lg-0 nav-link' style={{ cursor: 'pointer' }}>
                  <MDBIcon fas icon='bell' />
                  <MDBBadge pill notification color='danger'>
                    1
                  </MDBBadge>
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <MDBDropdownItem key={index} link>
                      {!notification.isRead && ( // If notification is unread, show a small blue dot
                        <span 
                          style={{
                            height: '8px',
                            width: '8px',
                            backgroundColor: 'blue',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '8px'
                          }}
                        ></span>
                      )}
                      {notification.notification} {/* Display notification text */}
                    </MDBDropdownItem>
                    ))
                  ) : (
                    <MDBDropdownItem link>No notifications available</MDBDropdownItem>
                  )}
                  <MDBDropdownItem link >
                    <a>Load more notifications</a>
                  </MDBDropdownItem>
                </MDBDropdownMenu>

              </MDBDropdown>
            </MDBNavbarItem>

            {/* Avatar */}
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='hidden-arrow d-flex align-items-center nav-link'>
                  <img
                    src='https://mdbootstrap.com/img/new/avatars/2.jpg'
                    className='rounded-circle'
                    height='22'
                    alt='Avatar'
                    loading='lazy'
                  />
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link onClick={()=>handleNavigation(`/user/${localStorage.getItem('User ID')}/profile`)}>MyProfile</MDBDropdownItem>
                  <MDBDropdownItem link>Settings</MDBDropdownItem>
                  <MDBDropdownItem link onClick={()=>logout()}>Logout</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>

      {/* Heading */}
      
    </header>
    </div>
  );
}

export default Header;