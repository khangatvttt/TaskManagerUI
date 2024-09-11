import React, { useState, useEffect } from 'react';
import { CircularProgress, Button, Typography, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import accountService from './service/accountService';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


const VerifyEmail = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const code = searchParams.get('code');

    useEffect(() => {
        accountService.verifyEmail(code)
        .then(() => setStatus('success'))
        .catch(e => {
            setStatus('error');
            console.error(e); 
        });
    }, [code]); 

    const toLoginPage = () => {
        navigate('/login')
      };

    const toSignupPage = () => {
        navigate('/register')
      };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        {status === 'loading' && (
            <>
            <CircularProgress />
            <Typography variant="h6" mt={2}>Verifying your email, please wait...</Typography>
            </>
        )}
        {status === 'success' && (
            <>
            <CheckCircleIcon style={{ fontSize: 60, color: 'green' }} />
            <Typography variant="h6" mt={2}>Your email has been successfully verified!</Typography>
            <Button variant="contained" color="primary" mt={2} onClick={toLoginPage} className='mt-1'>To Login Page</Button>
            </>
        )}
        {status === 'error' && (
            <>
            <ErrorIcon style={{ fontSize: 60, color: 'red' }} />
            <Typography variant="h6" mt={2}>There was an issue verifying your email.</Typography>
            <Button variant="contained" color="primary" mt={2} onClick={toSignupPage} className='mt-1'>Sign Up Again</Button>
            </>
        )}
        </Box>
    );
};

export default VerifyEmail;
