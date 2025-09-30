import { useCallback, useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab, Card, Button, Stack, Container } from "@mui/material";
import Chip from '@mui/material/Chip';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { GET_ACCOUNT_DETAILS, SET_ACTIVE_ACCOUT } from "../../../API/ApiServices";
import AddBalanceDialog from "./AddBalanceDialog";
import { useSelector, useDispatch } from "react-redux";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import ArrowCircleDownOutlinedIcon from '@mui/icons-material/ArrowCircleDownOutlined';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import { useNavigate } from "react-router-dom";
import { SkeletonCard } from "../../../components/Skelton/AccountsCardSkelton";
import { fetchAccountDemoDetails, fetchAccountDetails, updateActiveId } from "../../../redux/authSlice";
import { showSnackbar } from "../../../redux/snackbarslice";


const Accounts = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState("demo");
  const [showTable, setshowTable] = useState(null)
  const [accountDetails, setAccountDetails] = useState([]);
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('')
  const isLoggedIn = useSelector(state => state.auth)
  const [accData, setAccData] = useState([])
  const {
    subAccounts,
    subAccountsDemo,
    subAccountsLoading,
    subAccountsDemoLoading,
    subAccountsErrors,
    subAccountsDemoErrors,
    data,
    activeId,
    accountType,
  } = useSelector((state) => state.auth);
  const isLoading = activeTab === 'real' ? subAccountsLoading : subAccountsDemoLoading;
  const error = activeTab === 'real' ? subAccountsErrors : subAccountsDemoErrors;

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getUserAccDetails = useCallback(() => {
    setAccountDetails([]); // reset on tab change
    if (activeTab === 'real') {
      dispatch(fetchAccountDetails('real'));
    } else {
      dispatch(fetchAccountDemoDetails());
    }
  }, [activeTab, dispatch]);

  useEffect(() => {
    const rawResult = activeTab === 'real' ? subAccounts : subAccountsDemo;

    if (Array.isArray(rawResult)) {
      const parsed = rawResult.flatMap((entry) =>
        Object.entries(entry).map(([accountId, details]) => ({
          accountId,
          accountNumber: accountId,
          accountType: activeTab,
          ...details,
        }))
      );
      setAccountDetails(parsed);
    }
  }, [subAccounts, subAccountsDemo, activeTab]);




  const handleNavigateProfile = () => {
    navigate('/dashboard/lay-out/profile')
  }

  useEffect(() => {
    getUserAccDetails();
  }, [getUserAccDetails]);

  const handleActiveIdChange = useCallback(async (data) => {
    try {
      const res = await SET_ACTIVE_ACCOUT(data.accountNumber)
      if (res.status === 200) {
        dispatch(updateActiveId(data.accountNumber));
        navigate('/dashboard')
      }
      console.log("set active account response", res)
    } catch (error) {
      console.log
    }
  }, [dispatch]);

  const handleCopy = async(data) => {
    console.log("data",data)
    if (data) {
      const accountId =  data === "MT5" ? "MT5" :data
      if (!accountId) return;

      try {
        // Try modern API
        await navigator.clipboard.writeText(accountId);
      } catch (err) {
        // Fallback for older/blocked browsers
        const textarea = document.createElement("textarea");
        textarea.value = accountId;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      dispatch(
        showSnackbar({
          message: `AccountId ${accountId} copied`,
          severity: "success",
          backgroundColor: "grey.500",
          position:{ vertical: 'top', horizontal: 'center' }
        })
      );
    }
  }




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
      <AddBalanceDialog onOpen={open} onClose={setOpen} type={type} activeTab={activeTab} accData={accData} />
      <Container>
        <Box pt={5}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, color: "black", fontWeight: 'bold', }}>
              My Accounts
            </Typography>
            <Button variant="contained" size="small" startIcon={<AddIcon />} sx={{ backgroundColor: '#6c859514', color: 'black', textTransform: 'none', boxShadow: 'none', }} onClick={handleNavigateProfile}>
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


          {isLoading ? <SkeletonCard /> : accountDetails.length > 0 ? accountDetails?.map((data, index) => {
            const balance = data.balance || 0;
            const balanceStr = balance.toFixed(2);
            const [intPart, decimalPart] = balanceStr.split('.');

            const equity = (data.balance || 0) + (data.credit || 0);
            const freeMargin = equity - (data.margin || 0);
            console.log("demo details", data)

            return (
              <Card
                key={index}
                sx={{
                  borderRadius: 2,
                  p: 5,
                  boxShadow: 0,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  backgroundColor: "#fff",
                  color: "black",
                  mb: 3
                }}
              >
                {/* Header Chips */}
                <Stack direction="row" alignItems="center" gap={1}>
                  <Chip label={activeTab === "demo" ? "Demo" : "Real"} size="small" sx={{ backgroundColor: 'grey.200', color: 'grey.800' }} />
                  <Chip label="MT5" size="small" sx={{ backgroundColor: 'grey.200', color: 'grey.800' }} />
                  <Chip label="Standard" size="small" sx={{ backgroundColor: 'grey.200', color: 'grey.800' }} />
                  <Typography variant="button">#{data.accountNumber || 'XXXXXX'}</Typography>
                  <Typography variant="button" textTransform="none">Standard</Typography>

                  <Box sx={{ flex: 1 }} />
                  {showTable === index ? (
                    <ArrowDropUpIcon onClick={() => setshowTable(null)} sx={{ cursor: 'pointer' }} />
                  ) : (
                    <ArrowDropDownIcon onClick={() => setshowTable(index)} sx={{ cursor: 'pointer' }} />
                  )}

                </Stack>

                {/* Balance Section */}
                <Stack my={2} direction="row" justifyContent="space-between">
                  <Typography variant="h4" fontWeight="bold">
                    {intPart}<span style={{ fontSize: '16px' }}>.{decimalPart} USD</span>
                  </Typography>
                  <Box>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CandlestickChartIcon />}
                      sx={{ backgroundColor: "#ffde02", textTransform: 'none', color: 'black', mr: 2, boxShadow: 'none' }}
                      onClick={() => handleActiveIdChange(data)}
                    >
                      Trade
                    </Button>
                    {activeTab === 'demo' && (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ backgroundColor: "#6c859514", textTransform: 'none', color: 'black', boxShadow: 'none' }}
                        onClick={() => { setType("balance"); setOpen(true); setAccData(data) }}
                      >
                        Set Balance
                      </Button>
                    )}
                    {activeTab === 'real' && (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ArrowCircleDownOutlinedIcon />}
                          sx={{ backgroundColor: "#6c859514", textTransform: 'none', color: 'black', boxShadow: 'none', mr: 2 }}
                          onClick={() => navigate('/dashboard/lay-out/deposit')}
                        >
                          Deposit
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ArrowCircleUpOutlinedIcon />}
                          sx={{ backgroundColor: "#6c859514", textTransform: 'none', color: 'black', boxShadow: 'none' }}
                          onClick={() => navigate('/dashboard/lay-out/withdrawal')}
                        >
                          Withdraw
                        </Button>
                      </>
                    )}
                  </Box>
                </Stack>

                {/* Table Section */}
                {showTable === index && (
                  <>
                    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", width: "100%" }}>
                      {/* Left */}
                      <Box sx={{ flex: '1 1 48%', p: 2, backgroundColor: "#f9fafb", color: "grey.500", display: "flex", flexDirection: "column", gap: 2 }}>
                        <KeyValueRow label="Actual leverage" value={data.accountLeverage} dotted />
                        <KeyValueRow label="Maximum leverage" value="500" dotted />
                        <KeyValueRow label="Floating P/L" value={data.profit} dotted />
                      </Box>

                      {/* Right */}
                      <Box sx={{ flex: '1 1 48%', p: 2, backgroundColor: "#f9fafb", color: "grey.500", display: "flex", flexDirection: "column", gap: 2 }}>
                        <KeyValueRow label="Free margin" value={freeMargin} dotted />
                        <KeyValueRow label="Equity" value={equity} dotted />
                        <KeyValueRow label="Platform" value="MT5" dotted />
                      </Box>
                    </Box>

                    <Stack direction="row" gap={3} mt={2}>
                      <Typography variant="caption">
                        Server MT5 <ContentCopyIcon sx={{ fontSize: 16, verticalAlign: 'middle', cursor: 'pointer' }}  onClick={() => handleCopy("MT5")}/>
                      </Typography>
                      <Typography variant="caption">
                        MT5 login {data.accountNumber || 'N/A'} <ContentCopyIcon sx={{ fontSize: 16, verticalAlign: 'middle', cursor: 'pointer' }} onClick={() => handleCopy(data?.accountNumber)} />
                      </Typography>
                      <Typography variant="caption">
                        <EditIcon
                          sx={{ fontSize: 16, verticalAlign: 'middle', cursor: 'pointer' }}
                          onClick={() => { setType("password"); setOpen(true); }}
                        /> Change trading password
                      </Typography>
                    </Stack>
                  </>
                )}
              </Card>
            );
          }) : ((!isLoading && activeTab === 'real' ? subAccounts.length === 0 : subAccountsDemo.length === 0) && <Box
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
              {activeTab === "real" ? " You don't have a real account" : " You don't have a Demo account"}
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
                navigate('/dashboard/lay-out/profile')
              }}
            >
              Open Real Account
            </Button>
          </Box>)}
        </Box>
      </Container>
    </>
  );
};

export default Accounts;
