import SideBar from "./components/sidebar/SideBar"
import { Route, Routes,  useLocation } from 'react-router-dom';
import Home from "./components/Home";
import Articles from "./components/articles/Articles";
import ExploreBags from "./components/ExploreBags";
import Settings from "./components/Settings";
import BugReport from "./components/BugReport";
import Changelog from "./components/Changelog";
import AdminSettings from "./components/AdminSettings";
import TripDetails from "./components/TripDetails";
import BagDetails from "./components/BagDetails";
import Shop from "./components/Shop";
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

const App: React.FC = () => {

  const location = useLocation();
  const hideSidebar = location.pathname.startsWith('/share') || location.pathname.startsWith('/register') 
  || location.pathname.startsWith('/login') || location.pathname.startsWith('/verify-account') || location.pathname.startsWith('/reset-password') || location.pathname.startsWith('/new-password');

  return (
  
      <div className="flex ">
       {!hideSidebar && <SideBar />}
        <div className={`${hideSidebar ? 'ml-0' : 'ml-56'} min-h-screen h-fit flex-grow bg-theme-bgGray dark:bg-theme-bgDark`} >
          <Routes>

          <Route element={<PublicRoutes />}>
          <Route path="register" element={ <Register />} />
          <Route path="login" element={<Login />} />
          <Route path="/verify-account/:id" element={ <VerifyAccount />} />
          <Route path="/reset-password" element={ <EmailCheck />} />
          <Route path="/new-password/:id" element={ <ResetPassword />} />
          </Route>

          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/trip/:id" element={<TripDetails />} />
            <Route path="/bag/:id" element={<BagDetails />} />
            <Route path="/article/:id" element={<SingleArticle />} />
            <Route path="/recent-bags" element={<Home />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/explore-bags" element={<ExploreBags />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/bug-report" element={<BugReport />} />
            <Route path="/admin-settings" element={<AdminSettings />} />
            <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route path="/share/:id" element={<MainShare/>} />
          </Routes>
        </div>
      </div>
    
  )
}

export default App