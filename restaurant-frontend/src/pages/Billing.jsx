import { useEffect, useState } from "react";
import api from "../services/api";

function Billing() {

    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [items, setItems] = useState([]);

    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [paymentStatus, setPaymentStatus] = useState("PAID");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {

        try {

            const response = await api.get("/orders");

            setOrders(response.data);

        } catch (error) {

            console.error(error);
            setMessage("Unable to load orders.");
        }
    };

    const selectOrder = async (order) => {

        try {

            const response =
                await api.get(`/order-items/order/${order.id}`);

            setSelectedOrder(order);
            setItems(response.data);

        } catch (error) {

            console.error(error);
            setMessage("Unable to load order items.");
        }
    };

    const subtotal = items.reduce(
        (total, item) =>
            total + Number(item.subtotal),
        0
    );

    const gst = subtotal * 0.05;

    const grandTotal = subtotal + gst;

    const printInvoice = () => {
        window.print();
    };

    return (

        <div className="page-container">

            <div className="page-header no-print">

                <div>
                    <h1>Billing & Invoice</h1>
                    <p>
                        Generate customer bills
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
                <div className="message no-print">
                    {message}
                </div>
            )}

            <div className="billing-layout">

                {/* ORDER LIST */}

                <div className="billing-orders no-print">

                    <h2>Orders</h2>

                    {orders.length === 0 ? (

                        <div className="empty">
                            No orders found.
                        </div>

                    ) : (

                        orders.map(order => (

                            <div
                                key={order.id}
                                className={`billing-order ${
                                    selectedOrder?.id === order.id
                                        ? "selected-order"
                                        : ""
                                }`}
                                onClick={() =>
                                    selectOrder(order)
                                }
                            >

                                <div>

                                    <strong>
                                        Order #{order.id}
                                    </strong>

                                    <p>
                                        {order.customerName}
                                    </p>

                                </div>

                                <div>

                                    <strong>
                                        ₹{order.totalAmount}
                                    </strong>

                                    <small>
                                        {order.status}
                                    </small>

                                </div>

                            </div>

                        ))

                    )}

                </div>

                {/* INVOICE */}

                <div className="invoice-card">

                    {!selectedOrder ? (

                        <div className="empty invoice-empty">
                            <div className="invoice-icon">
                                🧾
                            </div>

                            <h2>
                                Select an order
                            </h2>

                            <p>
                                Choose an order to generate
                                its invoice.
                            </p>
                        </div>

                    ) : (

                        <>

                            <div className="invoice-header">

                                <div>

                                    <h1>
                                        RESTAURANT
                                    </h1>

                                    <p>
                                        Restaurant Management System
                                    </p>

                                </div>

                                <div>
                                    <strong>
                                        INVOICE
                                    </strong>

                                    <p>
                                        #{selectedOrder.id}
                                    </p>
                                </div>

                            </div>

                            <hr />

                            <div className="customer-details">

                                <div>
                                    <strong>
                                        Customer
                                    </strong>

                                    <p>
                                        {selectedOrder.customerName}
                                    </p>

                                    <p>
                                        {selectedOrder.phoneNumber}
                                    </p>
                                </div>

                                <div>
                                    <strong>
                                        Order Date
                                    </strong>

                                    <p>
                                        {selectedOrder.orderDate
                                            ? new Date(
                                                selectedOrder.orderDate
                                            ).toLocaleString()
                                            : "-"
                                        }
                                    </p>
                                </div>

                            </div>

                            <table className="invoice-table">

                                <thead>

                                    <tr>
                                        <th>Item</th>
                                        <th>Qty</th>
                                        <th>Price</th>
                                        <th>Total</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {items.map(item => (

                                        <tr key={item.id}>

                                            <td>
                                                {item.itemName}
                                            </td>

                                            <td>
                                                {item.quantity}
                                            </td>

                                            <td>
                                                ₹{item.unitPrice}
                                            </td>

                                            <td>
                                                ₹{item.subtotal}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                            <div className="invoice-total">

                                <div>
                                    <span>
                                        Subtotal
                                    </span>

                                    <strong>
                                        ₹{subtotal.toFixed(2)}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        GST (5%)
                                    </span>

                                    <strong>
                                        ₹{gst.toFixed(2)}
                                    </strong>
                                </div>

                                <div className="invoice-grand-total">

                                    <span>
                                        Grand Total
                                    </span>

                                    <strong>
                                        ₹{grandTotal.toFixed(2)}
                                    </strong>

                                </div>

                            </div>

                            <div className="payment-section no-print">

                                <h3>
                                    Payment
                                </h3>

                                <select
                                    value={paymentMethod}
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="CASH">
                                        Cash
                                    </option>

                                    <option value="UPI">
                                        UPI
                                    </option>

                                    <option value="CARD">
                                        Card
                                    </option>

                                </select>

                                <select
                                    value={paymentStatus}
                                    onChange={(e) =>
                                        setPaymentStatus(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="PAID">
                                        Paid
                                    </option>

                                    <option value="PENDING">
                                        Pending
                                    </option>

                                </select>

                            </div>

                            <div className="invoice-footer">

                                <p>
                                    Payment Method:
                                    {" "}
                                    <strong>
                                        {paymentMethod}
                                    </strong>
                                </p>

                                <p>
                                    Payment Status:
                                    {" "}
                                    <strong>
                                        {paymentStatus}
                                    </strong>
                                </p>

                                <button
                                    className="print-button no-print"
                                    onClick={printInvoice}
                                >
                                    🖨️ Print Invoice
                                </button>

                            </div>

                        </>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Billing;