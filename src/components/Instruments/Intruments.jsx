import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react"
import { AgGridReact } from "ag-grid-react"
import { ModuleRegistry, themeQuartz } from "ag-grid-community"
import { AllCommunityModule } from "ag-grid-community"
import SearchIcon from "@mui/icons-material/Search"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import CloseIcon from "@mui/icons-material/Close"

import { Autocomplete, Button, CircularProgress, Input, TextField, Tooltip, useTheme } from "@mui/material"
import { GET_SELECTED_SYMBOLS_API, GET_SYMBOL_API, POST_SELECTED_SYMBOLS_API } from "../../API/ApiServices"
// import { useWebSocket } from "../../customHooks/useWebsocket"
import { selectedSymbolAction, updateTicksAction } from "../../redux/tradePositionSlice"
import { useDispatch, useSelector } from "react-redux"
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
// const socketUrl = import.meta.env.VITE_REACT_WS_BRODCASTER_URL
ModuleRegistry.registerModules([AllCommunityModule])

// Custom cell renderers
const DragHandleRenderer = () => (
  <div className="flex items-center justify-center text-slate-400 cursor-grab">
    <div className="flex gap-0.5">
      <div className="flex flex-col gap-0.5">
        <div className="w-1 h-1 bg-current rounded-full"></div>
        <div className="w-1 h-1 bg-current rounded-full"></div>
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="w-1 h-1 bg-current rounded-full"></div>
        <div className="w-1 h-1 bg-current rounded-full"></div>
      </div>
    </div>
  </div>
)

const SymbolRenderer = ({ data }) => (
  <div className="flex items-center ">
    {/* <span className="text-lg">{data.icon}</span> */}
    <span className="font-medium text-white">{data.symbol}</span>
  </div>
)

const SignalRenderer = ({ data }) => {
  const isUp = data.signal === "up";
  const isDown = data.signal === "down";

  const arrowColor = isUp
    ? "text-green-500"
    : isDown
    ? "text-red-500"
    : "text-gray-400";

  const arrowIcon = isUp ? "▲" : isDown ? "▼" : "–";
  const tooltipText = isUp ? "Buy Signal" : isDown ? "Sell Signal" : "No Signal";

  return (
    <Tooltip title={tooltipText} arrow>
      <div className="flex items-center justify-center w-full h-full">
        <span
          className={`text-xl font-bold ${arrowColor} ${
            isUp || isDown ? "animate-bounce" : ""
          }`}
        >
          {arrowIcon}
        </span>
      </div>
    </Tooltip>
  );
};



const PriceRenderer = ({ value, data, colDef }) => {
  const isAsk = colDef.field === "ask"
  const change = isAsk ? data.askChange : data.bidChange

  const getClasses = () => {
    if (change === undefined) return "text-white"
    if (change > 0) return "bg-green-500/20 text-green-400"
    if (change < 0) return "bg-red-500/20 text-red-400"
    return "text-white"
  }

  return (
    <div
      className={` rounded text-sm font-mono ${getClasses()}`}
    >
      {value.toFixed(value < 10 ? 5 : 2)}
    </div>
  )
}

 function InstrumentsPanel({ onSymbolSelect,socket,sendMessage}) {
  const gridRef = useRef(null)
  const muiTheme = useTheme()
  const selectedSymbolRef = useRef(null);
  const dispatch = useDispatch()
 
  // const { socket,sendMessage, closeSocket } = useWebSocket(socketUrl);
  const [instruments, setInstruments] = useState([])
const [allSymbols, setAllSymbols] = useState([])
const [selectedSymbols, setSelectedSymbols] = useState([])
const [posting, setPosting] = useState(false)

const DeleteButtonRenderer = (props) => {
  const { data, api, context } = props;
  const { instruments, setInstruments } = context; // 👈 grab state + setter from context

  const onDelete = async (e) => {
    e.stopPropagation();

    // Remove row from AG Grid
    api.applyTransaction({ remove: [data] });

    const allSymbols = [];
    api.forEachNode((node) => allSymbols.push(node.data));

    // Update state so other components stay in sync
    setInstruments(allSymbols);
    try {
      await POST_SELECTED_SYMBOLS_API({
        event: "create",
        data: { symbols: allSymbols.map((i) => i.symbol) },
      });
    } catch (err) {
      console.error("Delete failed", err);

      // rollback state + grid if API fails
      api.applyTransaction({ add: [data] });

      const rollbackSymbols = [];
      api.forEachNode((node) => rollbackSymbols.push(node.data));
      setInstruments(rollbackSymbols);
    }
  };

  return (
    <button onClick={onDelete} type="button">
      <DeleteRoundedIcon
        fontSize="small"
        className="text-red-500 cursor-pointer"
      />
    </button>
  );
};
  const columnDefs = useMemo(() =>[
    // {
    //   field: "drag",
    //   headerName: "",
    //   width: 40,
    //   cellRenderer: DragHandleRenderer,
    //   sortable: false,
    //   filter: false,
    //   resizable: false,
    //   suppressMenu: true,
    // },
    {
      field: "symbol",
      headerName: "Symbol",
      flex: 1,
      cellRenderer: SymbolRenderer,
      minWidth: 80,
      resizable: true,
    //   suppressMenu: true,
    },
    {
      field: "signal",
      headerName: "Signal",
      minWidth: 30,
      cellRenderer: SignalRenderer,
      sortable: false,
      suppressMenu: true,
      
      resizable: true,
    },
    
    {
      field: "bid",
      headerName: "Bid",
      minWidth: 80,
      cellRenderer: PriceRenderer,
      type: "numericColumn",
      suppressMenu: true,
      resizable: true,
    },
    {
      field: "ask",
      headerName: "Ask",
      minWidth: 80,
      cellRenderer: PriceRenderer,
      type: "numericColumn",
      suppressMenu: true,
      resizable: true,
    },
    {
      field: "delete",
      headerName: "Delete",
      cellRenderer: DeleteButtonRenderer,
      sortable: false,
      resizable: false,
      suppressMenu: true
    },
  ], []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!gridRef.current || !gridRef.current.api) return;
  //     const api = gridRef.current.api;
  
  //     // Simulate "socket" data for random symbols
  //     const updates = [];
  
  //     // Pick 1-3 random symbols to update
  //     const symbolsToUpdate = instruments
  //       .sort(() => Math.random() - 0.5) // shuffle
  //       .slice(0, Math.floor(Math.random() * 3) + 1);
  
  //     symbolsToUpdate.forEach((instrument) => {
  //       const bidChange = (Math.random() - 0.5) * (instrument.bid * 0.001);
  //       const askChange = (Math.random() - 0.5) * (instrument.ask * 0.001);
  
  //       updates.push({
  //         ...instrument,
  //         bid: Math.max(0, instrument.bid + bidChange),
  //         ask: Math.max(0, instrument.ask + askChange),
  //         bidChange,
  //         askChange,
  //       });
  //     });
  
  //     // Update only the changed rows in AG Grid
  //     api.applyTransaction({ update: updates });
  
  //     // Clear change indicators after 1 second
  //     setTimeout(() => {
  //       const clearedUpdates = updates.map((instrument) => ({
  //         ...instrument,
  //         bidChange: undefined,
  //         askChange: undefined,
  //       }));
  //       api.applyTransaction({ update: clearedUpdates });
  //     }, 1000);
  //   }, 3000);
  
  //   return () => clearInterval(interval);
  // }, [instruments]);
  
  useEffect(() => {
    const socketInstance = socket.current;
  if (!socketInstance) return;

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!gridRef.current || !gridRef.current.api) return;
            const api = gridRef.current.api;
            // console.log({socketdata:data})
            if(data.event !== "ticks") return
            if (data.data.symbol) {
              // Get the existing row by ID
              const rowNode = api.getRowNode(data.data.symbol);
              if (rowNode) {
                const prevBid = rowNode.data.bid; 
                const newBid = data.data.bid
                let signal = "neutral";
                if (prevBid) {
                   if (newBid > prevBid) signal = "up";
                   else if (newBid < prevBid) signal = "down"; }
                rowNode.setDataValue("bid", data.data.bid);
                rowNode.setDataValue("ask", data.data.ask);
                rowNode.setDataValue("signal", signal);
              }else{
                console.log("row does not exist")
              }

              // console.log({selectedSymbolRef:selectedSymbolRef.current,data:data.data})
              if(data.data.symbol == selectedSymbolRef.current){
                dispatch(updateTicksAction(data.data))
              }
            }
      } catch (err) {
        console.error("Invalid WS message:", event.data ,err);
      }
    };

    socketInstance?.addEventListener("message", handleMessage);

    return () => {
      socketInstance?.removeEventListener("message", handleMessage);
    };
  }, [socket.current]);

  
  // const filteredInstruments = useMemo(() => {
  //   return instruments.filter((instrument) =>
  //     instrument.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }, [instruments, searchTerm]);

  // useEffect(() => {
  //   if (!gridRef.current || !gridRef.current.api || !selectedSymbol) return;
  
  //   const api = gridRef.current.api;
  
  //   api.deselectAll();
  
  //   let selectedRowIndex = -1;
  
  //   api.forEachNode((node) => {
  //     if (node.data.symbol === selectedSymbol) {
  //       node.setSelected(true);
  //       selectedRowIndex = node.rowIndex; // remember the index
  //     }
  //   });
  
  //   // Scroll to selected row (Community edition)
  //   if (selectedRowIndex >= 0) {
  //     api.ensureIndexVisible(selectedRowIndex, "middle"); // scrolls row into view
  //   }
  // }, [selectedSymbol, filteredInstruments]);

  const onRowClicked = useCallback(
    (event) => {if (
      event.event?.target?.closest("button") &&
      event.event.target.innerText.toLowerCase().includes("delete")
    ) {
      return;
    }
      const symbol = event.data.symbol
      selectedSymbolRef.current=symbol
      dispatch(selectedSymbolAction(symbol))
      onSymbolSelect?.(symbol)
    },
    [onSymbolSelect]
  )

  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit()
  }, [])

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual API endpoint
    const fetchSymbols = async () => {
      try {
        const res = await GET_SYMBOL_API(); // or your endpoint
        console.log(res)
        const symbolsArray=  res.data.result?.data || []; // expect: ["BTC", "ETH", "XAU/USD", ...]

        setAllSymbols(symbolsArray)
       
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch symbols:", error);
        setLoading(false);
      }
    };

    fetchSymbols();
  }, []);
  useEffect(() => {
    const fetchSelected = async () => {
      setLoading(true)
      try {
        const res = await GET_SELECTED_SYMBOLS_API() // returns array of symbols
        const selected = res.data.result || []
console.log({selected})
        // setSelectedSymbols(selected.map(item => item.instrument))
        
        const initialInstruments = selected.map((symbolObj, index) => ({
          id: (index + 1).toString(),
          symbol:symbolObj.instrument,
          signal: "neutral",
          bid:symbolObj.bid,
          ask: symbolObj.ask,
        }))
        console.log({initialInstruments})
        setInstruments(initialInstruments)
      } catch (err) {
        console.error("Failed to fetch selected symbols", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSelected()
  }, [])
 
  useEffect(() => {
    const socketInstance = socket.current;
    if (!socketInstance || instruments.length === 0) return;
  
    if (socketInstance.readyState === WebSocket.OPEN) {
      sendMessage({
        event: "subscribe",
        stream: "ticks",
        symbols: instruments.map(item => item.symbol),
      });
    } else {
      // wait for socket to open
      const handleOpen = () => {
        sendMessage({
          event: "subscribe",
          stream: "ticks",
          symbols: instruments.map(item => item.symbol),
        });
        socketInstance.removeEventListener("open", handleOpen);
      };
      socketInstance.addEventListener("open", handleOpen);
    }
  }, [socket.current, instruments]);
  
  const handleSubmit = async () => {
    setPosting(true)
    try {

      let prevSymbols = instruments?.map(item=>item.symbol)
        let payload = {
            "event":"create",
            "data":{
                    "symbols": [...selectedSymbols,...prevSymbols]
                }
        }

      let response = await POST_SELECTED_SYMBOLS_API(payload) // send array
      // Update instruments table based on selection
      const selectedInstruments = response.data.result.instruments || []
      const newInstruments = selectedInstruments.map((symbolObj, index) => {
        return  {
          id: (index + 1).toString(),
          symbol:symbolObj.instrument,
          signal: "neutral",
          bid: symbolObj.bid,
          ask: symbolObj.ask,
        }
      })
      setInstruments(newInstruments)
      setSelectedSymbols([])
    } catch (err) {
      console.error("Failed to save selected symbols", err)
    } finally {
      setPosting(false)
    }
  }

  if (loading) return <CircularProgress />;
  return (
    <div className="w-full h-full flex flex-col border-r border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h2 className="text-sm font-medium text-slate-300 tracking-wide">
          INSTRUMENTS
        </h2>
        
      </div>

      {/* Search */}
      {/* <div className="p-4 border-b border-slate-700">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-600 text-white placeholder:text-slate-400 focus:border-slate-500 focus:ring-slate-500"
          />
        </div>
      </div> */}

      <div className="mb-2 flex gap-2 items-center">
        <Autocomplete
          multiple
          options={allSymbols}
          value={selectedSymbols}
          onChange={(e, val) => setSelectedSymbols(val)}
          renderInput={(params) => <TextField {...params} label="Select Symbols" />}
          className="flex-1"
        />
        <Button variant="outlined" onClick={handleSubmit} disabled={posting}>
          {posting ? "Saving..." : "Submit"}
        </Button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full w-full ag-theme-quartz">
          <AgGridReact
            ref={gridRef}
            rowData={instruments}
            getRowId={(params) => params.data.symbol}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            onRowClicked={onRowClicked}
            rowSelection="single"
            context={{ instruments, setInstruments }}
            frameworkComponents={{ deleteButtonRenderer: DeleteButtonRenderer }}
            theme={themeQuartz.withParams({
                backgroundColor: muiTheme.palette.background.default,      // bg-slate-900
                foregroundColor: "#e2e8f0",      // text-slate-200
                headerBackgroundColor: "#1e293b",// bg-slate-800
                headerTextColor: "#94a3b8",      // text-slate-400
                borderColor: "#334155",          // border-slate-700
                rowHoverColor: "#1e293b",        // hover:bg-slate-800
                selectedRowBackgroundColor: "#1e293b", // bg-slate-700
                spacing: 2
              })}
            suppressRowClickSelection={false}
            headerHeight={35}
            rowHeight={30}
            animateRows={true}
            suppressRowHoverHighlight={false}
            suppressMenuHide={true}
            suppressContextMenu={true}
          />
        </div>
      </div>
    </div>
  )
}

export default memo(InstrumentsPanel)
