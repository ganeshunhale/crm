import { Box, Typography } from "@mui/material";
import "../../components/PositionTable/PositionsTable.css"

const TestPage = () => {
  return (
    <>
    <Typography variant="h5" color="black">My Accounts</Typography>
    <Box 
      sx={{ 
        p: 4, 
        backgroundColor: "#f9fafb", 
        borderRadius: 2, 
        boxShadow: 2 
      }}
    >
      
       <p>payment</p>
    </Box>
    </>
  );
};

export default TestPage;
