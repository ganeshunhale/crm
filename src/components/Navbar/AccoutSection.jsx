import { Box, Typography } from '@mui/material';
import { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateActiveId } from '../../redux/authSlice';
import { SET_ACTIVE_ACCOUT } from '../../API/ApiServices';

const AccountList = ({ label, color, bgColor, accounts, active_id, onSelect }) => (
  <>
    {accounts?.map((id) => {
      const isActive = id === active_id;
      return (
        <Box
          key={id}
          onClick={() => onSelect(id)}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 1.2,
            px: 1.5,
            cursor: 'pointer',
            userSelect: 'none',
            borderLeft: isActive ? `3px solid ${color}` : '3px solid transparent',
            bgcolor: isActive ? 'action.hover' : 'transparent',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color,
                background: bgColor,
                px: 1,
                borderRadius: 0.5,
                mr: 1
              }}
            >
              {label}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: isActive ? 'text.primary' : 'text.secondary',
                fontWeight: isActive ? 600 : 400
              }}
            >
              Standard
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: isActive ? 700 : 500,
              color: isActive ? color : 'text.primary'
            }}
          >
            {id}
          </Typography>
        </Box>
      );
    })}
  </>
);

function AccountSelector() {
  const isLoggedIn = useSelector((state) => state.auth);
  const accounts = isLoggedIn?.data?.data?.accounts;
  const active_id = isLoggedIn?.data?.data?.active_id 
  const dispatch = useDispatch();
  const handleActiveIdChange = useCallback(async (id) => {
    try {
      const { data } = await SET_ACTIVE_ACCOUT(id)
    } catch (error) {
      console.log
    } finally {
      dispatch(updateActiveId(id));
    }
  }, [dispatch]);

  return (
    <Box sx={{ px: 2, py: 1.5 }}>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}
      >
        Choose an account
      </Typography>

      <AccountList
        label="Real"
        color="#FFD700"
        bgColor="rgba(255,215,0,0.15)"
        accounts={accounts?.real_ids}
        active_id={active_id}
        onSelect={handleActiveIdChange}
      />

      <AccountList
        label="Demo"
        color="#46CD7C"
        bgColor="rgba(70,205,124,0.15)"
        accounts={accounts?.demo_ids}
        active_id={active_id}
        onSelect={handleActiveIdChange}
      />
    </Box>
  );
}

export default memo(AccountSelector)
