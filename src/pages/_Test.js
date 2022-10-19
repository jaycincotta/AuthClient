import React from "react";
import { Outlet } from "react-router-dom";

export default function Test() {
  
  return (
    <div className="test">
      <Outlet />
    </div>
  );
}
