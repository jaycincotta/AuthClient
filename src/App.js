import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import DataProvider from "./context/DataProvider";
import Layout from "./pages/_Layout";
import HomePage from "./pages/HomePage";
import Test from "./pages/_Test";
import Login from "./pages/Login";
import Guest from "./pages/test/Guest";
import Customer from "./pages/test/Customer";
import LinkedCustomer from "./pages/test/LinkedCustomer";
import Employee from "./pages/test/Employee";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter basename="authclient">
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="login" element={<Login />} />
              <Route path="test" element={<Test />}>
                <Route path="guest" element={<Guest />} />
                <Route path="customer" element={<Customer />} />
                <Route path="linkedcustomer" element={<LinkedCustomer />} />
                <Route path="employee" element={<Employee />} />
              </Route>
              <Route index element={<HomePage />} />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
