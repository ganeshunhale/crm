import { useState, memo } from 'react';
import { Button } from '@mui/material';
import DepositDialog from '../DepositDialog/DepositDialog';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DEPOSIT_BUTTON_STYLES = {
  ml: 2,
  background: '#4b5563',
  px: {sm: 3,md: 6},
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    background: '#374151',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  }
};

const DepositButton = () => {
  const navigate = useNavigate()
  const isLoggedIn = useSelector(state => state.auth)
  const [openDialog, setOpenDialog] = useState(false);

  const handleRedirect = () => {
    if (isLoggedIn?.accountType === "Demo") {
      setOpenDialog(true)
    } else {
      navigate('/dashboard/lay-out/deposit')
    }
  }

  return (
    <>
      <Button
        variant='contained'
        sx={DEPOSIT_BUTTON_STYLES}
        onClick={handleRedirect}
        aria-label="Open deposit dialog"
      >
        Deposit
      </Button>
      <DepositDialog onOpen={openDialog} onClose={setOpenDialog} />
    </>
  );
};

export default memo(DepositButton);
