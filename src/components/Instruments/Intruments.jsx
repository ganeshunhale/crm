import { useState, useEffect, memo, useCallback, useMemo } from "react"
import {
  DndContext,
  closestCenter,
  DragOverlay,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

import {
  Autocomplete,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
} from "@mui/material"

import SortableInstrumentRow, { InstrumentRow } from "./InstrumentRow"

import {
  GET_INSTUMENT_FILTERS,
  GET_NEW_SELECTED_TYPES_SYMBOLS_API,
  GET_SELECTED_SYMBOLS_API,
  GET_SELECTED_TYPES_SYMBOLS_API,
  GET_SYMBOL_API,
  POST_SELECTED_SYMBOLS_API,
} from "../../API/ApiServices"
import {
  selectedSymbolAction,
  updateMarketWatchSymbols,
  updateTicksAction,
} from "../../redux/tradePositionSlice"
import { useDispatch, useSelector } from "react-redux"

// Consistent grid layout for header and rows
const GRID_LAYOUT = "120px 30px 1fr 1fr"

const formatSymbolList = (symbols) => {
  const res = symbols.map((s, i) => {console.log(s);return({
    
    id: `${i + 1}-${s.instrument}`, 
    symbol: s.instrument, signal: "neutral", 
    bid: s.bid, ask: s.ask,contractSize: s.contractSize, leverage: s.leverage,point: s.point

  })})
  console.log({symbols, res})
  return res
}


function InstrumentsPanel({ ticksSocket }) {
  const dispatch = useDispatch()

  const [instruments, setInstruments] = useState([])
  const [allSymbols, setAllSymbols] = useState([])
  const [selectedSymbols, setSelectedSymbols] = useState([])
  const [posting, setPosting] = useState(false)
  const [filterTypes, setFilterTypes] = useState([])
  const [selectedFilterType, setSelectedFilterType] = useState("Favorites")
  const [loading, setLoading] = useState(true)
  const [selectedSymbol, setSelectedSymbol] = useState(null)
  const [activeInstument, setActiveInstumetn] = useState(null)
  const activeId = useSelector(state => state.auth.activeId);
  const [isDragging, setIsDragging] = useState(false)
  // ---- WebSocket updates ----
  useEffect(() => {
    const socketInstance = ticksSocket.current
    if (!socketInstance) return

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.event !== "ticks") return

        // Don't update instruments during drag operations to prevent conflicts
        if (!isDragging) {
          setInstruments((prev) =>
            prev.map((item) => {
              if (item.symbol === data.data.symbol) {
                const prevBid = item.bid
                const newBid = data.data.bid
                let signal = "neutral"
                if (prevBid) {
                  if (newBid > prevBid) signal = "up"
                  else if (newBid < prevBid) signal = "down"
                }
                return { ...item, bid: newBid, ask: data.data.ask, signal }
              }
              return item
            })
          )
        }

        if (data.data.symbol === selectedSymbol) {
          console.log("data-symbol",data)
          dispatch(updateTicksAction(data.data))
        }
      } catch (err) {
        console.error("Invalid WS message:", event.data, err)
      }
    }

    socketInstance.addEventListener("message", handleMessage)
    return () => socketInstance.removeEventListener("message", handleMessage)
  }, [ticksSocket, dispatch, selectedSymbol, isDragging])

  // ---- Fetch all symbols ----
  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const res = await GET_NEW_SELECTED_TYPES_SYMBOLS_API()
        const {data} = await GET_INSTUMENT_FILTERS({})
        setFilterTypes(data.result || [])
        setAllSymbols(res.data.result.map((s) => s.instrument))
      } catch (err) {
        console.error("Failed to fetch symbols:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSymbols()
  }, [])

  // ---- Save to Redux ----
  useEffect(() => {
    dispatch(updateMarketWatchSymbols(instruments.map((i) => i.symbol)))
  }, [instruments, dispatch])

  // ---- Add Symbols ----
  const handleSubmit = async () => {
    setPosting(true)
    try {
      const prevSymbols = instruments.map((i) => i.symbol)
      const payload = {
        event: "create",
        data: { symbols: [...selectedSymbols, ...prevSymbols] },
      }
      const response = await POST_SELECTED_SYMBOLS_API(payload)
      console.log({"updatedFavorites":response})
      setInstruments(formatSymbolList(response.data.result.instruments))
      setSelectedSymbols([])
    } catch (err) {
      console.error("Failed to save symbols", err)
    } finally {
      setPosting(false)
    }
  }

  useEffect(() => {
    (async () => {
      const endpoint = selectedFilterType == "Favorites" ? GET_SELECTED_SYMBOLS_API : GET_NEW_SELECTED_TYPES_SYMBOLS_API
      setLoading(true)
      try {
        const { data } = await endpoint({[selectedFilterType]: filterTypes[selectedFilterType]})
        console.log({"instrumentsData":data})
        const newInstruments = formatSymbolList(data.result)
        setInstruments(newInstruments)
        if (newInstruments.length > 0) {
          handleSelect(newInstruments[0])
          setSelectedSymbol(newInstruments[0].symbol)
          dispatch(selectedSymbolAction(newInstruments[0].symbol))
        }
      } catch (err) {
        console.error("Failed to fetch instruments", err)
      } finally {
        setLoading(false)
      }
    })()
  },[selectedFilterType, filterTypes, dispatch, activeId])

  // ---- Delete ----
  const handleDelete = async (instrument) => {
    try {
      const updated = instruments.filter((i) => i.symbol !== instrument.symbol)
      setInstruments(updated)
      await POST_SELECTED_SYMBOLS_API({
        event: "create",
        data: { symbols: updated.map((i) => i.symbol) },
      })
    } catch (err) {
      console.error("Delete failed", err)
    }
  }

  // ---- Select ----
  const handleSelect = useCallback((instrument) => {
    console.log("Instrument selected:", instrument,instrument.symbol)
    setSelectedSymbol(instrument.symbol)
    dispatch(selectedSymbolAction(instrument.symbol))
    dispatch(updateTicksAction(instrument))
  }, [dispatch])

  // ---- Drag Handlers ----
  const handleDragStart = useCallback((event) => {
    setActiveInstumetn(event.active.id)
    setIsDragging(true)
  }, [])

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event

    setActiveInstumetn(null)
    setIsDragging(false)

    if (!over || active.id === over.id) return

    setInstruments((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === active.id)
      const newIndex = prev.findIndex((i) => i.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newArray = arrayMove(prev, oldIndex, newIndex)
        // Regenerate IDs to prevent duplicates
        return newArray.map((item, index) => ({
          ...item,
          id: `${index + 1}-${item.symbol}`
        }))
      }
      return prev
    })
  }, [])

  const handleDragCancel = useCallback(() => {
    setActiveInstumetn(null)
    setIsDragging(false)
  }, [])

  // Memoize the sortable items to prevent unnecessary re-renders
  const sortableItems = useMemo(() =>
    instruments.map((i) => i.id),
    [instruments]
  )
  const activeInstrument = instruments.find(i => i.id === activeInstument);

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e] border-r border-[#1e1e1e]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h2 className="text-sm font-medium text-slate-300 tracking-wide">
          INSTRUMENTS
        </h2>
      </div>

      {/* Symbol selection */}
      {selectedFilterType === "Favorites" && (
        <div className="m-2 mb-1 flex gap-2 items-center">
          <Autocomplete
            multiple
            options={allSymbols}
            value={selectedSymbols}
            size="small"
            onChange={(_, val) => setSelectedSymbols(val)}
            renderInput={(params) => (
              <TextField {...params} label="Select Symbols" />
            )}
            className="flex-1"
          />
          <Button variant="outlined" onClick={handleSubmit} disabled={posting}>
            {posting ? "Saving..." : "Submit"}
          </Button>
        </div>
      )}

      {/* Filter Dropdown */}
      <Select
        className="m-2 mt-1"
        size="small"
        style={{ width: "calc(100% - 16px)" }}
        aria-placeholder="Filter by Type"
        value={selectedFilterType}
        onChange={(event) =>   setSelectedFilterType(event.target.value)}
      >
        <MenuItem value="Favorites">Favorites</MenuItem>
        {Object.keys(filterTypes).map(e => 
          <MenuItem value={e} >{e}</MenuItem>
        )}
      </Select>
      {/* <Autocomplete
        options={Object.entries(FILTER_TYPE).map(([label, value]) => ({
          label,
          value,
        }))}
        getOptionLabel={(option) => option.label}
        value={
          selectedFilterType
            ? {
                label: Object.keys(FILTER_TYPE).find(
                  (k) => FILTER_TYPE[k] === selectedFilterType
                ),
                value: selectedFilterType,
              }
            : { label: "Favorites", value: "" }
        }
        className="m-2 mt-1"
        size="small"
        style={{ width: "calc(100% - 16px)" }}
        onChange={(_, val) => handleTypeChange(val?.value || "")}
        renderInput={(params) => <TextField {...params} />}
        disableClearable
      /> */}

      {/* Table Header */}
      <div
        className="grid gap-4 px-2 py-2 bg-slate-800 border-b border-slate-700"
        style={{ gridTemplateColumns: GRID_LAYOUT }}
      >
        <div className="text-slate-400 text-xs font-medium">Symbol</div>
        <div className="text-slate-400 text-xs font-medium text-center">Signal</div>
        <div className="text-slate-400 text-xs font-medium text-right">Bid</div>
        <div className="text-slate-400 text-xs font-medium text-right">Ask</div>
      </div>

      {/* Rows with Drag & Drop */}
      {loading ? <CircularProgress style={{margin: "auto"}} /> : <div className="flex-1 overflow-y-auto">
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={sortableItems}
            strategy={verticalListSortingStrategy}
          >
            {instruments.map((instrument) => (
              <SortableInstrumentRow
                key={instrument.id}
                instrument={instrument}
                isSelected={selectedSymbol === instrument.symbol}
                onSelect={()=>handleSelect(instrument)}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
          <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: "0.5",
                  },
                },
              }),
            }}
          >
            {activeInstument ? (
              <div className="bg-slate-800 border border-slate-600 rounded shadow-lg">
                <InstrumentRow
                  instrument={activeInstrument}
                  isSelected={false}
                  isDragging={true}
                  onSelect={() => handleSelect(activeInstrument)}
                  onDelete={handleDelete}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>}
    </div>
  )
}

export default memo(InstrumentsPanel)