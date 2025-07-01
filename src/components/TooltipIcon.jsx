import React from 'react';
import { TbInfoTriangle } from "react-icons/tb";


export default function TooltipIconComponent({ message = '' }) {
  return (
    message &&
    <div className="relative flex items-center group cursor-pointer">
      <span className="text-blue-500 text-lg"><TbInfoTriangle /></span>
      
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 rounded bg-gray-800 text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        {message}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </div>
  );
};
