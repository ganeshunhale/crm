import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Chip, Container, Grid, Tab, Tabs, TablePagination } from '@mui/material';
import {
    fetchOpenPositions,
    fetchClosedOrders,
} from "../../../redux/positionSlice";
import { useDispatch, useSelector } from 'react-redux';
import { ORDER_TYPE_CONSTANT } from '../../../contants';
import { formatPrice } from '../../../utils/formatePrice';
import TableSkeleton from '../../../components/Skelton/TableSkelton';

function Row(props) {
    const { row, selectedTab } = props;
    const [open, setOpen] = useState(false);

    const getReadableType = (type) => {
        if (row?.closePrice) type === 0 ? type = 1 : type = 0
        if (typeof type === "number") return ORDER_TYPE_CONSTANT[type] || "Unknown";
        if (typeof type === "string") return type;
        return "Unknown";
    };
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell component="th" scope="row">
                    {row.symbol}
                </TableCell>
                <TableCell align="right">

                    <Chip
                        label={getReadableType(row.type)}
                        size="small"
                        sx={{
                            backgroundColor:
                                getReadableType(row.type) === 'Buy' ? '#dde7f1ff' : // blue
                                    getReadableType(row.type) === 'Sell' ? '#fadcdcff' : // red
                                        'default',
                            color:
                                getReadableType(row.type) === 'Buy' ? '#469aefff' : // blue
                                    getReadableType(row.type) === 'Sell' ? '#f07777ff' : // red
                                        'default',
                        }}
                    />
                </TableCell>
                <TableCell align="right">{row.volume}</TableCell>
                <TableCell align="right">{formatPrice(row.open_price || row.openPrice)}</TableCell>
                <TableCell align="right">{formatPrice(row.current_price || row.closePrice)}</TableCell>
                <TableCell align="right">{row.tp?.toFixed(2)}</TableCell>
                <TableCell align="right">{row.sl?.toFixed(2)}</TableCell>
                <TableCell align="right">{row.positionId || row.ticket}</TableCell>
                <TableCell align="right">{row.posTime || row.time}</TableCell>
                <TableCell align="right" sx={{
                    color:
                        row.profit > 0
                            ? 'success.main'
                            : row.profit < 0
                                ? 'error.main'
                                : 'text.primary'
                }}>
                    {row.profit?.toFixed(2)}
                </TableCell>
                {selectedTab === 'ClosedOrder' && <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>}
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="body2" gutterBottom component="div">
                                Position ID  :{row.positionId || row.ticket}
                            </Typography>
                            <Typography variant="body2" gutterBottom component="div">
                                Closed by :User
                            </Typography>
                            <Typography variant="body2" gutterBottom component="div">
                                Commision USD : {row.commission}
                            </Typography>
                            <Typography variant="body2" gutterBottom component="div">
                                Swap USD : {row.swap}
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        calories: PropTypes.number.isRequired,
        carbs: PropTypes.number.isRequired,
        fat: PropTypes.number.isRequired,
        history: PropTypes.arrayOf(
            PropTypes.shape({
                amount: PropTypes.number.isRequired,
                customerId: PropTypes.string.isRequired,
                date: PropTypes.string.isRequired,
            }),
        ).isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        protein: PropTypes.number.isRequired,
    }).isRequired,
};

export default function OrderHistoryTable({ accountId, setHistoryType, formateDate }) {
    const dispatch = useDispatch()
    const [selectedTab, setSelectedTab] = useState("ClosedOrder");
    const [positions, setPositions] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const { open, closed, pagination,loading, error } = useSelector(
        (state) => state.positions
    );
    console.log("pagination", closed,pagination)

    // ✅ Tab config
    const tabConfig = {
        ClosedOrder: { label: "Closed Order", },
        OpenOrder: { label: "Open Order", }
    }

    useEffect(() => {
        try {
            if (selectedTab === 'ClosedOrder') {
                const { from, to } = formateDate
                const payload = { event: "get-deals", data: { from, to, client_id: accountId } };
                const query = {
                    page : page +1 ,
                    pageSize : rowsPerPage
                }
                console.log("query",query)
                dispatch(fetchClosedOrders({data: payload,query}));
            } else {
                dispatch(fetchOpenPositions(accountId))
            }
        }
        catch (error) {
            console.log(error)
        }
    }, [selectedTab, accountId, formateDate,rowsPerPage,page])

    useEffect(() => {
        setHistoryType(selectedTab)
        if (selectedTab === 'ClosedOrder') {
            setPositions(closed);
        } else {
            setPositions(open);
        }
    }, [closed, open, selectedTab]);


    return (
        <Container>
            <Grid container mt={2}  >
                <Tabs
                    value={selectedTab}
                    variant="fullWidth"
                    onChange={(_, val) => {
                        setSelectedTab(val);

                        if (val === "ClosedOrder") {
                            setPositions(closed)
                        } else {

                            setPositions(open)
                        }
                    }}
                    sx={{
                        minHeight: 30,
                        borderRadius: "8px",
                        width: 250,
                        border: "1px solid rgba(0, 0, 0, 0.12)",
                        backgroundColor: "#f9f9f9",
                        padding: 0.5,
                        mb:2,

                        // Remove underline indicator
                        '.MuiTabs-indicator': {
                            display: 'none',
                        },

                        // Tab root style
                        '.MuiTab-root': {
                            minHeight: 30,
                            padding: '6px 12px',
                            borderRadius: '6px',
                            color: 'black',
                            textTransform: 'none',
                            fontWeight: 500,
                        },

                        // Style for selected tab
                        '.Mui-selected': {
                            backgroundColor: 'rgba(0, 0, 0, 0.12)',
                        },
                    }}
                >
                    {Object.entries(tabConfig).map(([key, config]) => (
                        <Tab key={key} value={key} label={config.label} />
                    ))}
                </Tabs>

                <TableContainer >
                    {loading ? <TableSkeleton/> : positions?.length > 0 ? <Box><Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Symbol</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Volume</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Open Price</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{selectedTab === 'ClosedOrder' ? "Closed Price" : "Current Price"}</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>T/P</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>S/L</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Position</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Open Time</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Profit, USD</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {positions?.map((row, index) => (
                                <Row key={index} row={row} selectedTab={selectedTab} />
                            ))}

                        </TableBody>


                    </Table>  </Box> :
                        <Box
                            sx={{
                                mt: 2,
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
                                You don't have a data
                            </Typography>

                        </Box>}
                        {(positions?.length > 0 && selectedTab === 'ClosedOrder') && <TablePagination
                            component="div"
                            count={pagination.total_count || 0}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage || 0}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />}
                </TableContainer>
            </Grid>
        </Container>
    );
}
