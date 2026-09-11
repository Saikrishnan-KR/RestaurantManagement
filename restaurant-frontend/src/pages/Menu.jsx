import { useEffect, useState } from "react";
import api from "../services/api";

function Menu() {

    const [menuItems, setMenuItems] = useState([]);
    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        available: true
    });

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    const loadMenu = async () => {
        try {
            const response = await api.get("/menu");
            setMenuItems(response.data);
        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to backend.");
        }
    };

    useEffect(() => {
        loadMenu();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const data = {
                ...form,
                price: Number(form.price)
            };

            if (editingId) {
                await api.put(`/menu/${editingId}`, data);
                setMessage("Menu item updated successfully.");
            } else {
                await api.post("/menu", data);
                setMessage("Menu item added successfully.");
            }

            setForm({
                name: "",
                category: "",
                price: "",
                available: true
            });

            setEditingId(null);

            loadMenu();

        } catch (error) {
            console.error(error);
            setMessage("Operation failed.");
        }
    };

    const editItem = (item) => {

        setForm({
            name: item.name,
            category: item.category,
            price: item.price,
            available: item.available
        });

        setEditingId(item.id);
    };

    const deleteItem = async (id) => {

        if (!window.confirm("Delete this menu item?")) {
            return;
        }

        try {
            await api.delete(`/menu/${id}`);

            setMessage("Menu item deleted.");

            loadMenu();

        } catch (error) {
            console.error(error);
            setMessage("Delete failed.");
        }
    };

    const cancelEdit = () => {

        setEditingId(null);

        setForm({
            name: "",
            category: "",
            price: "",
            available: true
        });
    };

    return (

        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>Menu Management</h1>
                    <p>Manage restaurant food items</p>
                </div>

                <button
                    onClick={() => window.history.back()}
                    className="back-button"
                >
                    ← Dashboard
                </button>

            </div>

            {message && (
                <div className="message">
                    {message}
                </div>
            )}

            <div className="menu-layout">

                {/* FORM */}

                <div className="form-card">

                    <h2>
                        {editingId
                            ? "Edit Menu Item"
                            : "Add Menu Item"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <label>Food Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Example: Chicken Biryani"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        <label>Category</label>

                        <input
                            type="text"
                            name="category"
                            placeholder="Example: Main Course"
                            value={form.category}
                            onChange={handleChange}
                            required
                        />

                        <label>Price (₹)</label>

                        <input
                            type="number"
                            name="price"
                            placeholder="Enter price"
                            min="0"
                            value={form.price}
                            onChange={handleChange}
                            required
                        />

                        <label className="checkbox-label">

                            <input
                                type="checkbox"
                                name="available"
                                checked={form.available}
                                onChange={handleChange}
                            />

                            Available

                        </label>

                        <button type="submit">
                            {editingId
                                ? "Update Item"
                                : "Add Item"}
                        </button>

                        {editingId && (

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>

                        )}

                    </form>

                </div>

                {/* MENU LIST */}

                <div className="table-card">

                    <div className="table-title">

                        <h2>Menu Items</h2>

                        <span>
                            {menuItems.length} items
                        </span>

                    </div>

                    {menuItems.length === 0 ? (

                        <div className="empty">
                            No menu items found.
                        </div>

                    ) : (

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>

                            </thead>

                            <tbody>

                                {menuItems.map((item) => (

                                    <tr key={item.id}>

                                        <td>{item.id}</td>

                                        <td>
                                            <strong>
                                                {item.name}
                                            </strong>
                                        </td>

                                        <td>
                                            {item.category}
                                        </td>

                                        <td>
                                            ₹{item.price}
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    item.available
                                                        ? "status available"
                                                        : "status unavailable"
                                                }
                                            >
                                                {item.available
                                                    ? "Available"
                                                    : "Unavailable"}
                                            </span>

                                        </td>

                                        <td>

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    editItem(item)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    deleteItem(item.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    )}

                </div>

            </div>

        </div>
    );
}

export default Menu;