import { useState, useMemo } from "react";
import { Box, Typography, Tabs, Tab, Card, CardContent, Button, Stack, Grid, Container, useTheme } from "@mui/material";
import CustomAccordion from "../../../components/Accordian";
import { AgGridReact } from "ag-grid-react"; // Make sure AG Grid is installed
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";

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

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

function getStyles(name, personName, muiTheme) {
    return {
        fontWeight: personName.includes(name)
            ? muiTheme.typography.fontWeightMedium
            : muiTheme.typography.fontWeightRegular,
    };
}


const Summary = () => {

    const muiTheme = useTheme()
    const [activeTab, setActiveTab] = useState("summary");
    const [personName, setPersonName] = useState([]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    // Mock account details
    const accountDetails = {
        summary: { netProfit: "D-123456", currentOrders: "$10,000", tradingValue: "1:100" },
        historyOfOrders: { netProfit: "R-789012", currentOrders: "$5,000", tradingValue: "1:200" },
    };

    const rowData = [
        {
            symbol: "EURUSD",
            type: "Buy",
            volume: 1.5,
            open_price: 1.1234,
            tp: 1.1300,
            sl: 1.1200,
            positionid: 101234,
            opentime: "2025-09-11 14:30:00",
        },
        {
            symbol: "USDJPY",
            type: "Sell",
            volume: 2.0,
            open_price: 147.56,
            tp: 146.00,
            sl: 148.50,
            positionid: 101235,
            opentime: "2025-09-11 15:45:00",
        },
    ];

    const colDefs = useMemo(() => [
        { field: "symbol", headerName: "Symbol" },
        { field: "type", headerName: "Type", maxWidth: 120 },
        { field: "volume", headerName: "Volume", maxWidth: 120 },
        { field: "open_price", headerName: "Open Price" },
        { field: "tp", headerName: "T/P", maxWidth: 100 },
        { field: "sl", headerName: "S/L", maxWidth: 100 },
        { field: "positionid", headerName: "Position" },
        { field: "opentime", headerName: "Open Time" },
    ], []);

    return (
        <>
            <Box
                sx={{
                    backgroundColor: "#fff9eb",
                    width: "100%",
                    py: 3,
                }}
            >
                <Box
                    sx={{
                        maxWidth: "1200px",  // constrain content
                        mx: "auto",          // center horizontally
                        px: 3,               // left/right padding
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
                <Box sx={{
                    width: "100%",
                    py: 3,
                }}>
                    <Typography variant="h5" sx={{ color: 'black', fontWeight: 'bold' }}>
                        Summary
                    </Typography>
                </Box>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    textColor=""
                    indicatorColor="primary"
                    sx={{ mb: 3, color: 'black' }}
                >
                    <Tab label="Summary" value="summary" />
                    <Tab label="History of order" value="historyOfOrders" />
                </Tabs>
                <Box sx={{ color: 'black' }}>
                    <FormControl sx={{ mt: 2, width: 400 }}>
                        <InputLabel id="demo-simple-select-label" sx={{ color: 'black' }}>Name</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // multiple
                            value={personName}
                            onChange={handleChange}
                            input={<OutlinedInput label="Name" />}
                            MenuProps={MenuProps}
                            sx={{ color: 'black', }}
                        >
                            {names.map((name) => (
                                <MenuItem
                                    key={name}
                                    value={name}
                                    style={getStyles(name, personName, muiTheme)}
                                >
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                {activeTab === "summary" &&
                    <Grid container spacing={2}>
                        {/* Column 1 */}
                        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", flexDirection: "column", minWidth: 200 }}>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500' }}>
                                Net Profit
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
                                4567
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500', mt: 5 }}>
                                Net Profit
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500' }}>
                                Net Profitsdf
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500' }}>
                                Net Profitsdf
                            </Typography>
                        </Grid>

                        {/* Column 2 */}
                        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", flexDirection: "column", minWidth: 200 }}>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500' }}>
                                Current Orders
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
                                7000
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500', mt: 5 }}>
                                Net Profit
                            </Typography>
                        </Grid>

                        {/* Column 3 */}
                        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", flexDirection: "column", minWidth: 200 }}>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500' }}>
                                Trading Value
                            </Typography>
                            <Typography variant="h5" sx={{ color: 'black', fontWeight: 'bold' }}>
                                2345
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500', mt: 5 }}>
                                Net Profit
                            </Typography>
                        </Grid>

                        {/* Column 4 */}
                        <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", flexDirection: "column", minWidth: 200 }}>
                            <Typography variant="subtitle2" sx={{ color: 'grey.500' }}>
                                Equity
                            </Typography>
                            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>
                                56
                            </Typography>
                            <Typography variant="body2">
                                Net Profitg
                            </Typography>
                        </Grid>
                    </Grid>}

               <Box className="ag-theme-quartz" sx={{ height: 400, width: "100%", mt: 2 }}>
                    <AgGridReact
                        className="ag-theme-quartz"
                        rowData={rowData}
                        columnDefs={colDefs}
                        defaultColDef={{ flex: 1 }}
                        theme={themeQuartz.withParams({
                            backgroundColor: muiTheme.palette.background.default,
                            foregroundColor: "#1f2937",
                            headerBackgroundColor: "#1f2937",
                            headerTextColor: "#d1d5db",
                            borderColor: "#334155",
                            rowHoverColor: "#374151",
                            selectedRowBackgroundColor: "#1e293b",
                            borderRadius: 0,
                            wrapperBorderRadius: 0,
                        })}
                    />
                </Box>

            </Container>
        </>
    );
};

export default Summary;
