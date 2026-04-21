import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/home";
import Register from "./pages/auth/register";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Home Page */}
            <Route
              path="/"
              element={
                <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-white">
                  <div className="fixed  w-full z-50 flex justify-center">
                    <Navbar />
                  </div>
                  <Home />
                </div>
              }
            />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
