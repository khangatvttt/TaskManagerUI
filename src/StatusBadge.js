import React from 'react';
import PropTypes from 'prop-types';
import { Chip } from '@mui/material';

const statusStyles = {
    COMPLETED: { backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' },
    CANCELLED: { backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#F44336' },
    INPROGRESS: { backgroundColor: 'rgba(33, 150, 243, 0.1)', color: '#2196F3' },
    DELAYED: { backgroundColor: 'rgba(255, 193, 7, 0.1)', color: '#FFC107' },
};

const StatusBadge = ({ status }) => {
  const style = statusStyles[status] || {};

  return <Chip label={status} sx={style} />;
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

export default StatusBadge;
