import React from 'react';

const AboutBoxContainer = ({ items }) => {
  return (
    <div className="flex flex-col gap-y-8 mt-4">
      <div className="w-full flex justify-around gap-4 flex-wrap">
        {items.map((data) => (
          <div
            key={data.title}
            className="flex flex-col bg-white/70 gap-y-2 px-5 py-8 shadow-slate-200 shadow-sm rounded-2xl max-w-[320px]"
          >
            <h2 className="text-lg font-bold text-primary text-left">
              {data.title}
            </h2>
            <p className="text-base text-primary max-w-[400px] text-left">
              {data.content}
            </p>
            <p className="text-base text-primary max-w-[400px] text-left">
              {data.othercontent}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutBoxContainer;
