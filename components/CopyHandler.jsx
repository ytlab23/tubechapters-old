import React from "react";
import { PiCopySimple } from "react-icons/pi";

const CopyHandler = ({ copyData, format, title, setCopyText, setDescText }) => {
  const handleCopy = async (text, format) => {
    try {
      await navigator.clipboard.writeText(text);
      if (format === "desc") {
        setDescText("Copied");
        setCopyText("Copy");
      } else {
        setCopyText("Copied");
        setDescText("Copy");
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  return (
    <div
      className="btn flex items-center gap-x-2 px-4 py-2  bg-red-600 cursor-pointer rounded-lg"
      onClick={() => handleCopy(copyData, format)}
    >
      <PiCopySimple size={16} color="white" />
      <p className="text-white tex-sm font-medium ">{title}</p>
    </div>
  );
};

export default CopyHandler;
