import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";

import "./App.css";
import "./pages/Styles.css";
import Inventory from "./pages/Inventory";
import Report from "./pages/Report";
import Details from "./pages/Details";
import Charts from "./pages/Charts";
import ReportDate from "./pages/ReportDate";
import TableReport from "./pages/TableReport";
import ProductsReport from "./pages/Product";
import Auth from "./pages/Auth";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { invtryActions } from "./redux/inventorySlice";

function App() {
  const isAuth = useSelector((state) => state.invtry.isAuth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("route", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuth) {
      const token = localStorage.getItem("token") || "";
      console.log(token);

      if (token !== "") {
        console.log("here");
        dispatch(invtryActions.setAuth(token));
      }
    }
  }, []);

  useEffect(() => {
    const lastPath = localStorage.getItem("route");
    if (
      lastPath.includes("/products-report") ||
      lastPath.includes("/table-report")
    ) {
      navigate("/report");
    } else {
      navigate(lastPath);
    }
  }, [isAuth]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={isAuth ? <Home /> : <Navigate to="/auth" />} />
        <Route
          path="/auth"
          element={!isAuth ? <Auth /> : <Navigate to="/" />}
        />
        <Route
          path="/inventory"
          element={isAuth ? <Inventory /> : <Navigate to="/auth" />}
        />
        <Route
          path="/report"
          element={isAuth ? <Report /> : <Navigate to="/auth" />}
        />
        <Route
          path="/details"
          element={isAuth ? <Details /> : <Navigate to="/auth" />}
        />
        <Route
          path="/inventory-history"
          element={isAuth ? <Charts /> : <Navigate to="/auth" />}
        />
        <Route
          path="/report-date/:date"
          element={isAuth ? <ReportDate /> : <Navigate to="/auth" />}
        />
        <Route
          path="/table-report"
          element={isAuth ? <TableReport /> : <Navigate to="/auth" />}
        />
        <Route
          path="/products-report"
          element={isAuth ? <ProductsReport /> : <Navigate to="/auth" />}
        />
      </Routes>
    </div>
  );
}

export default App;
