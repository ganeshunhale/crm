
// 'use client';
import React, { StrictMode, useState, useEffect, useMemo, useRef } from "react";
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";
import { Autocomplete, Button, CircularProgress, Input, TextField, Tooltip, useTheme } from "@mui/material"
import { AgGridReact } from "ag-grid-react";
import { OPEN_POSITION_API, DELETE_OPEN_ORDER, DELETE_PENDING_ORDER } from "../../API/ApiServices"
import "./PositionsTable.css" // import your CSS here
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
import PositionDialog from "./PositionDailog";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOpenPositions,
  fetchPendingOrders,
  fetchClosedOrders,
  deleteOpenPosition,
  addOpenPosition,
} from "../../redux/positionSlice";
import { updateMandetorySymbols } from "../../redux/tradePositionSlice";
import { showSnackbar } from "../../redux/snackbarslice";


ModuleRegistry.registerModules([AllCommunityModule]);

const mapSocketToRow = (data) => {
  return {
    symbol: data.Symbol,
    type: data.Action === "buy" ? "Buy" : "Sell",
    volume: data.Volume,
    open_price: data.OpenPrice,
    current_price: data.CurrentPrice,
    tp: data.TP ?? 0,   // default 0 if not provided
    sl: data.SL ?? 0,   // default 0 if not provided
    positionId: data.Position,
    posTime: data.Time ?? "-",   // socket may not send time
    contractSize: data.ContractSize ?? 100,
    profit: data.Profit ?? 0,
  };
};
export default function PositionsTable({ ticksSocket, broadCasterSocket }) {
  const dispatch = useDispatch();
  const { open: openPositions, pending, closed, loading, error } = useSelector(
    (state) => state.positions
  );
  const gridRef = useRef(null)
  const muiTheme = useTheme()
  const [activeTab, setActiveTab] = useState("pending")
  const [open, setOpen] = useState(false);

  const [editData, setEditData] = useState({})
  const isLoggedIn = useSelector(state => state.auth)
  const demo_id = isLoggedIn.data.client_MT5_id.demo_id

  const scrollContainerRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [deletingRows, setDeletingRows] = useState({});

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return; // prevent error
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setScrolled(scrollContainerRef.current.scrollTop > 0);
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);



  useEffect(() => {
    const socketInstance = ticksSocket.current;
    if (!socketInstance) return;

    const buyTypes = new Set([0, 2, 4, 6]);
    const sellTypes = new Set([1, 3, 5, 7]);
    const specialSymbols = new Set([
      "USDCAD", "USDCHF", "USDJPY", "AUDCAD", "EURGBP", "EURJPY",
      "GBPAUD", "GBPCHF", "GBPJPY", "AUDCHF", "AUDJPY", "AUDNZD",
      "CADCHF", "CADJPY", "CHFJPY", "EURAUD", "EURCAD", "EURCHF",
      "EURNZD", "GBPCAD", "GBPNZD", "NZDCAD", "NZDCHF", "NZDJPY",
      "USDHKD"
    ]);
    const handleMessage = (event) => {
      try {
        if (!event.data || activeTab === "closed" || !gridRef.current || !gridRef.current.api) return;
        const data = JSON.parse(event.data);
        const api = gridRef.current.api;

        if (data.event !== "ticks" || !data.data?.symbol) return;

        api.forEachNode((rowNode) => {
          if (rowNode.data.symbol === data.data.symbol) {
            const type = rowNode.data.type;
            let currentPrice;

            if (type === "Buy" || buyTypes.has(type)) {
              currentPrice = data.data.bid;
            } else if (type === "Sell" || sellTypes.has(type)) {
              currentPrice = data.data.ask;
            }

            // build updated row object
            let updatedRow = { ...rowNode.data, current_price: currentPrice };

            if (activeTab === "open") {
              const openPrice = parseFloat(rowNode.data.open_price);
              const volume = parseFloat(rowNode.data.volume);
              const contractSize = parseFloat(rowNode.data.contractSize);

              const signedVolume = type === "Sell" ? -volume : volume;
              // let profit = (currentPrice - openPrice) * signedVolume * contractSize;
              let profit = ((currentPrice - openPrice) * signedVolume) * contractSize;

              if (specialSymbols.has(rowNode.data.symbol)) {
                profit = profit / currentPrice;
              }

              updatedRow = { ...updatedRow, profit };
            }

            // apply immutable update
            api.applyTransaction({ update: [updatedRow] });
          }
        });
      } catch (err) {
        console.error("Invalid WS message:", event.data, err);
      }
    };

    socketInstance.addEventListener("message", handleMessage);
    return () => {
      socketInstance.removeEventListener("message", handleMessage);
    };
  }, [ticksSocket.current, activeTab]);
  // Listen for Redux state changes to update the grid
  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api || activeTab !== "open") return;

    // Update the grid when Redux state changes
    api.setGridOption('rowData', openPositions);
  }, [openPositions, activeTab]);


  const TypeRenderer = (params) => {
    const data = getReadableType(params.value) // or params.data.type depending on your setup

    const getTypeColor = () => {
      switch (data) {
        case "Sell":
          return " text-white bg-[#EB483F]";
        case "Buy":
          return "bg-[#158BF9] text-white";
        case "Sell_limit":
          return " text-white bg-[#EB483F]";
        case "Buy_limit":
          return "bg-[#158BF9] text-white";
        default:
          return "bg-slate-500";
      }
    };

    return (
      <div className="mt-2 flex items-center gap-2 text-sm font-bold">
        {/* Dot */}
        <span
          className={`w-3 h-3 rounded-full ${getTypeColor()}`}
        ></span>

        {/* Text */}
        <span>{data}</span>
      </div>

    );
  };

  const PLRenderer = (params) => {
    const value = params.data.profit; // assume profit is a number like -20 or +30
    // console.log("profit loss value", value)

    const getTypeColor = () => {
      if (value > 0) return "text-green-500";
      if (value < 0) return "text-red-500";
      return "text-slate-500";
    };

    return (
      <div className={`font-bold ${getTypeColor()}`}>
        {value?.toFixed(2) ?? "-"}
      </div>
    );
  };

  const ORDER_TYPE_CONSTANT = {
    0: "Buy",
    1: "Sell",
    2: "Buy_limit",
    3: "Sell_limit",
    4: "Buy_stop",
    5: "Sell_stop",
    6: "Buy_stop_limit",
    7: "Sell_stop_limit",
    8: "Close_by"
  }

  const getReadableType = (type) => {
    if (activeTab === "closed") type === 0 ? type = 1 : type = 0 
    if (typeof type === "number") return ORDER_TYPE_CONSTANT[type] || "Unknown";
    if (typeof type === "string") return type;
    return "Unknown";
  };

  function formatPrice(price) {
    return String(price).length > 6 ? String(price).slice(0, 7) : String(price);
  }

  const DeleteButtonRenderer = (props) => {
    const {
      data,
      activeTab,
      demo_id,
      deletingRows,
      setDeletingRows,
      setEditData,
      setOpen,
    } = props;
    console.log("data in delete", data)

    const [loading, setLoading] = useState(false);
    const onDelete = async () => {
      setLoading(true);
      try {
        if (activeTab === "open") {
          const payload = {
            event: "close-position",
            data: { position_id: data.positionId },
          };
          const res = await DELETE_OPEN_ORDER(payload);
          if (res.status === 200) {
            dispatch(showSnackbar({ message: `Position closed  \n ${getReadableType(data.type)}  ${data.volume} lot ${data.symbol} at ${data.current_price}`, severity:  "success" }));
            dispatch(fetchOpenPositions(demo_id));
          }
        } else if (activeTab === "pending") {
          const payload = {
            event: "delete-pending-order",
            data: { order_id: data.order_id },
          };
          const res = await DELETE_PENDING_ORDER(payload);
          if (res.status === 200) {
            dispatch(showSnackbar({ message: `Pending Order deleted \n${getReadableType(data.type)} ${data.volume} lot ${data.symbol} at ${data.current_price}`, severity:  "success" }));
            dispatch(fetchPendingOrders(demo_id));
          }
        }

        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        const from = new Date(now.getTime() - oneDay).toISOString();
        const to = new Date(now.getTime() + oneDay).toISOString();
        const payload = { event: "get-deals", data: { from, to, client_id: demo_id } };
        dispatch(fetchClosedOrders(payload));
      } catch (err) {
        dispatch(showSnackbar({ message: `Error occured`, severity: "error" }));
      }
      finally {
        setTimeout(() => {
          setLoading(false);
        }, 100)

      }
    };


    const onEdit = () => {
      console.log(props.data)
      setOpen(true)
      setEditData(props.data)
    }

    return (
      <div className="flex gap-2 justify-center">
        <Tooltip title={`${activeTab === 'open' ? 'Modify Position' : 'Modify Order'}`}>
          <button onClick={onEdit} className="text-slate-500 cursor-pointer" >
            <EditIcon fontSize="small" />
          </button>
        </Tooltip>
        <Tooltip title="Close Position">

          <button onClick={onDelete} className="text-slate-500 cursor-pointer">
            {loading ? <CircularProgress size={16} /> : <HighlightOffIcon fontSize="small" />}
          </button>
        </Tooltip>
      </div>
    );
  };

  const defaultColDef = useMemo(() => ({ flex: 1 }), []);
  const colDefs = useMemo(() => {
    const baseCols = [
      { field: "symbol", headerName: "Symbol"},
      {
        headerName: "Type",
        field: "type",
        maxWidth: 120,
        cellRenderer: TypeRenderer,
        valueGetter: (params) => params.data.type ?? "-",
      },
      { field: "volume", headerName: "Volume", maxWidth: 120 },
      {
        headerName: "Open Price",
        field: "open_price",
        valueGetter: (params) => {
          const value =
            params.data.open_price ??
            params.data.openPrice ??
            params.data.order_price;
          return value != null ? formatPrice(value) : "-";
        },
      },
    ];

    // Show price column depending on tab
    if (activeTab === "closed") {
      baseCols.push({
        headerName: "Closed Price",
        field: "closed_price",
        valueGetter: (params) =>
          params.data.closed_price ??
          params.data.closePrice ??
          "-",
      });
    } else {
      baseCols.push({
        headerName: "Current Price",
        field: "current_price",
        valueGetter: (params) =>
          params.data.current_price ??
          "-",
      });
    }

    baseCols.push(
      { field: "tp", headerName: "T/P", maxWidth: 100 },
      { field: "sl", headerName: "S/L", maxWidth: 100 },
      {
        headerName: "Position",
        field: "positionid",
        valueGetter: (params) =>
          params.data.positionId ??
          params.data.order_id ??
          params.data.ticket ??
          "-",
      },
      {
        headerName: "Open Time",
        valueGetter: (params) =>
          params.data.posTime ??
          params.data.time ??
          "-",
      }
    );

    // Conditionally add profit column
    if (activeTab === "open" || activeTab === "closed") {
      baseCols.push({
        field: "profit",
        headerName: "P/L, USD",
        maxWidth: 120,
        cellRenderer: PLRenderer,
        valueGetter: (params) => params.data.profit ?? "-",
      });
    }

    if (activeTab === "open" || activeTab === "pending") {
      baseCols.push({
        headerName: "Actions",
        field: "delete",
        maxWidth: 80,
        sortable: false,
        filter: false,
        cellRenderer: DeleteButtonRenderer,
        cellRendererParams: {
          activeTab,
          demo_id,
          deletingRows,
          setDeletingRows,
          setEditData,
          setOpen
        }
      });
    }

    return baseCols;
  }, [activeTab]);




  useEffect(() => {
    if (!demo_id) return;
    dispatch(fetchOpenPositions(demo_id));
    dispatch(fetchPendingOrders(demo_id));

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const from = new Date(now.getTime() - oneDay).toISOString();
    const to = new Date(now.getTime() + oneDay).toISOString();
    const payload = { event: "get-deals", data: { from, to, client_id: demo_id } };
    dispatch(fetchClosedOrders(payload));

  }, [dispatch, demo_id, activeTab]);

  const rowData = {
    open: openPositions,
    pending: pending,
    closed: closed
  };
  useEffect(() => {
    const openSymbols = openPositions?.map((pos) => pos.symbol) || [];
    const pendingSymbols = pending?.map((pos) => pos.symbol) || [];

    const combined = [...openSymbols, ...pendingSymbols];
    if (combined.length > 0) {
      dispatch(updateMandetorySymbols(combined));
    }
  }, [openPositions, pending, dispatch]);

  const getTabCount = (status) => {
    // console.log("tab status", status, rowData[status]);
    return rowData[status]?.length || 0;
  };

  return (
    <>
      <PositionDialog onOpen={open} onClose={setOpen} editData={editData} setEditData={setEditData} activeTab={activeTab} />
      <div
        className="h-full border-slate-700 overflow-hidden relative scroll-dark"
        ref={scrollContainerRef}
      >
        <div
          className={`tabs-bar h-8 sticky top-0 z-10 transition-colors duration-300 ${scrolled ? "bg-black text-white shadow-md" : "bg-transparent"
            }`}
        >
          {([{ value: "pending", label: ' Pending Orders' }, { value: "open", label: 'Net Position' }, { value: "closed", label: " Trades" }]).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`tab-button ${activeTab === tab.value ? "active" : ""}`}
            >
              {tab.label}{" "}
              {getTabCount(tab.value) > 0 && (
                <span className="tab-count">{getTabCount(tab.value)}</span>
              )}
            </button>
          ))}
        </div>
        <div className="h-60 pt-1">
          <AgGridReact
            ref={gridRef}
            className="ag-theme-quartz"
            rowData={rowData[activeTab] || []}
            getRowId={(params) => `${params.data.positionId || params.data.order_id || params.data.ticket}`}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            headerHeight={30}
            // getRowId={(params) => params.data.positionNo.toString()}
            theme={themeQuartz.withParams({
              backgroundColor: muiTheme.palette.background.default,
              foregroundColor: "#e2e8f0",
              headerBackgroundColor: "#1f2937",
              headerTextColor: "#d1d5db",
              borderColor: "#334155",
              rowHoverColor: "#374151",
              selectedRowBackgroundColor: "#1e293b",
              borderRadius: 0,
              wrapperBorderRadius: 0,
            })}
          />
        </div>
      </div>
    </>
  );
};