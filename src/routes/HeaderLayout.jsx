import React, { useState, useRef  } from "react";
import { Outlet } from "react-router-dom";



const Header = () => {
  return (
    <>
      <header className="bg-indigo-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">My App Header</h1>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
};

export default Header;
