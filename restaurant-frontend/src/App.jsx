import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Categories from "./pages/Categories";
import Tables from "./pages/Tables";
import Reservations from "./pages/Reservations";
import Orders from "./pages/Orders";
import Kitchen from "./pages/Kitchen";
import Billing from "./pages/Billing";
function App() {

    const isLoggedIn = localStorage.getItem("loggedIn");

    return (
      
        <BrowserRouter>

            <Routes>
                <Route
                    path="/menu"
                    element={
                        isLoggedIn
                            ? <Menu />
                            : <Navigate to="/" />
                   }
                />
                <Route
                    path="/categories"
                    element={
                        isLoggedIn
                           ? <Categories />
                           : <Navigate to="/" />
                    }
                />
                <Route
                    path="/tables"
                    element={
                        isLoggedIn
                           ? <Tables />
                           : <Navigate to="/" />
                    }
                />
                <Route
                    path="/reservations"
                    element={
                        isLoggedIn
                           ? <Reservations />
                           : <Navigate to="/" />
                    }     
                />
                <Route
                    path="/orders"
                    element={
                        isLoggedIn
                           ? <Orders />
                           : <Navigate to="/" />
                    }
                />
                <Route
                    path="/kitchen"
                    element={
                        isLoggedIn
                           ? <Kitchen />
                           : <Navigate to="/" />
                    }
                />
                <Route
                    path="/billing"
                    element={
                        isLoggedIn
                           ? <Billing />
                           : <Navigate to="/" />
                    }
                />
                <Route
                    path="/"
                    element={
                        isLoggedIn
                            ? <Navigate to="/dashboard" />
                            : <Login />
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        isLoggedIn
                            ? <Dashboard />
                            : <Navigate to="/" />
                    }
                />
                

            </Routes>

        </BrowserRouter>
    );
}

export default App;