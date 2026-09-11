import { useEffect, useState } from "react";
import api from "../services/api";

function Kitchen() {

    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState({});
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {

        try {

            const response =
                await api.get("/kitchen/orders");

            setOrders(response.data);

            for (const order of response.data) {
                loadOrderItems(order.id);
            }

        } catch (error) {

            console.error(error);
            setMessage("Unable to load kitchen orders.");
        }
    };

    const loadOrderItems = async (orderId) => {

        try {

            const response =
                await api.get(`/order-items/order/${orderId}`);

            setOrderItems(previous => ({
                ...previous,
                [orderId]: response.data
            }));

        } catch (error) {

            console.error(error);
        }
    };

    const updateStatus = async (id, status) => {

        try {

            await api.put(`/orders/${id}/status`, {
                status: status
            });

            setMessage(
                `Order #${id} moved to ${status}.`
            );

            loadOrders();

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to update order status."
            );
        }
    };

    const getStatusClass = (status) => {

        if (status === "PENDING") {
            return "pending";
        }

        if (status === "CONFIRMED") {
            return "confirmed";
        }

        if (status === "PREPARING") {
            return "preparing";
        }

        if (status === "READY") {
            return "ready";
        }

        return "completed";
    };

    return (

        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>Kitchen Dashboard</h1>
                    <p>
                        Monitor and prepare customer orders
                    </p>
                </div>

                <button
                    className="back-button"
                    onClick={() => window.history.back()}
                >
                    ← Dashboard
                </button>

            </div>

            {message && (
                <div className="message">
                    {message}
                </div>
            )}

            {orders.length === 0 ? (

                <div className="empty kitchen-empty">
                    <div className="kitchen-icon">
                        👨‍🍳
                    </div>

                    <h2>No active orders</h2>

                    <p>
                        New customer orders will appear here.
                    </p>
                </div>

            ) : (

                <div className="kitchen-grid">

                    {orders.map(order => (

                        <div
                            className="kitchen-order"
                            key={order.id}
                        >

                            <div className="order-header">

                                <div>
                                    <h2>
                                        Order #{order.id}
                                    </h2>

                                    <p>
                                        {order.customerName}
                                    </p>

                                    <small>
                                        {order.phoneNumber}
                                    </small>
                                </div>

                                <span
                                    className={`kitchen-status ${getStatusClass(order.status)}`}
                                >
                                    {order.status}
                                </span>

                            </div>

                            <hr />

                            <div className="kitchen-items">

                                <h3>Items</h3>

                                {(orderItems[order.id] || [])
                                    .map(item => (

                                        <div
                                            className="kitchen-item"
                                            key={item.id}
                                        >

                                            <span>
                                                <strong>
                                                    {item.quantity} ×
                                                </strong>{" "}
                                                {item.itemName}
                                            </span>

                                            <strong>
                                                ₹{item.subtotal}
                                            </strong>

                                        </div>

                                    ))}

                            </div>

                            <div className="kitchen-total">

                                <span>
                                    Order Total
                                </span>

                                <strong>
                                    ₹{order.totalAmount}
                                </strong>

                            </div>

                            <div className="kitchen-actions">

                                {order.status === "PENDING" && (

                                    <button
                                        className="confirm-button"
                                        onClick={() =>
                                            updateStatus(
                                                order.id,
                                                "CONFIRMED"
                                            )
                                        }
                                    >
                                        ✓ Confirm
                                    </button>

                                )}

                                {order.status === "CONFIRMED" && (

                                    <button
                                        className="prepare-button"
                                        onClick={() =>
                                            updateStatus(
                                                order.id,
                                                "PREPARING"
                                            )
                                        }
                                    >
                                        👨‍🍳 Start Preparing
                                    </button>

                                )}

                                {order.status === "PREPARING" && (

                                    <button
                                        className="ready-button"
                                        onClick={() =>
                                            updateStatus(
                                                order.id,
                                                "READY"
                                            )
                                        }
                                    >
                                        ✓ Mark Ready
                                    </button>

                                )}

                                {order.status === "READY" && (

                                    <button
                                        className="complete-button"
                                        onClick={() =>
                                            updateStatus(
                                                order.id,
                                                "COMPLETED"
                                            )
                                        }
                                    >
                                        ✓ Complete Order
                                    </button>

                                )}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Kitchen;