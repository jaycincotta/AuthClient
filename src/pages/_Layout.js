import React, { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
  const { token, email, logout } = useContext(AuthContext)
  const location = useLocation()

  // Wait for AuthProvider to initialize
  if (!token) {
    return <div>Initializing...</div>
  }
  
  return (
    <div>
      <header>
        <Link to="/">Home</Link>
        <Link to="/public">Public</Link>
        <Link to="/protected">Protected</Link>
        {!email && <Link to={"/login?returnUrl=" + location.pathname} >Login</Link>}
        {email && <a href="#" onClick={logout}>Logout</a>}
        <div className="flexRight">{email}</div>
      </header>
      <Outlet />
    </div>
  );
}
