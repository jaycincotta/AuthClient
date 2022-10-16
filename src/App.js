import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppState from "./AppState";
import Layout from "./pages/_Layout";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Part from "./pages/Part";
import "./styles.css";

export default function App() {
  // AppState is an AppContext.Provider which would typically be the outermost component.
  // We nest it within Router so that AppState can access the useNavigate hook
  return (
    <BrowserRouter>
      <AppState>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="login" element={<Login />} />
            <Route path="part" element={<Part />} />
            <Route index element={<HomePage />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Route>
        </Routes>
      </AppState>
    </BrowserRouter>
  );
}
