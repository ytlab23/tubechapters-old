import React from 'react';
import DropItem from './DropItem';

const DropDowns = ({ dropDownsData }) => {
  return (
    <div className="flex flex-col gap-y-8 mt-8">
      {dropDownsData.map((item) => (
        <DropItem key={item.title} item={item} />
      ))}
    </div>
  );
};

export default DropDowns;
