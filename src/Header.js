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
  MDBSpinner
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import './Header.css'
import userService from './service/userService';
import { formatDistanceToNow } from 'date-fns';
import { ca } from 'date-fns/locale';

function Header() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [unreadNumber, setUnreadNumber] = useState(0)
  const [avatar, setAvatar] = useState('')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    const pageSize = 5
    const fetchDataNotification = () => {
      userService.getNotifications(localStorage.getItem("User ID"), pageSize, page)
        .then(res => {
          setNotifications(prev => [...prev, ...res.data])
          if (res.data.length < pageSize) {
            setHasMore(false); // No more notifications to load
          }
          setLoading(false)
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    };

    fetchDataNotification();
  }, [page]);

  useEffect(()=>{
    userService.countUnreadNotification(localStorage.getItem("User ID"))
    .then(res => setUnreadNumber(res.data))
    .catch(err => console.log(err))

    userService.getAvatar(localStorage.getItem("User ID"))
    .then(res => setAvatar(res.data))
    .catch(err=> console.log(err))
  }, [])

  const loadMoreNotifications = (event) => {
    event.stopPropagation(); 
    event.preventDefault();
    setPage(prev => prev + 1);
    setLoading(true); 
  };

  const onClick = (path) =>{
    console.log(path)
  }

  const handleNavigationNotification = (path, notificationId, isRead) => {
    if (!isRead){
      userService.setReadNotification(localStorage.getItem("User ID"), notificationId, true)
      setUnreadNumber(prev => prev - 1)
      const updatedNoti = notifications.map((noti) =>
      noti.id === notificationId ? { ...noti, read: true } : noti
      );
      setNotifications(updatedNoti);
    }
    navigate(path)
  }

  const handleChangeSearch = (e) =>{
    setSearchInput(e.target.value)
  }

  const handleKeyDown = (e) =>{
    if (e.key === 'Enter'){
      navigate(`/home?taskName=${searchInput}`);
    }
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
              placeholder='Search task (Enter to search)'
              style={{ minWidth: '225px' }}
              value={searchInput}
              onChange={handleChangeSearch}
              onKeyDown={handleKeyDown}
            />
          </MDBInputGroup>

          <MDBNavbarNav className='d-flex flex-row' right fullWidth={false}>
            <MDBNavbarItem>
              <MDBDropdown>
              <MDBDropdownToggle tag='a' className='hidden-arrow me-3 me-lg-0 nav-link' style={{ cursor: 'pointer' }}>
                <MDBIcon fas icon='bell' />
                <MDBBadge pill notification color='danger'>
                  {unreadNumber}
                </MDBBadge>
              </MDBDropdownToggle>
                <MDBDropdownMenu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <MDBDropdownItem key={index} link onClick={()=>handleNavigationNotification(notification.targetUrl, notification.id, notification.read)}>
                        {!notification.read && (
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
                        {notification.notification} 
                        <br />
                        <small style={{ color: '#888' }}>
                          {formatDistanceToNow(new Date(notification.time), { addSuffix: true })} {/* Display relative time */}
                        </small>
                      </MDBDropdownItem>
                    ))
                  ) : (
                    <MDBDropdownItem link>Notification is empty</MDBDropdownItem>
                  )}
                  
                  {hasMore ? (
                    <MDBDropdownItem link onClick={loadMoreNotifications} disabled={loading}>
                      <span 
                        style={{
                          display: 'block',
                          textAlign: 'center',
                          color: '#007bff',
                          cursor: 'pointer',
                          padding: '10px 0',
                          fontWeight: 'bold'
                        }}
                      >
                        {loading ? (
                          <MDBSpinner small role="status" tag="span" className="me-2">
                            <span className="visually-hidden">Loading...</span>
                          </MDBSpinner>
                        ) : (
                          "Load more notifications"
                        )}
                      </span>
                    </MDBDropdownItem>
                  ):<span 
                        style={{
                          display: 'block',
                          textAlign: 'center',
                          color: '#007bff',
                          cursor: 'pointer',
                          padding: '10px 0',
                          fontWeight: 'bold'
                        }}
                      >
                          No more notification
                      </span>}
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>

            {/* Avatar */}
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='hidden-arrow d-flex align-items-center nav-link'>
                  <img
                    src={avatar}
                    className='avatarHeader'
                    height='22'
                    alt='Avatar'
                    loading='lazy'
                  />
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link onClick={()=>navigate(`/user/${localStorage.getItem('User ID')}/profile`)}>MyProfile</MDBDropdownItem>
                  <MDBDropdownItem link>Settings</MDBDropdownItem>
                  <MDBDropdownItem link onClick={()=>logout()}>Logout</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBContainer>
      </MDBNavbar>
      
    </header>
    </div>
  );
}
export default Header;