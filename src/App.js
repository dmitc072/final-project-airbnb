import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Signup } from "../src/components/signup/SignUp";
import { SignIn } from "../src/components/signin/SignIn";
import { DashboardRoute } from "./components/dashboard/DashboardRoute.js";
import { Splash } from "./components/splash/Splash.js";
import React from 'react';


function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard/*" element={<DashboardRoute />} />
        <Route path='*' element={<p>404 Error: Nothing here!</p>} />
      </Routes>
    </Router>
  );
}

export default App;
