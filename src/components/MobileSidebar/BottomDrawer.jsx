import * as React from 'react';
import PropTypes from 'prop-types';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Drawer from '@mui/material/Drawer'; // ✅ use regular Drawer
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import TradingPanel from '../TradinPanel/TradingPanel';

const drawerBleeding = 56;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: grey[100],
  ...theme.applyStyles?.('dark', {
    backgroundColor: (theme.vars || theme).palette.background.default,
  }),
}));

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.applyStyles?.('dark', {
    backgroundColor: grey[800],
  }),
}));

function SwipeableEdgeDrawer({ open, onClose, selectedOrderType, window ,broadCasterSocket }) {
  const container = window !== undefined ? () => window().document.body : undefined;

  const handleClose =()=>{
     onClose(false)
  }

  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            height: `fit-content`, // or any height you want
            overflow: 'visible',
          },
        }}
      />

      <Drawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={handleClose}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          sx={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            right: 0,
            left: 0,
            height: '100%',
            overflow: 'auto',
          }}
        >
         <TradingPanel broadCasterSocket={broadCasterSocket} onClose={onClose}/>
        </StyledBox>
      </Drawer>
    </Root>
  );
}

SwipeableEdgeDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedOrderType: PropTypes.string,
  window: PropTypes.func,
};

export default SwipeableEdgeDrawer;
