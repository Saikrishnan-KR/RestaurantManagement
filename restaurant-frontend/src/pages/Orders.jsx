import { useEffect, useState } from "react";
import api from "../services/api";

function Orders() {

    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);

    const [customerName, setCustomerName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const [message, setMessage] = useState("");

    useEffect(() => {
        loadMenu();
    }, []);

    const loadMenu = async () => {
        try {
            const response = await api.get("/menu");

            setMenuItems(
                response.data.filter(item => item.available)
            );

        } catch (error) {
            console.error(error);
            setMessage("Unable to load menu.");
        }
    };

    const addToCart = (item) => {

        const existing = cart.find(
            cartItem => cartItem.menuItemId === item.id
        );

        if (existing) {

            setCart(
                cart.map(cartItem =>
                    cartItem.menuItemId === item.id
                        ? {
                            ...cartItem,
                            quantity: cartItem.quantity + 1,
                            subtotal:
                                (cartItem.quantity + 1)
                                * cartItem.unitPrice
                        }
                        : cartItem
                )
            );

        } else {

            setCart([
                ...cart,
                {
                    menuItemId: item.id,
                    itemName: item.name,
                    quantity: 1,
                    unitPrice: item.price,
                    subtotal: item.price
                }
            ]);
        }
    };

    const increaseQuantity = (id) => {

        setCart(
            cart.map(item =>
                item.menuItemId === id
                    ? {
                        ...item,
                        quantity: item.quantity + 1,
                        subtotal:
                            (item.quantity + 1)
                            * item.unitPrice
                    }
                    : item
            )
        );
    };

    const decreaseQuantity = (id) => {

        setCart(
            cart
                .map(item =>
                    item.menuItemId === id
                        ? {
                            ...item,
                            quantity: item.quantity - 1,
                            subtotal:
                                (item.quantity - 1)
                                * item.unitPrice
                        }
                        : item
                )
                .filter(item => item.quantity > 0)
        );
    };

    const removeItem = (id) => {

        setCart(
            cart.filter(
                item => item.menuItemId !== id
            )
        );
    };

    const subtotal = cart.reduce(
        (total, item) => total + item.subtotal,
        0
    );

    const tax = subtotal * 0.05;

    const grandTotal = subtotal + tax;

    const placeOrder = async () => {

        if (!customerName.trim()) {
            setMessage("Enter customer name.");
            return;
        }

        if (!phoneNumber.trim()) {
            setMessage("Enter phone number.");
            return;
        }

        if (cart.length === 0) {
            setMessage("Add at least one item to the cart.");
            return;
        }

        try {

            const orderResponse = await api.post("/orders", {
                customerName: customerName,
                phoneNumber: phoneNumber,
                totalAmount: grandTotal,
                status: "PENDING"
            });

            const orderId = orderResponse.data.id;

            for (const item of cart) {

                await api.post("/order-items", {
                    orderId: orderId,
                    menuItemId: item.menuItemId,
                    itemName: item.itemName,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                });

            }

            setMessage(
                `Order #${orderId} placed successfully.`
            );

            setCart([]);
            setCustomerName("");
            setPhoneNumber("");

        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to place order."
            );
        }
    };

    return (

        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>Order Management</h1>
                    <p>Create customer orders</p>
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

            <div className="order-layout">

                {/* MENU */}

                <div className="order-menu">

                    <h2>Available Menu</h2>

                    <div className="food-grid">

                        {menuItems.map(item => (

                            <div
                                className="food-card"
                                key={item.id}
                            >

                                <div className="food-icon">
                                    🍽️
                                </div>

                                <h3>
                                    {item.name}
                                </h3>

                                <p>
                                    {item.category}
                                </p>

                                <strong>
                                    ₹{item.price}
                                </strong>

                                <button
                                    onClick={() =>
                                        addToCart(item)
                                    }
                                >
                                    + Add
                                </button>

                            </div>

                        ))}

                    </div>

                </div>

                {/* CART */}

                <div className="cart-card">

                    <h2>Customer Order</h2>

                    <input
                        type="text"
                        placeholder="Customer name"
                        value={customerName}
                        onChange={(e) =>
                            setCustomerName(e.target.value)
                        }
                    />

                    <input
                        type="tel"
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChange={(e) =>
                            setPhoneNumber(e.target.value)
                        }
                    />

                    <hr />

                    {cart.length === 0 ? (

                        <div className="empty">
                            Cart is empty.
                        </div>

                    ) : (

                        cart.map(item => (

                            <div
                                className="cart-item"
                                key={item.menuItemId}
                            >

                                <div>

                                    <strong>
                                        {item.itemName}
                                    </strong>

                                    <small>
                                        ₹{item.unitPrice}
                                    </small>

                                </div>

                                <div className="quantity">

                                    <button
                                        onClick={() =>
                                            decreaseQuantity(
                                                item.menuItemId
                                            )
                                        }
                                    >
                                        −
                                    </button>

                                    <span>
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            increaseQuantity(
                                                item.menuItemId
                                            )
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                                <strong>
                                    ₹{item.subtotal.toFixed(2)}
                                </strong>

                                <button
                                    className="remove-button"
                                    onClick={() =>
                                        removeItem(
                                            item.menuItemId
                                        )
                                    }
                                >
                                    ×
                                </button>

                            </div>

                        ))

                    )}

                    <div className="bill">

                        <div>
                            <span>Subtotal</span>
                            <strong>
                                ₹{subtotal.toFixed(2)}
                            </strong>
                        </div>

                        <div>
                            <span>Tax (5%)</span>
                            <strong>
                                ₹{tax.toFixed(2)}
                            </strong>
                        </div>

                        <div className="grand-total">
                            <span>Total</span>
                            <strong>
                                ₹{grandTotal.toFixed(2)}
                            </strong>
                        </div>

                    </div>

                    <button
                        className="place-order"
                        onClick={placeOrder}
                    >
                        Place Order
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Orders;