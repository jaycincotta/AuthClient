import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
  const { initialized, email, logout } = useContext(AuthContext)
  const location = useLocation()

  // Wait for AuthProvider to initialize
  if (!initialized) {
    return <div>Initializing...</div>
  } else if (initialized !== "OK") {
    return <div className="errorMessage">{initialized}</div>
  }
  
  return (
    <div>
      <header>
        <Link to="/">Home</Link>
        <Link to="/test/guest">Guest</Link>
        <Link to="/test/customer">Customer</Link>
        <Link to="/test/linkedcustomer">LinkedCustomer</Link>
        <Link to="/test/employee">Employee</Link>
        {!email && <Link to={"/login?returnUrl=" + location.pathname} >Login</Link>}
        {email && <a href="#" onClick={logout}>Logout</a>}
        <div className="flexRight">{email}</div>
      </header>
      <Outlet />
    </div>
  );
}
