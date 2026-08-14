import { useEffect, useState } from "react";
import {
    getCategories,
    createCategory,
    updateCategory,
    deactivateCategory
} from "./api/categoryApi";

function App() {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");
    const [editingId, setEditingId] = useState(null);

    const loadCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    useEffect(() => {
    const loadData = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Error loading categories:", error);
        }
    };

    loadData();
}, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryName.trim()) {
            alert("Category name is required");
            return;
        }

        try {
            if (editingId) {
                await updateCategory(editingId, {
                    categoryName,
                    description
                });
            } else {
                await createCategory({
                    categoryName,
                    description
                });
            }

            setCategoryName("");
            setDescription("");
            setEditingId(null);
            loadCategories();
        } catch (error) {
            console.error("Error saving category:", error);
            alert("Unable to save category");
        }
    };

    const handleEdit = (category) => {
        setEditingId(category.categoryId);
        setCategoryName(category.categoryName);
        setDescription(category.description || "");
    };

    const handleDeactivate = async (id) => {
        if (!window.confirm("Are you sure you want to deactivate this category?")) {
            return;
        }

        try {
            await deactivateCategory(id);
            loadCategories();
        } catch (error) {
            console.error("Error deactivating category:", error);
            alert("Unable to deactivate category");
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setCategoryName("");
        setDescription("");
    };

    return (
        <div className="app">
            <header className="navbar">
                <h1>E-Commerce Admin</h1>
                <span>Category Management</span>
            </header>

            <main className="container">
                <section className="form-card">
                    <h2>{editingId ? "Update Category" : "Create Category"}</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Category Name</label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Enter category name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter category description"
                                rows="4"
                            />
                        </div>

                        <div className="form-actions">
                            <button type="submit">
                                {editingId ? "Update Category" : "Add Category"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="table-card">
                    <div className="table-header">
                        <div>
                            <h2>Categories</h2>
                            <p>Manage your product categories</p>
                        </div>

                        <span className="count">
                            {categories.length} Categories
                        </span>
                    </div>

                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Category Name</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty">
                                            No categories found
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.categoryId}>
                                            <td>{category.categoryId}</td>
                                            <td>{category.categoryName}</td>
                                            <td>{category.description}</td>
                                            <td>
                                                <span
                                                    className={
                                                        category.status
                                                            ? "status active"
                                                            : "status inactive"
                                                    }
                                                >
                                                    {category.status
                                                        ? "Active"
                                                        : "Inactive"}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        handleEdit(category)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                {category.status && (
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            handleDeactivate(
                                                                category.categoryId
                                                            )
                                                        }
                                                    >
                                                        Deactivate
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default App;