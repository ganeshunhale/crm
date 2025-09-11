import { memo, useEffect, useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { X, GripVertical } from "lucide-react"
import { Tooltip } from "@mui/material"

// Consistent grid layout
const GRID_LAYOUT = "120px 30px 1fr 1fr"

const SignalIndicator = ({ signal }) => {
  const [prevSignal, setPrevSignal] = useState(signal)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (signal !== prevSignal) {
      setAnimate(true)
      const timeout = setTimeout(() => setAnimate(false), 300)
      setPrevSignal(signal)
      return () => clearTimeout(timeout)
    }
  }, [signal, prevSignal])

  const isUp = signal === "up"
  const isDown = signal === "down"
  const signalColor = isUp ? "bg-green-500" : isDown ? "bg-red-500" : "bg-gray-500"
  const signalIcon = isUp ? "↑" : isDown ? "↓" : "-"

  return (
    <div
      className={`w-4 h-4 rounded ${signalColor} flex items-center justify-center text-white text-xs transition-transform duration-300 ease-out ${
        animate ? "scale-125 animate-pulse" : ""
      }`}
    >
      {signalIcon}
    </div>
  )
}

const InstrumentRow = memo(({
  instrument,
  isSelected = false,
  isDragging = false,
  dragHandleProps = null,
  onSelect,
  onDelete
}) => {
  const { symbol, bid, ask, signal } = instrument

  const handleNonSymbolClick = () => {
    if (!isDragging && onSelect) onSelect(symbol)
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    if (onDelete) onDelete(instrument)
  }

  return (
    <div
      className={`group grid gap-4 px-2 py-3 border-b border-r border-slate-800 transition-colors duration-200 ease-in-out ${
        isSelected ? "bg-slate-700/70" : "hover:bg-slate-700/50"
      } ${isDragging ? "opacity-50 scale-[0.98]" : ""}`}
      style={{ gridTemplateColumns: GRID_LAYOUT }}
    >

      {/* Symbol + Drag + Delete */}
      <div className="flex items-center gap-2 min-w-0">
        {dragHandleProps && (
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-300 transition-colors flex-shrink-0"
            style={{ touchAction: 'none' }}
            aria-label="Drag handle"
          >
            <GripVertical size={14} />
          </div>
        )}

        <Tooltip title={symbol} arrow placement="top">
          <span className="text-white font-medium text-sm flex-1 min-w-0 truncate cursor-default select-none">
            {symbol}
          </span>
        </Tooltip>

        <X
          size={16}
          onClick={handleDeleteClick}
          className="text-red-500 cursor-pointer hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out flex-shrink-0"
          aria-label={`Delete ${symbol}`}
        />
      </div>

      {/* Signal */}
      <div
        className="flex items-center justify-center cursor-pointer"
        onClick={handleNonSymbolClick}
      >
        <SignalIndicator signal={signal} />
      </div>

      {/* Bid */}
      <div className="text-right cursor-pointer" onClick={handleNonSymbolClick}>
        <span className="text-white text-sm font-mono">
          {bid?.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 5,
          })}
        </span>
      </div>

      {/* Ask */}
      <div className="text-right cursor-pointer" onClick={handleNonSymbolClick}>
        <span className="text-white text-sm font-mono">
          {ask?.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 5,
          })}
        </span>
      </div>
    </div>
  )
})

InstrumentRow.displayName = 'InstrumentRow'

const SortableInstrumentRow = memo(({ instrument, isSelected, onSelect, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: instrument.id,
    data: {
      type: 'instrument',
      instrument,
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  }

  const dragHandleProps = {
    ...attributes,
    ...listeners,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <InstrumentRow
        instrument={instrument}
        isSelected={isSelected}
        isDragging={isDragging}
        dragHandleProps={dragHandleProps}
        onSelect={onSelect}
        onDelete={onDelete}
      />
    </div>
  )
})

SortableInstrumentRow.displayName = 'SortableInstrumentRow'

export default SortableInstrumentRow
export { InstrumentRow }
