import { useEffect, useState } from "react";
import api from "../services/api";

function Categories() {

    const [categories, setCategories] = useState([]);

    const [form, setForm] = useState({
        name: "",
        description: ""
    });

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    const loadCategories = async () => {
        try {
            const response = await api.get("/categories");
            setCategories(response.data);
        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to backend.");
        }
    };

    useEffect(() => {
        loadCategories();
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

            if (editingId) {

                await api.put(`/categories/${editingId}`, form);

                setMessage("Category updated successfully.");

            } else {

                await api.post("/categories", form);

                setMessage("Category added successfully.");
            }

            setForm({
                name: "",
                description: ""
            });

            setEditingId(null);

            loadCategories();

        } catch (error) {
            console.error(error);
            setMessage("Operation failed.");
        }
    };

    const editCategory = (category) => {

        setForm({
            name: category.name,
            description: category.description
        });

        setEditingId(category.id);
    };

    const deleteCategory = async (id) => {

        if (!window.confirm("Delete this category?")) {
            return;
        }

        try {

            await api.delete(`/categories/${id}`);

            setMessage("Category deleted successfully.");

            loadCategories();

        } catch (error) {
            console.error(error);
            setMessage("Delete failed.");
        }
    };

    const cancelEdit = () => {

        setEditingId(null);

        setForm({
            name: "",
            description: ""
        });
    };

    return (

        <div className="page-container">

            <div className="page-header">

                <div>
                    <h1>Category Management</h1>
                    <p>Manage food categories</p>
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
                            ? "Edit Category"
                            : "Add Category"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <label>Category Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Example: Main Course"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        <label>Description</label>

                        <textarea
                            name="description"
                            placeholder="Category description"
                            value={form.description}
                            onChange={handleChange}
                            rows="4"
                        />

                        <button type="submit">

                            {editingId
                                ? "Update Category"
                                : "Add Category"}

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

                {/* CATEGORY LIST */}

                <div className="table-card">

                    <div className="table-title">

                        <h2>Categories</h2>

                        <span>
                            {categories.length} categories
                        </span>

                    </div>

                    {categories.length === 0 ? (

                        <div className="empty">
                            No categories found.
                        </div>

                    ) : (

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>

                            </thead>

                            <tbody>

                                {categories.map((category) => (

                                    <tr key={category.id}>

                                        <td>
                                            {category.id}
                                        </td>

                                        <td>
                                            <strong>
                                                {category.name}
                                            </strong>
                                        </td>

                                        <td>
                                            {category.description}
                                        </td>

                                        <td>

                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    editCategory(category)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    deleteCategory(
                                                        category.id
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

export default Categories;