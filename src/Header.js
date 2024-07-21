import React, {useState}  from 'react';
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
} from 'mdb-react-ui-kit';

import './Header.css'

function Header() {
  return (
    <div className='sticky-header'>
    <header>
      {/* Main Navigation */}
      <MDBNavbar expand='lg' light className='bg-white'>
        {/* Container wrapper */}
        <MDBContainer fluid>
          {/* Search form */}
          <MDBInputGroup textAfter={<MDBIcon fas icon='search' />} noBorder>
            <MDBInput
              autoComplete='off'
              className='active'
              type='search'
              placeholder='Search (ctrl + "/" to focus)'
              style={{ minWidth: '225px' }}
            />
          </MDBInputGroup>

          {/* Right links */}
          <MDBNavbarNav className='d-flex flex-row' right fullWidth={false}>
            {/* Notification dropdown */}
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='hidden-arrow me-3 me-lg-0 nav-link' style={{ cursor: 'pointer' }}>
                  <MDBIcon fas icon='bell' />
                  <MDBBadge pill notification color='danger'>
                    1
                  </MDBBadge>
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link>Some news</MDBDropdownItem>
                  <MDBDropdownItem link>Another news</MDBDropdownItem>
                  <MDBDropdownItem link>Something else</MDBDropdownItem>
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
                  <MDBDropdownItem link>MyProfile</MDBDropdownItem>
                  <MDBDropdownItem link>Settings</MDBDropdownItem>
                  <MDBDropdownItem link>Logout</MDBDropdownItem>
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