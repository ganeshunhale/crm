import { useState } from "react";
// import { IoMdAdd } from "react-icons/io";
import ErrorImg from "../../assets/Img/errorImg.png";
import LoopIcon from '@mui/icons-material/Loop';
export default function ErrorBoundary({ error }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!error) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-70px)] text-center px-4">
      <div className="w-full max-w-[400px]">
        <img src={ErrorImg} alt="Error" className="w-full" />
      </div>
      <h1 className="text-2xl font-medium mb-4">Aaaah! Something went wrong</h1>
      <p className="font-normal">
        Please bear with us as we rectify the problem. Your understanding is greatly appreciated.
      </p>
      <p className="font-normal mt-1">You may also refresh the page or try again later.</p>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 rounded border border-gray-800 bg-white text-[#C9A366]"
        >
          Try Again
        </button>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 rounded border border-[#C9A366] bg-[#C9A366] text-white"
        >
          Go Back
        </button>
      </div>

      {error && (
        <pre
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-[#FFF2F0] w-[90%] p-4 text-left text-sm mt-4 cursor-pointer"
        >
          <LoopIcon
            style={{
              transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            }}
            className="absolute right-2 top-1/3 text-lg transition-transform duration-300"
          />
          {error.toString()}
          {isOpen && <>{error.stack}</>}
        </pre>
      )}
    </div>
  );
}
