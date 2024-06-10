'use client';
import React, { useState } from 'react';
import { BiUpArrowAlt, BiDownArrowAlt } from 'react-icons/bi';

const DropItem = ({ item }) => {
  const [expand, setExpand] = useState(false);
  return (
    <div className="flex flex-col gap-y-4">
      <div
        className="flex items-center justify-between py-3 px-5 gap-x-16  bg-slate-500 rounded-xl"
        onClick={() => setExpand(!expand)}
      >
        <h2 className="text-base text-left font-bold text-white">
          {item.title}
        </h2>
        {expand ? (
          <BiUpArrowAlt size={26} color="white" className="cursor-pointer" />
        ) : (
          <BiDownArrowAlt size={26} color="white" className="cursor-pointer" />
        )}
      </div>
      {expand && (
        <p className="ml-3 text-sm text-left text-primary">{item.content}</p>
      )}
    </div>
  );
};

export default DropItem;
