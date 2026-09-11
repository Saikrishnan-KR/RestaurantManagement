import { useEffect, useState } from "react";
import api from "../services/api";

function Tables() {

    const [tables, setTables] = useState([]);

    const [form, setForm] = useState({
        tableNumber: "",
        capacity: "",
        status: "AVAILABLE"
    });

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    const loadTables = async () => {
        try {
            const response = await api.get("/tables");
            setTables(response.data);
        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to backend.");
        }
    };

    useEffect(() => {
        loadTables();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const data = {
                ...form,
                tableNumber: Number(form.tableNumber),
                capacity: Number(form.capacity)
            };

            if (editingId) {
                await api.put(`/tables/${editingId}`, data);
                setMessage("Table updated successfully.");
            } else {
                await api.post("/tables", data);
                setMessage("Table added successfully.");
            }

            resetForm();
            loadTables();

        } catch (error) {
            console.error(error);
            setMessage("Operation failed.");
        }
    };

    const editTable = (table) => {

        setForm({
            tableNumber: table.tableNumber,
            capacity: table.capacity,
            status: table.status
        });

        setEditingId(table.id);
    };

    const deleteTable = async (id) => {

        if (!window.confirm("Delete this table?")) {
            return;
        }

        try {

            await api.delete(`/tables/${id}`);

            setMessage("Table deleted successfully.");

            loadTables();

        } catch (error) {
            console.error(error);
            setMessage("Delete failed.");
        }
    };

    const resetForm = () => {

        setEditingId(null);

        setForm({
            tableNumber: "",
            capacity: "",
            status: "AVAILABLE"
        });
    };

    return (

        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>Restaurant Tables</h1>
                    <p>Manage restaurant seating tables</p>
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

            <div className="menu-layout">

                {/* FORM */}

                <div className="form-card">

                    <h2>
                        {editingId
                            ? "Edit Table"
                            : "Add Table"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <label>Table Number</label>

                        <input
                            type="number"
                            name="tableNumber"
                            placeholder="Example: 1"
                            min="1"
                            value={form.tableNumber}
                            onChange={handleChange}
                            required
                        />

                        <label>Capacity</label>

                        <input
                            type="number"
                            name="capacity"
                            placeholder="Example: 4"
                            min="1"
                            value={form.capacity}
                            onChange={handleChange}
                            required
                        />

                        <label>Status</label>

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >
                            <option value="AVAILABLE">
                                Available
                            </option>

                            <option value="OCCUPIED">
                                Occupied
                            </option>

                            <option value="RESERVED">
                                Reserved
                            </option>
                        </select>

                        <button type="submit">

                            {editingId
                                ? "Update Table"
                                : "Add Table"}

                        </button>

                        {editingId && (

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                        )}

                    </form>

                </div>

                {/* TABLE LIST */}

                <div className="table-card">

                    <div className="table-title">

                        <h2>Restaurant Tables</h2>

                        <span>
                            {tables.length} tables
                        </span>

                    </div>

                    {tables.length === 0 ? (

                        <div className="empty">
                            No restaurant tables found.
                        </div>

                    ) : (

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Table</th>
                                    <th>Capacity</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>

                            </thead>

                            <tbody>

                                {tables.map((table) => (

                                    <tr key={table.id}>

                                        <td>
                                            {table.id}
                                        </td>

                                        <td>
                                            <strong>
                                                Table {table.tableNumber}
                                            </strong>
                                        </td>

                                        <td>
                                            {table.capacity} seats
                                        </td>

                                        <td>

                                            <span
                                                className={`status ${
                                                    table.status === "AVAILABLE"
                                                        ? "available"
                                                        : table.status === "OCCUPIED"
                                                            ? "occupied"
                                                            : "reserved"
                                                }`}
                                            >
                                                {table.status}
                                            </span>

                                        </td>

                                        <td>

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    editTable(table)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    deleteTable(table.id)
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

export default Tables;