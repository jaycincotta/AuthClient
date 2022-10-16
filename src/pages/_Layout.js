import React, { useContext } from "react";
import { AppContext } from "../AppContext";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
  const { email, logout } = useContext(AppContext)
  const location = useLocation()

  return (
    <div>
      <header>
        <Link to="/">Home</Link>
        <Link to="/part">Part</Link>
        {!email && <Link to={"/login?returnUrl=" + location.pathname} >Login</Link>}
        {/* https://stackoverflow.com/a/20165626/26553 */}
        {email && <a href="#" onClick={logout}>Logout</a>}
        <div className="flexRight">{email}</div>
      </header>
      <Outlet />
    </div>
  );
}
