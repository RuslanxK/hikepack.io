import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import SideBar from "./components/sidebar/SideBar";
import Home from "./components/Home";
import Articles from "./components/articles/Articles";
import ExploreBags from "./components/ExploreBags";
import Settings from "./components/Settings";
import BugReport from "./components/BugReport";
import Changelog from "./components/Changelog";
import AdminSettings from "./components/admin/AdminChangelog";
import TripDetails from "./components/TripDetails";
import BagDetails from "./components/BagDetails";
import MainShare from "./components/share/MainShare";
import NotFoundPage from "./components/404/NotFoundPage";
import SingleArticle from "./components/articles/SingleArticle";
import Register from "./components/register/Register";
import Login from "./components/register/Login";
import PrivateRoutes from "./routes/privateRoutes";
import PublicRoutes from "./routes/publicRoutes";
import VerifyAccount from "./components/register/VerifyAccount";
import EmailCheck from "./components/register/EmailCheck";
import ResetPassword from "./components/register/ResetPassword";
import AdminRoute from "./routes/AdminRoute";
import AdminMain from "./components/admin/AdminMain";
import Dashboard from "./components/admin/Dashboard";
import { getSocket, disconnectSocket } from "./utils/websocketService";


const App: React.FC = () => {
  const [liveUsers, setLiveUsers] = useState<number>(0); 
  const location = useLocation();


  const hideSidebar =
    location.pathname.startsWith("/share") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/verify-account") ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/new-password");

  const skipWebSocket =
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/verify-account") ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/new-password");




    useEffect(() => {
      if (skipWebSocket) {
        console.log("WebSocket connection skipped for this page.");
        return;
      }
      try {
        const socket = getSocket(); 
        socket.on("liveUsers", (count: number) => {
          setLiveUsers(count);
        });
  
        return () => {
          disconnectSocket();
        };
      } catch (error) {
        if (error instanceof Error) {
          console.error("WebSocket connection failed:", error.message);
        } else {
          console.error("WebSocket connection failed with an unknown error:", error);
        }
      }
    }, [skipWebSocket]); 
    

  return (
    <div className="flex">
      {!hideSidebar && <SideBar />}
      <div
        className={`ml-0 ${
          !hideSidebar && "lg:ml-56"
        } min-h-screen h-fit flex-grow bg-theme-bgGray dark:bg-theme-bgDark`}
      >
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoutes />}>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="/verify-account/:id" element={<VerifyAccount />} />
            <Route path="/reset-password" element={<EmailCheck />} />
            <Route path="/new-password/:id" element={<ResetPassword />} />
          </Route>

          {/* Private Routes */}
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/trip/:id" element={<TripDetails />} />
            <Route path="/bag/:id" element={<BagDetails />} />
            <Route path="/article/:id" element={<SingleArticle />} />
            <Route path="/recent-bags" element={<Home />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/community-bags" element={<ExploreBags />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/bug-report" element={<BugReport />} />

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminMain />} />
              <Route path="/add-changelog" element={<AdminSettings />} />
              <Route
                path="/dashboard"
                element={<Dashboard liveUsers={liveUsers} />}
              />
            </Route>

            {/* Catch-all Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Public Sharing Route */}
          <Route path="/share/:id" element={<MainShare />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
