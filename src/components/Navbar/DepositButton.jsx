import { useState, memo } from 'react';
import { Button } from '@mui/material';
import DepositDialog from '../DepositDialog/DepositDialog';

const DEPOSIT_BUTTON_STYLES = {
  ml: 2,
  background: '#4b5563',
  px: 6,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    background: '#374151',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  }
};

const DepositButton = () => {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Button 
        variant='contained' 
        sx={DEPOSIT_BUTTON_STYLES}
        onClick={() => setOpenDialog(true)}
        aria-label="Open deposit dialog"
      >
        Deposit
      </Button>
      <DepositDialog onOpen={openDialog} onClose={setOpenDialog} />
    </>
  );
};

export default memo(DepositButton);
