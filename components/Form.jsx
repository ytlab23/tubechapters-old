"use client";
import { useState } from "react";
import { PiCopySimple } from "react-icons/pi";

const Form = ({ getSummery }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [copyText, setCopyText] = useState("Copy");
  const [descText, setDescText] = useState("Copy");
  const [desc, setDesc] = useState("");
  const [showDesc, setShowDesc] = useState(false);

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
    <div className="flex flex-col gap-y-4 mt-24">
      <h2 className="text-base text-primary">Add your YouTube URL 👇</h2>
      <input
        type="text"
        placeholder="https://www.youtube.com/watch?"
        className="outline-none border border-primary/40 bg-back px-8 py-4 rounded-xl"
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="btn bg-[#dc2626] px-6 py-3 text-back font-normal text-xl rounded-xl max-w-[150px] self-center min-w-[140px]"
        onClick={async () => {
          if (url !== "") {
            setCopyText("Copy");
            setDescText("Copy");
            setShowDesc(false);
            setData([]);
            setLoading(true);
            let data = await getSummery(url);
            const last = data.length;
            let description = data?.slice(last - 2, last + 1);
            setDesc(description?.join("\n"));
            data = data?.slice(0, last - 2);
            console.log("description", description);
            console.log("data", data);
            setLoading(false);
            setData(data);
          }
        }}
      >
        {loading ? <span className="loader"></span> : "Generate"}
      </button>
      {data.length > 0 && (
        <div className="flex flex-col gap-y-4 my-4 bg-back p-8 rounded-lg">
          <div className="flex justify-between gap-x-3 items-start w-full">
            <div className="flex flex-col gap-y-2 text-left">
              {data?.map((item, index) => (
                <p className="text-sm text-primary" key={index}>
                  {item}
                </p>
              ))}
            </div>
            <div
              className="btn flex items-center gap-x-2 px-4 py-2  bg-red-600 cursor-pointer rounded-lg"
              onClick={() => handleCopy(data.join("\n"), "timestamps")}
            >
              <PiCopySimple size={16} color="white" />
              <p className="text-white tex-sm font-medium ">{copyText}</p>
            </div>
          </div>

          <button
            className="btn bg-[#dc2626] px-6 py-3 text-back font-normal text-sm rounded-xl max-w-[150px] self-center min-w-[100px]"
            onClick={() => {
              setShowDesc(true);
            }}
          >
            Generate video description
          </button>

          {showDesc && (
            <div className="flex justify-between gap-x-3 items-start w-full my-4">
              <p className="text-sm text-primary text-left">{desc}</p>
              <div
                className="btn flex items-center gap-x-2 px-4 py-2  bg-red-600 cursor-pointer rounded-lg"
                onClick={() => handleCopy(desc, "desc")}
              >
                <PiCopySimple size={16} color="white" />
                <p className="text-white tex-sm font-medium ">{descText}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Form;
