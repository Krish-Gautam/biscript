import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/home";
import Register from "./pages/auth/register";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/auth/login";
import Languages from "./pages/languages";
import Lessons from "./pages/lessons";
import Question from "./pages/question";
import Navbar2 from "./components/Navbar2";
import Challenges from "./pages/challenges";
import Playground from "./pages/playground";
import Profile from "./pages/profile";
import EditProfile from "./pages/editprofile"
import BadgesPage from "./pages/badges";
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
            <Route path="/auth/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/languages" element={
               <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-white">
                  <div className="fixed  w-full z-50 flex justify-center">
                    <Navbar />
                  </div>
                  <Languages />
                </div>
              } />
            <Route path="/lessons/:language" element={
               <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-white">
                  <div className="fixed  w-full z-50 flex justify-center">
                    <Navbar />
                  </div>
                  <Lessons />
                </div>
            } />

            { <Route path="/questions/:language/:lesson" element={
               <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-white">
                  <Question />
                </div>
            } /> }

            <Route path="/challenges" element={
               <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-white">
                  <div className="fixed  w-full z-50 flex justify-center">
                    <Navbar />
                  </div>
                  <Challenges />
                </div>
            } />
            { <Route path="/challenges/:challengeId/playground" element={
               <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-white">
                  <Playground />
                </div>
            } /> }

            <Route path="/profile" element={
               <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-white">
                  <div className="fixed  w-full z-50 flex justify-center">
                    <Navbar />
                  </div>
                  <Profile />
                </div>
            } />
            <Route path="/profile/edit" element={
               <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-white">
                  <div className="fixed  w-full z-50 flex justify-center">
                    <Navbar />
                  </div>
                  <EditProfile />
                </div>
            } />
            <Route path="/badges" element={
               <div className="min-h-screen flex flex-col bg-[#0d0d0d] text-white">
                  <div className="fixed  w-full z-50 flex justify-center">
                    <Navbar />
                  </div>
                  <BadgesPage />
                </div>
            } />


          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
