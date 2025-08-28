
// 'use client';
import React, { StrictMode, useState, useEffect, useMemo, useRef } from "react";
import { AllCommunityModule, ModuleRegistry, themeQuartz } from "ag-grid-community";
import { Autocomplete, Button, CircularProgress, Input, TextField, useTheme } from "@mui/material"
import { AgGridReact } from "ag-grid-react";
import { CLOSED_ORDER_API, OPEN_POSITION_API, PENDING_ORDER_API, DELETE_OPEN_ORDER, DELETE_PENDING_ORDER } from "../../API/ApiServices"
import "./PositionsTable.css" // import your CSS here
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditIcon from '@mui/icons-material/Edit';
import PositionDialog from "./PositionDailog";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOpenPositions,
  fetchPendingOrders,
  fetchClosedOrders,
} from "../../redux/positionSlice";


ModuleRegistry.registerModules([AllCommunityModule]);

export default function PositionsTable({ socket, sendMessage }) {
  const dispatch = useDispatch();
//  const { open, pending, closed, loading, error } = useSelector(
//    (state) => state.positions
//  );
  const gridRef = useRef(null)
  const muiTheme = useTheme()
  const [activeTab, setActiveTab] = useState("pending")
  const [open, setOpen] = useState(false);

  const [editData, setEditData] = useState({})
  const [positions, setPositions] = useState({
    open: [],
    pending: [],
    closed: [],
  });
  const [rowData, setRowData] = useState([]);

  const isLoggedIn = useSelector(state => state.auth)
  const demo_id = isLoggedIn.data.client_MT5_id.demo_id

  const scrollContainerRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

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
    const socketInstance = socket.current;
    if (!socketInstance) return;

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!gridRef.current || !gridRef.current.api) return;
        const api = gridRef.current.api;
        // console.log({ socketdata: data })
        if (data.event !== "ticks"  ) return
        if (data.data.symbol) {
          // Get the existing row by ID
          // const rowNode = api.getRowNode(data.data.symbol);
          api.forEachNode((rowNode) => {
            if (rowNode.data.symbol === data.data.symbol) {

              const type = rowNode.data.type;
              let currentPrice;
              if (type.includes("Buy") || type === "Buy") {
                currentPrice = data.data.ask;
              } else if (type.includes("Sell") || type === "Sell") {
                currentPrice = data.data.bid;
              }
              // else {
              //   if(activeTab !== "open") currentPrice = data.data.bid; // default fallback
              // }

              rowNode.setDataValue("current_price", currentPrice);
              // console.log("rowNode",rowNode.data)
              if (activeTab == "open") {
                const openPrice = parseFloat(rowNode.data.open_price);
                const volume = parseFloat(rowNode.data.volume);
                const contractSize = parseFloat(rowNode.data.contractSize);
  
                // const signedVolume = type === "sell" ? volume * -1 : volume;
                const signedVolume = type === "Sell" ? -volume : volume;
  
                const profit = (currentPrice - openPrice) * signedVolume * contractSize;
                // console.log({openPrice,volume,contractSize,signedVolume,profit})
                if (rowNode.data.symbol == "USDJPY") {
                  rowNode.setDataValue("profit", profit / currentPrice);
                } else {
                  rowNode.setDataValue("profit", profit);
                }
              }
            } else {
              console.log("row does not exist")
            }
          })

          // console.log({selectedSymbolRef:selectedSymbolRef.current,data:data.data})

        }
      } catch (err) {
        console.error("Invalid WS message:", event.data, err);
      }
    };

    socketInstance?.addEventListener("message", handleMessage);

    return () => {
      socketInstance?.removeEventListener("message", handleMessage);
    };
  }, [socket.current, activeTab]);

  useEffect(() => {
    getPositions(demo_id)
  }, [demo_id, activeTab])

  useEffect(() => {
    setRowData(positions[activeTab] || []);
  }, [positions, activeTab]);

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
    if (typeof type === "number") return ORDER_TYPE_CONSTANT[type] || "Unknown";
    if (typeof type === "string") return type;
    return "Unknown";
  };

  function formatPrice(price) {
    return String(price).length > 6 ? String(price).slice(0, 7) : String(price);
  }

  const DeleteButtonRenderer = (props) => {
    const onDelete = async () => {
      if (activeTab === "open") {
        const payload = {
          "event": "close-position",
          "data": {
            "position_id": props.data.positionId
          }
        }
        const res = await DELETE_OPEN_ORDER(payload)
        if (res.status === 200) {
          getPositions(demo_id);
        }

      }
      else if (activeTab === 'pending') {
        const payload = {
          "event": "delete-pending-order",
          "data": {
            "order_id": props.data.order_id
          }
        }
        const response = await DELETE_PENDING_ORDER(payload);
        if (response.status === 200) {
          getPositions(demo_id);
        }
      }

    };

    const onEdit = () => {
      console.log(props.data)
      setOpen(true)
      setEditData(props.data)
    }

    return (
      <>
        <button onClick={onEdit} className="text-slate-500 cursor-pointer">
          <EditIcon />
        </button>

        <button onClick={onDelete} className="text-red-500 cursor-pointer">
          <DeleteRoundedIcon />
        </button>

      </>
    );
  };

  const defaultColDef = useMemo(() => ({ flex: 1 }), []);
  const colDefs = useMemo(() => {
    const baseCols = [
      { field: "symbol", headerName: "Symbol" },
      {
        headerName: "Type",
        field: "type",
        maxWidth: 120,
        cellRenderer: TypeRenderer,
        valueGetter: (params) => params.data.type ?? "-",
      },
      { field: "volume", headerName: "Volume", maxWidth: 120, },
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
      {
        headerName: "Current Price",
        field: "current_price",
        valueGetter: (params) => {
          const value =
            params.data.current_price ??
            params.data.closePrice;
          return value != null ? formatPrice(value) : "-";
        },
      },
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
      },

    ];

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
        cellRenderer: DeleteButtonRenderer,
        sortable: false,
        filter: false,
      })
    }

    return baseCols;
  }, [activeTab]);


  const getTabCount = (status) => {
    // console.log("tab status", status)
    return positions[status]?.length || 0;
  }

  const getPositions = async (demo_id) => {
    if (!demo_id) return;
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    const from = new Date(now.getTime() - oneDay).toISOString();
    const to = new Date(now.getTime() + oneDay).toISOString();
    const data =
    {
      "event": "get-deals",
      "data": {
        from: from,
        to: to,
        client_id: demo_id
      }
    }

    try {
      const [openRes, pendingRes, closedRes] = await Promise.all([
        OPEN_POSITION_API(demo_id),
        PENDING_ORDER_API(demo_id),
        CLOSED_ORDER_API(data)
      ]);

      setPositions({
        open: openRes?.data?.result || [],
        pending: pendingRes?.data?.result || [],
        closed: closedRes?.data?.result || []
      });
    } catch (error) {
      console.error(`Error fetching ${activeTab} positions`, error);
    }
  }

  return (
    <>
      <PositionDialog onOpen={open} onClose={setOpen} editData={editData} setEditData={setEditData} activeTab={activeTab} getPositions={getPositions} />
      <div
        className="h-full border-slate-700 overflow-hidden relative scroll-dark"
        ref={scrollContainerRef}
      >
        <div
          className={`tabs-bar sticky top-0 z-10 transition-colors duration-300 ${scrolled ? "bg-black text-white shadow-md" : "bg-transparent"
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
            rowData={rowData}
            getRowId={(params) => `${params.data.positionId || params.data.order_id || params.data.ticket}`}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
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


