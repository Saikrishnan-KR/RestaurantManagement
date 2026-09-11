import { useEffect, useState } from "react";
import api from "../services/api";

function Reservations() {

    const [reservations, setReservations] = useState([]);

    const [form, setForm] = useState({
        customerName: "",
        phoneNumber: "",
        tableNumber: "",
        reservationDate: "",
        reservationTime: "",
        numberOfGuests: "",
        status: "CONFIRMED"
    });

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    const loadReservations = async () => {
        try {
            const response = await api.get("/reservations");
            setReservations(response.data);
        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to backend.");
        }
    };

    useEffect(() => {
        loadReservations();
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
                numberOfGuests: Number(form.numberOfGuests)
            };

            if (editingId) {

                await api.put(`/reservations/${editingId}`, data);

                setMessage("Reservation updated successfully.");

            } else {

                await api.post("/reservations", data);

                setMessage("Reservation created successfully.");
            }

            resetForm();
            loadReservations();

        } catch (error) {

            console.error(error);

            if (error.response?.data?.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage("Reservation operation failed.");
            }
        }
    };

    const editReservation = (reservation) => {

        setForm({
            customerName: reservation.customerName,
            phoneNumber: reservation.phoneNumber,
            tableNumber: reservation.tableNumber,
            reservationDate: reservation.reservationDate,
            reservationTime: reservation.reservationTime?.substring(0, 5),
            numberOfGuests: reservation.numberOfGuests,
            status: reservation.status
        });

        setEditingId(reservation.id);
    };

    const deleteReservation = async (id) => {

        if (!window.confirm("Delete this reservation?")) {
            return;
        }

        try {

            await api.delete(`/reservations/${id}`);

            setMessage("Reservation deleted successfully.");

            loadReservations();

        } catch (error) {

            console.error(error);
            setMessage("Delete failed.");
        }
    };

    const resetForm = () => {

        setEditingId(null);

        setForm({
            customerName: "",
            phoneNumber: "",
            tableNumber: "",
            reservationDate: "",
            reservationTime: "",
            numberOfGuests: "",
            status: "CONFIRMED"
        });
    };

    return (

        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>Reservations</h1>
                    <p>Manage customer table reservations</p>
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
                            ? "Edit Reservation"
                            : "New Reservation"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <label>Customer Name</label>

                        <input
                            type="text"
                            name="customerName"
                            placeholder="Customer name"
                            value={form.customerName}
                            onChange={handleChange}
                            required
                        />

                        <label>Phone Number</label>

                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="9876543210"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            required
                        />

                        <label>Table Number</label>

                        <input
                            type="number"
                            name="tableNumber"
                            min="1"
                            value={form.tableNumber}
                            onChange={handleChange}
                            required
                        />

                        <label>Reservation Date</label>

                        <input
                            type="date"
                            name="reservationDate"
                            value={form.reservationDate}
                            onChange={handleChange}
                            required
                        />

                        <label>Reservation Time</label>

                        <input
                            type="time"
                            name="reservationTime"
                            value={form.reservationTime}
                            onChange={handleChange}
                            required
                        />

                        <label>Number of Guests</label>

                        <input
                            type="number"
                            name="numberOfGuests"
                            min="1"
                            value={form.numberOfGuests}
                            onChange={handleChange}
                            required
                        />

                        <label>Status</label>

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >
                            <option value="CONFIRMED">
                                Confirmed
                            </option>

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="CANCELLED">
                                Cancelled
                            </option>

                            <option value="COMPLETED">
                                Completed
                            </option>
                        </select>

                        <button type="submit">

                            {editingId
                                ? "Update Reservation"
                                : "Create Reservation"}

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

                {/* RESERVATION LIST */}

                <div className="table-card">

                    <div className="table-title">

                        <h2>Reservations</h2>

                        <span>
                            {reservations.length} reservations
                        </span>

                    </div>

                    {reservations.length === 0 ? (

                        <div className="empty">
                            No reservations found.
                        </div>

                    ) : (

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Customer</th>
                                    <th>Table</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Guests</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>

                            </thead>

                            <tbody>

                                {reservations.map((reservation) => (

                                    <tr key={reservation.id}>

                                        <td>
                                            {reservation.id}
                                        </td>

                                        <td>
                                            <strong>
                                                {reservation.customerName}
                                            </strong>
                                            <br />
                                            <small>
                                                {reservation.phoneNumber}
                                            </small>
                                        </td>

                                        <td>
                                            Table {reservation.tableNumber}
                                        </td>

                                        <td>
                                            {reservation.reservationDate}
                                        </td>

                                        <td>
                                            {reservation.reservationTime}
                                        </td>

                                        <td>
                                            {reservation.numberOfGuests}
                                        </td>

                                        <td>

                                            <span
                                                className={`status ${
                                                    reservation.status === "CONFIRMED"
                                                        ? "available"
                                                        : reservation.status === "CANCELLED"
                                                            ? "unavailable"
                                                            : "reserved"
                                                }`}
                                            >
                                                {reservation.status}
                                            </span>

                                        </td>

                                        <td>

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    editReservation(
                                                        reservation
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    deleteReservation(
                                                        reservation.id
                                                    )
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

export default Reservations;