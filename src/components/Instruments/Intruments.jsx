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
  TextField,
} from "@mui/material"

import SortableInstrumentRow, { InstrumentRow } from "./InstrumentRow"

import {
  GET_SELECTED_SYMBOLS_API,
  GET_SELECTED_TYPES_SYMBOLS_API,
  GET_SYMBOL_API,
  POST_SELECTED_SYMBOLS_API,
} from "../../API/ApiServices"
import {
  selectedSymbolAction,
  updateMandetorySymbols,
  updateTicksAction,
} from "../../redux/tradePositionSlice"
import { useDispatch } from "react-redux"

const FILTER_TYPE = {
  Favorites: "",
  "Most Traded": "most_traded",
  "Top Moves": "top_moves",
  Metals: "metals",
  Majors: "majors",
  Crypto: "crypto",
  Indices: "indices",
  Energy: "energy",
}

// Consistent grid layout for header and rows
const GRID_LAYOUT = "120px 30px 1fr 1fr"

function InstrumentsPanel({ ticksSocket }) {
  const dispatch = useDispatch()

  const [instruments, setInstruments] = useState([])
  const [allSymbols, setAllSymbols] = useState([])
  const [selectedSymbols, setSelectedSymbols] = useState([])
  const [posting, setPosting] = useState(false)
  const [filterType, setFilterType] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedSymbol, setSelectedSymbol] = useState(null)
  const [activeId, setActiveId] = useState(null)
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
        const res = await GET_SYMBOL_API()
        setAllSymbols(res.data.result?.data || [])
      } catch (err) {
        console.error("Failed to fetch symbols:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSymbols()
  }, [])

  // ---- Fetch favorites ----
  const fetchSelected = async () => {
    setLoading(true)
    try {
      const res = await GET_SELECTED_SYMBOLS_API()
      const selected = res.data.result || []
      const initial = selected.map((s, i) => ({
        id: `${i + 1}-${s.instrument}`, // Ensure unique IDs
        symbol: s.instrument,
        signal: "neutral",
        bid: s.bid,
        ask: s.ask,
      }))
      setInstruments(initial)
      if (initial.length > 0 && !selectedSymbol) {
        setSelectedSymbol(initial[0].symbol)
        dispatch(selectedSymbolAction(initial[0].symbol))
      }
    } catch (err) {
      console.error("Failed to fetch selected symbols", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSelected()
  }, [])

  // ---- Save to Redux ----
  useEffect(() => {
    if (instruments.length > 0) {
      dispatch(updateMandetorySymbols(instruments.map((i) => i.symbol)))
    }
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
      const updated = response.data.result.instruments.map((s, i) => ({
        id: `${i + 1}-${s.instrument}`, // Ensure unique IDs
        symbol: s.instrument,
        signal: "neutral",
        bid: s.bid,
        ask: s.ask,
      }))
      setInstruments(updated)
      setSelectedSymbols([])
    } catch (err) {
      console.error("Failed to save symbols", err)
    } finally {
      setPosting(false)
    }
  }

  // ---- Filter ----
  const handleTypeChange = async (value) => {
    setFilterType(value)
    if (value === "") return fetchSelected()

    setPosting(true)
    try {
      const response = await GET_SELECTED_TYPES_SYMBOLS_API(value)
      const newInstruments = response.data.result.map((s, i) => ({
        id: `${i + 1}-${s.instrument}`, // Ensure unique IDs
        symbol: s.instrument,
        signal: "neutral",
        bid: s.bid,
        ask: s.ask,
      }))
      setInstruments(newInstruments)
      if (newInstruments.length > 0) {
        setSelectedSymbol(newInstruments[0].symbol)
        dispatch(selectedSymbolAction(newInstruments[0].symbol))
      }
    } catch (err) {
      console.error("Failed to fetch instruments", err)
    } finally {
      setPosting(false)
    }
  }

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
  const handleSelect = useCallback((symbol) => {
    console.log("Instrument selected:", symbol)
    setSelectedSymbol(symbol)
    dispatch(selectedSymbolAction(symbol))
  }, [dispatch])

  // ---- Drag Handlers ----
  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id)
    setIsDragging(true)
  }, [])

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event

    setActiveId(null)
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
    setActiveId(null)
    setIsDragging(false)
  }, [])

  // Memoize the sortable items to prevent unnecessary re-renders
  const sortableItems = useMemo(() =>
    instruments.map((i) => i.id),
    [instruments]
  )





  if (loading) return <CircularProgress />

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border-r border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <h2 className="text-sm font-medium text-slate-300 tracking-wide">
          INSTRUMENTS
        </h2>
      </div>

      {/* Symbol selection */}
      {filterType === "" && (
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
      <Autocomplete
        options={Object.entries(FILTER_TYPE).map(([label, value]) => ({
          label,
          value,
        }))}
        getOptionLabel={(option) => option.label}
        value={
          filterType
            ? {
                label: Object.keys(FILTER_TYPE).find(
                  (k) => FILTER_TYPE[k] === filterType
                ),
                value: filterType,
              }
            : { label: "Favorites", value: "" }
        }
        className="m-2 mt-1"
        size="small"
        style={{ width: "calc(100% - 16px)" }}
        onChange={(_, val) => handleTypeChange(val?.value || "")}
        renderInput={(params) => <TextField {...params} />}
        disableClearable
      />

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
      <div className="flex-1 overflow-y-auto">
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
                onSelect={handleSelect}
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
            {activeId ? (
              <div className="bg-slate-800 border border-slate-600 rounded shadow-lg">
                <InstrumentRow
                  instrument={instruments.find(i => i.id === activeId)}
                  isSelected={false}
                  isDragging={true}
                  onSelect={handleSelect}
                  onDelete={handleDelete}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}

export default memo(InstrumentsPanel)