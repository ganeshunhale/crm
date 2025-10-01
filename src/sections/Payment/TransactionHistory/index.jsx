import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Chip, Container, Grid, Menu, MenuItem, Tab, Tabs, Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionHistory } from '../../../redux/paymentSlice';
import FilterChip from './TransactionFilters';
import { DATES, STATUS, TRANSACTION_TYPE } from '../../../constants';
import { getDateRange } from '../../../utils/formateDate';
import TableSkelton from '../../../components/Skelton/TableSkelton';


function Row(props) {
    const { row } = props;

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell align="left">{row?.created_at_str.split('.')[0] || ''}</TableCell>
                <TableCell component="th" scope="row">
                    <Tooltip title={row.order_id} sx={{ p: 2 }}>
                        <div
                            style={{
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '230px',
                                userSelect: 'text' 
                            }}
                        >
                            {row.order_id}
                        </div>
                    </Tooltip>
                </TableCell>
                <TableCell align="left">
                    {row.transactionType}

                </TableCell>
                <TableCell align="left">

                    <Chip
                        label={row.orderStatus}
                        size="small"
                        sx={{
                            backgroundColor:
                                row.orderStatus === 'Success' ? "rgba(70,205,124,0.15)" : // blue
                                    row.orderStatus === 'Sell' ? '#fadcdcff' : // red
                                        'default',
                            color:
                                row.orderStatus === 'Success' ? '#46CD7C' : // blue
                                    row.orderStatus === 'Sell' ? '#f07777ff' : // red
                                        'default',
                        }}
                    />
                </TableCell>
                <TableCell align="left">
                    <Tooltip title={row?.platformOrderNo} p>
                        <div style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100px' // adjust as needed
                        }}>
                            {row?.platformOrderNo}
                        </div>
                    </Tooltip>

                </TableCell>
                <TableCell align="left">{row?.amount || 0}</TableCell>
                <TableCell align="center">{row?.fee || 0}</TableCell>
                <TableCell align="left">{row?.time?.split('.')[0] || ''}</TableCell>

            </TableRow>
            {/* <TableRow>
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
            </TableRow> */}
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

export default function TransactionHistoryTable() {
    const dispatch = useDispatch()
    const [filters, setFilters] = useState({
        sd: 1,
        ed: 1,
        transactionType: 'all',
        statusFilter: 'all',
    });
    const { transactionHistory, loading: transactionLoading, error: transactionError } = useSelector((state) => state.payments);

    const handleFilterChange = (key, value) => {
        if (key === 'Date') {
            const res = getDateRange(value)
            const updatedFilters = {
                ...filters,
                sd: res.from,
                ed: res.to,
            };
            setFilters(updatedFilters);
        }
        else if (key === "Transaction Type") {
            const updatedFilters = {
                ...filters,
                transactionType: value

            };
            setFilters(updatedFilters);
        } else {
            const updatedFilters = {
                ...filters,
                statusFilter: value

            };
            setFilters(updatedFilters);
        }
    };

    useEffect(() => {
        const res = getDateRange(1)
        const updatedFilters = {
            ...filters,
            sd: res.from,
            ed: res.to,
        };
        setFilters(updatedFilters);
    }, [])

    //TRANSACTION API CALLING
    useEffect(() => {
        try {
            if (filters.ed !== 1) {
                dispatch(fetchTransactionHistory(filters))
            }
        }
        catch (error) {
            console.log(error)
        }
    }, [filters])

    return (
        <Container>
            <Box sx={{
                width: "100%",
                py: 3,
            }}>
                <Typography variant="h5" sx={{ color: 'black', fontWeight: 'bold' }}>
                    Transaction history
                </Typography>
            </Box>
            <Grid container mt={2} gap={2} >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                    <FilterChip
                        label="Date"
                        options={DATES}
                        onChange={handleFilterChange}
                    />
                    <FilterChip
                        label="Transaction Type"
                        options={TRANSACTION_TYPE}
                        onChange={handleFilterChange}
                    />
                    <FilterChip
                        label="Status"
                        options={STATUS}
                        onChange={handleFilterChange}
                    />
                </Box>

                <TableContainer >
                    {transactionLoading ?  <TableSkelton /> : transactionHistory?.length > 0 ? <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left" sx={{ fontWeight: 'bold' }}>Order Time</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Order Id</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 'bold' }}>Platform No.</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 'bold' }}>Transaction Fee</TableCell>
                                <TableCell align="left" sx={{ fontWeight: 'bold' }}>Transaction Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactionHistory?.map((row, index) => (
                                <Row key={index} row={row} />
                            ))}
                        </TableBody>
                    </Table> :
                        <Box
                            sx={{
                                mt: 2,
                                height: '30vh',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',    
                                textAlign: 'center',
                                color: 'black',
                                backgroundColor: '#f9fafb', 
                                px: 2, 
                            }}
                        >
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                No transaction matches your filters
                            </Typography>
                        </Box>}
                </TableContainer>
            </Grid>
        </Container>
    );
}
