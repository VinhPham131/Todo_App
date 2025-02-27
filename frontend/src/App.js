import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserManagement from "./pages/user-management";
import Home from "./pages/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/" element={<Home />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
