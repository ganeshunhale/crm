import { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, Stack, Grid, Container, useTheme, Chip } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OrderHistoryTable from "../History";
import { useNavigate } from "react-router-dom";
import { GET_ACCOUNT_SUMMARY_API } from "../../../API/ApiServices";
import { useLocation } from 'react-router-dom';
import { useSelector,useDispatch } from "react-redux";
import { updateActiveId } from "../../../redux/authSlice";
import { DATES } from "../../../constants";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, personName, muiTheme) {
    return {
        fontWeight: personName.includes(name)
            ? muiTheme.typography.fontWeightMedium
            : muiTheme.typography.fontWeightRegular,
    };
}

const Summary = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const muiTheme = useTheme()
    const location = useLocation();
    const [activeTab, setActiveTab] = useState("summary");
    const [selectedDays, setSelectedDays] = useState(1);
    const [summaryData, setSummaryData] = useState({})
    const isLoggedIn = useSelector(state => state.auth)
    const [historyType, setHistoryType] = useState('')
    const [formateDate, setFormateDate] = useState({})

    const Types = [
        ...isLoggedIn.data.client_MT5_id.real_ids.map(id => ({ id, type: 'Real' })),
        ...isLoggedIn.data.client_MT5_id.demo_ids.map(id => ({ id, type: 'Demo' })),

    ];

    const [accountId, setAccountId] = useState(isLoggedIn.data.data.active_id);
    const handleTabChange = (event, newValue) => {
        setSelectedDays(1)
        // 1. Reset the date to last 7 days
        const defaultDate = getDateRange(1);
        setFormateDate(defaultDate);

        // 2. Reset accountId to the first item
        if (Types.length > 0) {
            setAccountId(Types[0].id);
        }

        // 3. Set the active tab
        setActiveTab(newValue);

        // 4. Navigate to the corresponding tab
        if (newValue === 'summary') {
            navigate('/dashboard/lay-out/summary');
        } else {
            navigate('/dashboard/lay-out/order-history');
        }
    };


    useEffect(() => {
        if (location.pathname === '/dashboard/lay-out/summary') {
            setActiveTab('summary')
        } else {
            setActiveTab('historyOfOrders')
        }
    }, [location])

    const handleChange = (event) => {
        setSelectedDays(1);
        const selectedId = event.target.value;
        dispatch(updateActiveId(selectedId));
        setAccountId(selectedId);
        if (activeTab === "summary") {
            getSummaryDetails(selectedId);
        }
    };

    const getDateRange = (days) => {
        const to = new Date(); // now
        const from = new Date();
        from.setDate(from.getDate() - days); // subtract days

        // Format to "YYYY-MM-DD HH:mm:ss.SSSSSS"
        const formatDate = (date) =>
            date.toISOString().replace('T', ' ').replace('Z', '');

        return {
            from: formatDate(from),
            to: formatDate(to),
        };
    };

    const handleChangeDate = (e) => {
        const days = Number(e.target.value); // ensure number
        setSelectedDays(days); // ✅ update select state
        const formattedDate = getDateRange(days);
        setFormateDate(formattedDate)

    };

    const getSummaryDetails = async (id) => {
        try {
            if (activeTab === "historyOfOrders") return
            const formattedDate = getDateRange(selectedDays);
            const payload = {
                event: "summary-details",
                data: {
                    ...formattedDate,
                    clientId: id,
                },
            };
            const res = await GET_ACCOUNT_SUMMARY_API(payload)
            if (res.status === 200) {
                setSummaryData(res.data.result)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getSummaryDetails(accountId);
    }, [selectedDays, accountId]);

    useEffect(() => {
        const defaultDate = getDateRange(1)
        setFormateDate(defaultDate)
    }, [])

    return (
        <>
            <Container>
                <Box sx={{
                    width: "100%",
                    py: 3,
                }}>
                    <Typography variant="h5" sx={{ color: 'black', fontWeight: 'bold' }}>
                        Trading
                    </Typography>
                </Box>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    textColor=""
                    indicatorColor="primary"
                    sx={{ color: 'black', borderBottom: '1px solid', borderColor: 'grey.200' }}
                >
                    <Tab label="Summary" value="summary" />
                    <Tab label="History of order" value="historyOfOrders" />
                </Tabs>
                <Box sx={{ color: 'black', py: 2 }}>
                    <Typography>Account</Typography>
                    <FormControl sx={{ mt: 2, width: 400 }} size="small">
                        <Select
                            labelId="account-label"
                            id="account-label"
                            value={accountId}
                            onChange={handleChange}
                            MenuProps={MenuProps}
                            sx={{ color: 'black' }}
                            renderValue={(selected) => {
                                const selectedItem = Types.find(item => item.id === selected);
                                return `MT5 Standard #${selectedItem?.id}`;
                            }}
                        >
                            {Types.map(({ id, type }) => (
                                <MenuItem
                                    key={id}
                                    value={id}
                                    style={getStyles(id, accountId, muiTheme)}
                                >
                                    <Stack direction="column">
                                        <Box sx={{ width: 'fit-content' }}>
                                            <Chip label={type} size="small" sx={{
                                                backgroundColor:
                                                    (type) === 'Real' ? '#FFDE0229' : // blue
                                                        (type) === 'Demo' ? '#46CD7C29' : // red
                                                            'default',
                                                color:
                                                    (type) === 'Real' ? '#968305ff' : // blue
                                                        (type) === 'Demo' ? '#055927ff' : // red
                                                            'default',
                                            }} />
                                        </Box>
                                        <Box p={1}>
                                            <Typography variant="body1"><span style={{ fontWeight: 'bold' }}>MT5 </span>Standared  #{id} </Typography>
                                        </Box>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {(activeTab === "summary" || historyType === "ClosedOrder") && <FormControl sx={{ mt: 2, ml: 2, width: 150 }} size="small">
                        <Select
                            labelId="date-label"
                            id="date-select"
                            value={selectedDays}
                            onChange={handleChangeDate}
                            MenuProps={MenuProps}
                            sx={{ color: 'black' }}
                        >
                            {DATES.map((date) => (
                                <MenuItem
                                    key={date.value}
                                    value={date.value}
                                >
                                    {date.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>}

                </Box>
                {activeTab === "summary" &&
                    <Grid container spacing={2} py={2}>
                        {/* Column 1 */}
                        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", flexDirection: "column", minWidth: 250 }}>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500' }}>
                                Net Profit
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
                                {summaryData.netProfit || 0}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500', mt: 5 }}>
                                Profit {summaryData.profit || 0} USD
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500', mt: 1 }}>
                                Loss {summaryData.loss || 0} USD
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500', mt: 1 }}>
                                Unrealised P/L {summaryData.unrealised || 0} USD
                            </Typography>
                        </Grid>

                        {/* Column 2 */}
                        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", flexDirection: "column", minWidth: 250 }}>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500' }}>
                                Closed Orders
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
                                {summaryData.closedOrderCount || 0}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500', mt: 5 }}>
                                Profitable {summaryData.profitable || 0}
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500', mt: 1 }}>
                                Unprofitable {summaryData.unprofitable || 0}
                            </Typography>
                        </Grid>

                        {/* Column 3 */}
                        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", flexDirection: "column", minWidth: 250 }}>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500' }}>
                                Trading Volume
                            </Typography>
                            <Typography variant="h5" sx={{ color: 'black', fontWeight: 'bold' }}>
                                {summaryData.tradingVolume || 0} USD
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500', mt: 5 }}>
                                Lifetime  {summaryData.lifetime || 0} USD
                            </Typography>
                        </Grid>

                        {/* Column 4 */}
                        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", flexDirection: "column", minWidth: 250 }}>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500' }}>
                                Equity
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
                                {summaryData?.equity || 0} USD
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'grey.500', mt: 5 }}>
                                {summaryData?.current || 0}  USD
                            </Typography>
                        </Grid>
                    </Grid>}
            </Container>
            {activeTab === "historyOfOrders" && <Box>
                <OrderHistoryTable accountId={accountId} setHistoryType={setHistoryType} formateDate={formateDate} />
            </Box>}
        </>
    );
};

export default Summary;
