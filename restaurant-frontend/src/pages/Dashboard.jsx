import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        menuItems: 0,
        tables: 0,
        reservations: 0,
        activeOrders: 0,
        kitchenOrders: 0,
        todaySales: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            const [
                menuResponse,
                tablesResponse,
                reservationsResponse,
                ordersResponse,
                kitchenResponse
            ] = await Promise.all([
                api.get("/menu"),
                api.get("/tables"),
                api.get("/reservations"),
                api.get("/orders"),
                api.get("/kitchen/orders")
            ]);

            const orders = ordersResponse.data;

            const today = new Date()
                .toISOString()
                .split("T")[0];

            const todaySales = orders
                .filter(order => {

                    if (!order.orderDate) {
                        return false;
                    }

                    return order.orderDate.startsWith(today);

                })
                .reduce(
                    (total, order) =>
                        total + Number(order.totalAmount || 0),
                    0
                );

            setStats({
                menuItems: menuResponse.data.length,
                tables: tablesResponse.data.length,
                reservations:
                    reservationsResponse.data.length,
                activeOrders:
                    orders.filter(
                        order =>
                            order.status !== "COMPLETED"
                    ).length,
                kitchenOrders:
                    kitchenResponse.data.length,
                todaySales
            });

            setLoading(false);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load dashboard data."
            );

            setLoading(false);
        }
    };

    const logout = () => {

        localStorage.removeItem("loggedIn");

        navigate("/");
    };

    return (

        <div className="dashboard">

            <header className="topbar">

                <div>
                    <h2>
                        Restaurant Management System
                    </h2>

                    <span>
                        Admin Dashboard
                    </span>
                </div>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </header>

            <div className="dashboard-content">

                <div className="dashboard-title">

                    <div>
                        <h1>Dashboard</h1>

                        <p className="welcome">
                            Welcome back, Admin
                        </p>
                    </div>

                    <button
                        className="refresh-button"
                        onClick={loadDashboard}
                    >
                        ↻ Refresh
                    </button>

                </div>

                {error && (
                    <div className="message error-box">
                        {error}
                    </div>
                )}

                {loading ? (

                    <div className="dashboard-loading">
                        Loading dashboard...
                    </div>

                ) : (

                    <div className="stats-grid">

                        <div
                            className="stat-card"
                            onClick={() =>
                                navigate("/menu")
                            }
                        >

                            <div className="stat-icon">
                                🍴
                            </div>

                            <div>
                                <span>
                                    Menu Items
                                </span>

                                <strong>
                                    {stats.menuItems}
                                </strong>
                            </div>

                        </div>

                        <div
                            className="stat-card"
                            onClick={() =>
                                navigate("/tables")
                            }
                        >

                            <div className="stat-icon">
                                🪑
                            </div>

                            <div>
                                <span>
                                    Restaurant Tables
                                </span>

                                <strong>
                                    {stats.tables}
                                </strong>
                            </div>

                        </div>

                        <div
                            className="stat-card"
                            onClick={() =>
                                navigate("/reservations")
                            }
                        >

                            <div className="stat-icon">
                                📅
                            </div>

                            <div>
                                <span>
                                    Reservations
                                </span>

                                <strong>
                                    {stats.reservations}
                                </strong>
                            </div>

                        </div>

                        <div
                            className="stat-card"
                            onClick={() =>
                                navigate("/orders")
                            }
                        >

                            <div className="stat-icon">
                                🛒
                            </div>

                            <div>
                                <span>
                                    Active Orders
                                </span>

                                <strong>
                                    {stats.activeOrders}
                                </strong>
                            </div>

                        </div>

                        <div
                            className="stat-card"
                            onClick={() =>
                                navigate("/billing")
                            }
                        >

                            <div className="stat-icon">
                                💰
                            </div>

                            <div>
                                <span>
                                    Today's Sales
                                </span>

                                <strong>
                                    ₹{stats.todaySales.toFixed(2)}
                                </strong>
                            </div>

                        </div>

                        <div
                            className="stat-card"
                            onClick={() =>
                                navigate("/kitchen")
                            }
                        >

                            <div className="stat-icon">
                                👨‍🍳
                            </div>

                            <div>
                                <span>
                                    Kitchen Orders
                                </span>

                                <strong>
                                    {stats.kitchenOrders}
                                </strong>
                            </div>

                        </div>

                    </div>

                )}

                <div className="dashboard-modules">

                    <div
                        className="dashboard-module"
                        onClick={() =>
                            navigate("/orders")
                        }
                    >
                        <div className="module-icon">
                            🛒
                        </div>

                        <h3>New Order</h3>

                        <p>
                            Create a customer order
                        </p>
                    </div>

                    <div
                        className="dashboard-module"
                        onClick={() =>
                            navigate("/reservations")
                        }
                    >
                        <div className="module-icon">
                            📅
                        </div>

                        <h3>Reservation</h3>

                        <p>
                            Create a table reservation
                        </p>
                    </div>

                    <div
                        className="dashboard-module"
                        onClick={() =>
                            navigate("/kitchen")
                        }
                    >
                        <div className="module-icon">
                            👨‍🍳
                        </div>

                        <h3>Kitchen</h3>

                        <p>
                            View active kitchen orders
                        </p>
                    </div>

                    <div
                        className="dashboard-module"
                        onClick={() =>
                            navigate("/billing")
                        }
                    >
                        <div className="module-icon">
                            🧾
                        </div>

                        <h3>Billing</h3>

                        <p>
                            Generate customer invoice
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;