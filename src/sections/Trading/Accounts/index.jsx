import { useCallback, useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab, Card, CardContent, Button, Stack, Container } from "@mui/material";
import Chip from '@mui/material/Chip';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { GET_ACCOUNT_DETAILS } from "../../../API/ApiServices";
import AddBalanceDialog from "./AddBalanceDialog";

const Accounts = () => {
  const [activeTab, setActiveTab] = useState("demo");
  const [showTable, setshowTable] = useState(false)
  const [accountDetails,setAccountDetails] = useState({});
  const fullAmount = (accountDetails?.balance + accountDetails?.credit) - accountDetails?.margin || "0.00"; // example: "1234.35"
  const [intPart, decimalPart] = fullAmount.toString().split(".");
  const [open,setOpen] = useState(false)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Mock account details
  const getUserAccDetails = useCallback(async () => {
      try {
        const res = await GET_ACCOUNT_DETAILS();
        setAccountDetails(res.data.result);
      } catch (error) {
        console.log(error);
      }
    }, []);
  
    useEffect(() => {
      getUserAccDetails();
    }, [getUserAccDetails]);

  const KeyValueRow = ({ label, value, dotted = false }) => (
    <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
      <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
        {label}
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          mx: 1,
          my: 1,
          borderBottom: dotted ? "1px dotted rgba(0,0,0,0.5)" : "none",
          height: "1px",
        }}
      />

      <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <>
    <AddBalanceDialog onOpen={open} onClose={setOpen}/>
      <Box
        sx={{
          backgroundColor: "#fff9eb",
          width: "100%",
          py: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: "1200px",  
            mx: "auto",         
            px: 3,              
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Left text */}
          <Typography variant="body1" sx={{ color: "black" }}>
            Hello. Fill in your account details to make your first deposit
          </Typography>
          {/* Right buttons */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              sx={{ background: '#6c859514', color: 'black', textTransform: 'none', px: 2 }}
            >
              Learn More
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ backgroundColor: "#ffde02", textTransform: 'none', color: 'black', px: 2 }}
            >
              Complete Profile
            </Button>
          </Box>
        </Box>
      </Box>
      <Container>
        <Box pt={5}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, color: "black", fontWeight: 'bold' }}>
              My Accounts
            </Typography>
            <Button variant="contained" size="small" startIcon={<AddIcon />} sx={{ backgroundColor: '#6c859514', color: 'black', textTransform: 'none' }}>
              Open Account
            </Button>
          </Box>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            textColor="secodary"
            indicatorColor="primary"
            sx={{ mb: 3, color: 'black', borderBottom: '1px solid', borderColor: 'grey.200' }}
          >
            <Tab label="Demo" value="demo" />
            <Tab label="Real" value="real" />
          </Tabs>
          {/* Card with account details */}
          {activeTab === 'demo' && <Card sx={{
            borderRadius: 2, p: 5, boxShadow: 0, border: '1px solid',
            borderColor: 'grey.200', backgroundColor: "#fff", color: "black"
          }}>
            <Stack direction="row" alignItems="center" gap={1}>
              <Chip label="Demo" size="small" sx={{ backgroundColor: 'grey.200', color: 'grey.800' }} />
              <Chip label="MT5" size="small" sx={{ backgroundColor: 'grey.200', color: 'grey.800' }} />
              <Chip label="Standard" size="small" sx={{ backgroundColor: 'grey.200', color: 'grey.800' }} />
              <Typography variant="button">#158BF9</Typography>
              <Typography variant="button" textTransform="none">Standared</Typography>


              {/* This Box creates space between chips and icon */}
              <Box sx={{ flex: 1 }} />

              {/* Toggle icon at the far right */}
              {!showTable ? (
                <ArrowDropDownIcon onClick={() => setshowTable(true)} sx={{ cursor: 'pointer' }} />
              ) : (
                <ArrowDropUpIcon onClick={() => setshowTable(false)} sx={{ cursor: 'pointer' }} />
              )}
            </Stack>

            <Stack my={2} sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
            
              <Typography variant="h4" fontWeight="bold">{intPart}<span style={{ fontSize: '16px' }}>.{decimalPart} USD</span></Typography>
              <Box>
                <Button variant="contained" size="small" startIcon={<CandlestickChartIcon />} sx={{ backgroundColor: "#ffde02", textTransform: 'none', color: 'black', mr: 2 }} >
                  Trade
                </Button>
                <Button variant="contained" size="small" sx={{ backgroundColor: "#6c859514", textTransform: 'none', color: 'black' }} onClick={()=>setOpen(true)}>
                  Set Balance
                </Button>
              </Box>
            </Stack>

            {activeTab === 'demo' && showTable &&
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    width: "100%",
                    
                  }}
                >
                  {/* Left Column */}
                  <Box
                    sx={{
                      flex: '1 1 48%',
                      p: 2,
                      borderTopLeftRadius: 2,
                      borderBottomLeftRadius: 2,
                      backgroundColor: "#f9fafb",
                      color:"grey.500",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <KeyValueRow label="Actual leverage" value={accountDetails?.accountLeverage} dotted />
                    <KeyValueRow label="Maximum leverage" value="500" dotted />
                    <KeyValueRow label="Floating P/L" value={accountDetails?.profit} dotted />
                  </Box>

                  {/* Right Column */}
                  <Box
                    sx={{
                      flex: '1 1 48%',
                      p: 2,
                      borderTopRightRadius: 2,
                      borderBottomRightRadius: 2,
                      backgroundColor: "#f9fafb",
                       color:"grey.500",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <KeyValueRow label="Free margin" value={(accountDetails?.balance + accountDetails?.credit) - accountDetails?.margin} dotted/>
                    <KeyValueRow label="Equity" value={accountDetails?.balance + accountDetails?.credit} dotted />
                    <KeyValueRow label="Platform" value="MT5" dotted/>
                  </Box>
                </Box>


                <Stack direction="row" gap={3} mt={2}>
                  <Typography variant="caption">Server   MT5</Typography>
                  <Typography variant="caption">MT5 login    248736683</Typography>
                  <Typography variant="caption">Change trading password</Typography>
                </Stack>

              </>}


          </Card>}

          {activeTab === 'real' && <Box
            sx={{
              height: '30vh', // Full screen height
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center', // Center vertically
              alignItems: 'center',     // Center horizontally
              textAlign: 'center',
              color: 'black',
              backgroundColor: '#f9fafb', // optional light gray background
              px: 2, // responsive horizontal padding
            }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              You don't have a real account
            </Typography>
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: '#ffde02',
                color: 'black',
                textTransform: 'none',
                // fontWeight: 'bold',
                px: 3,
              }}
              onClick={() => {
                console.log('Open real account clicked');
              }}
            >
              Open Real Account
            </Button>
          </Box>}

        </Box>
      </Container>
    </>
  );
};

export default Accounts;
