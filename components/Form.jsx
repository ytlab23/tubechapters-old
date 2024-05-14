"use client";
import { useState } from "react";
import CopyHandler from "./CopyHandler";
import ResultContainer from "./ResultContainer";

const Form = ({ getSummery }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [copyText, setCopyText] = useState("Copy");
  const [descText, setDescText] = useState("Copy");
  const [desc, setDesc] = useState("");
  const [showDesc, setShowDesc] = useState(false);

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
            console.log("data====>", data);
            if (data) {
              setLoading(false);
              const last = data?.length;
              let description = data?.slice(last - 2, last + 1);
              setDesc(description?.join("\n"));
              data = data?.slice(0, last - 2);
              console.log("description", description);
              console.log("data", data);
              setData(data);
            }
          }
        }}
      >
        {loading ? <span className="loader"></span> : "Generate"}
      </button>
      {data.length > 0 && (
        <div className="flex flex-col gap-y-4 my-4 bg-back md:p-8 px-4 py-8 rounded-lg">
          <ResultContainer>
            <div className="flex flex-col gap-y-2 text-left">
              {data?.map((item, index) => (
                <p className="text-sm text-primary" key={index}>
                  {item}
                </p>
              ))}
            </div>
            <CopyHandler
              setCopyText={setCopyText}
              setDescText={setDescText}
              copyData={data?.join("\n")}
              format="timestamps"
              title={copyText}
            />
          </ResultContainer>

          <button
            className="btn bg-[#dc2626] px-6 py-3 text-back font-normal text-sm rounded-xl max-w-[150px] self-center min-w-[100px] my-8"
            onClick={() => {
              setShowDesc(true);
            }}
          >
            Generate video description
          </button>

          {showDesc && (
            <ResultContainer>
              <p className="text-sm text-primary text-left">{desc}</p>
              <CopyHandler
                setCopyText={setCopyText}
                setDescText={setDescText}
                copyData={desc}
                format="desc"
                title={descText}
              />
            </ResultContainer>
          )}
        </div>
      )}
    </div>
  );
};

export default Form;
