import React from "react";

const ResultContainer = ({ children }) => {
  return (
    <div className="flex sm:flex-row flex-col gap-y-3 justify-between gap-x-3 items-start w-full">
      {children}
    </div>
  );
};

export default ResultContainer;
