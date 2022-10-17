import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import DataProvider from "./context/DataProvider";
import Layout from "./pages/_Layout";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Public from "./pages/Public";
import Protected from "./pages/Protected";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter basename="authclient">
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="login" element={<Login />} />
              <Route path="public" element={<Public />} />
              <Route path="protected" element={<Protected />} />
              <Route index element={<HomePage />} />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Route>
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
