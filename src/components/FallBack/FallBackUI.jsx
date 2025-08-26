import { CircularProgress } from "@mui/material"

const FallBackUi = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4">
            <CircularProgress
            size={24} color="inherit"
          />
        </div>
    )
}

export default FallBackUi