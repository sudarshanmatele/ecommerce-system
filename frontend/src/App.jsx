import { useEffect, useState } from "react";

import {
    getCategories,
    createCategory,
    updateCategory,
    deactivateCategory
} from "./api/categoryApi";

import {
    getProducts,
    createProduct,
    updateProduct,
    deactivateProduct
} from "./api/productApi";


function App() {

    const [activePage, setActivePage] = useState("categories");

    // ================= CATEGORY STATE =================

    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    // ================= PRODUCT STATE =================

    const [products, setProducts] = useState([]);

    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productSku, setProductSku] = useState("");
    const [productCategoryId, setProductCategoryId] = useState("");
    const [productInventory, setProductInventory] = useState("");

    const [editingProductId, setEditingProductId] = useState(null);

    const [loadingProducts, setLoadingProducts] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);


    // ================= LOAD CATEGORIES =================

    const loadCategories = async () => {

        try {

            setLoadingCategories(true);

            const response = await getCategories();

            setCategories(response.data);

        } catch (error) {

            console.error("Error loading categories:", error);

        } finally {

            setLoadingCategories(false);

        }

    };


    // ================= LOAD PRODUCTS =================

    const loadProducts = async () => {

        try {

            setLoadingProducts(true);

            const response = await getProducts();

            setProducts(response.data);

        } catch (error) {

            console.error("Error loading products:", error);

        } finally {

            setLoadingProducts(false);

        }

    };


    // ================= INITIAL LOAD =================

    useEffect(() => {

        const loadInitialData = async () => {

            try {

                const categoryResponse = await getCategories();

                setCategories(categoryResponse.data);

            } catch (error) {

                console.error(
                    "Error loading categories:",
                    error
                );

            }

        };

        loadInitialData();

    }, []);


    // ================= LOAD PRODUCTS WHEN PAGE CHANGES =================

    useEffect(() => {

        if (activePage !== "products") {
            return;
        }

        const loadProductData = async () => {

            try {

                setLoadingProducts(true);

                const response = await getProducts();

                setProducts(response.data);

            } catch (error) {

                console.error(
                    "Error loading products:",
                    error
                );

            } finally {

                setLoadingProducts(false);

            }

        };

        loadProductData();

    }, [activePage]);


    // ============================================================
    // CATEGORY FUNCTIONS
    // ============================================================

    const handleCategorySubmit = async (e) => {

        e.preventDefault();

        if (!categoryName.trim()) {

            alert("Category name is required");

            return;

        }

        try {

            if (editingCategoryId) {

                await updateCategory(
                    editingCategoryId,
                    {
                        categoryName,
                        description: categoryDescription
                    }
                );

            } else {

                await createCategory(
                    {
                        categoryName,
                        description: categoryDescription
                    }
                );

            }

            setCategoryName("");
            setCategoryDescription("");
            setEditingCategoryId(null);

            await loadCategories();

        } catch (error) {

            console.error(
                "Error saving category:",
                error
            );

            alert("Unable to save category");

        }

    };


    const handleCategoryEdit = (category) => {

        setEditingCategoryId(category.categoryId);

        setCategoryName(
            category.categoryName || ""
        );

        setCategoryDescription(
            category.description || ""
        );

        setActivePage("categories");

    };


    const handleCategoryDeactivate = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to deactivate this category?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deactivateCategory(id);

            await loadCategories();

        } catch (error) {

            console.error(
                "Error deactivating category:",
                error
            );

            alert("Unable to deactivate category");

        }

    };


    const cancelCategoryEdit = () => {

        setEditingCategoryId(null);

        setCategoryName("");

        setCategoryDescription("");

    };


    // ============================================================
    // PRODUCT FUNCTIONS
    // ============================================================

    const resetProductForm = () => {

        setProductName("");
        setProductDescription("");
        setProductPrice("");
        setProductSku("");
        setProductCategoryId("");
        setProductInventory("");

        setEditingProductId(null);

    };


    const handleProductSubmit = async (e) => {

        e.preventDefault();

        if (!productName.trim()) {

            alert("Product name is required");

            return;

        }

        if (!productDescription.trim()) {

            alert("Product description is required");

            return;

        }

        if (!productPrice || Number(productPrice) <= 0) {

            alert("Price must be greater than 0");

            return;

        }

        if (!productSku.trim()) {

            alert("SKU is required");

            return;

        }

        if (!productCategoryId) {

            alert("Please select a category");

            return;

        }

        if (
            productInventory === "" ||
            Number(productInventory) < 0
        ) {

            alert("Inventory count cannot be negative");

            return;

        }


        const productData = {

            productName: productName.trim(),

            description: productDescription.trim(),

            price: Number(productPrice),

            sku: productSku.trim(),

            category: {
                categoryId: Number(productCategoryId)
            },

            inventoryCount: Number(productInventory)

        };


        try {

            if (editingProductId) {

                await updateProduct(
                    editingProductId,
                    productData
                );

            } else {

                await createProduct(productData);

            }

            resetProductForm();

            await loadProducts();

        } catch (error) {

            console.error(
                "Error saving product:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Unable to save product"
            );

        }

    };


    const handleProductEdit = (product) => {

        setEditingProductId(
            product.productId
        );

        setProductName(
            product.productName || ""
        );

        setProductDescription(
            product.description || ""
        );

        setProductPrice(
            product.price ?? ""
        );

        setProductSku(
            product.sku || ""
        );

        setProductCategoryId(
            product.category?.categoryId || ""
        );

        setProductInventory(
            product.inventoryCount ?? ""
        );

        setActivePage("products");

    };


    const handleProductDeactivate = async (product) => {

        const confirmed = window.confirm(
            `Are you sure you want to deactivate "${product.productName}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await deactivateProduct(
                product.productId
            );

            await loadProducts();

        } catch (error) {

            console.error(
                "Error deactivating product:",
                error
            );

            alert("Unable to deactivate product");

        }

    };


    const cancelProductEdit = () => {

        resetProductForm();

    };


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <div className="app">

            {/* ================= NAVBAR ================= */}

            <header className="navbar">

                <div>

                    <h1>
                        E-Commerce Admin
                    </h1>

                    <span>
                        Management System
                    </span>

                </div>


                <nav>

                    <button
                        className={
                            activePage === "categories"
                                ? "nav-btn active"
                                : "nav-btn"
                        }
                        onClick={() =>
                            setActivePage("categories")
                        }
                    >
                        Categories
                    </button>


                    <button
                        className={
                            activePage === "products"
                                ? "nav-btn active"
                                : "nav-btn"
                        }
                        onClick={() =>
                            setActivePage("products")
                        }
                    >
                        Products
                    </button>

                </nav>

            </header>


            {/* ====================================================
                CATEGORY PAGE
            ==================================================== */}

            {activePage === "categories" && (

                <main className="container">

                    {/* CATEGORY FORM */}

                    <section className="form-card">

                        <h2>
                            {editingCategoryId
                                ? "Update Category"
                                : "Create Category"}
                        </h2>


                        <form
                            onSubmit={
                                handleCategorySubmit
                            }
                        >

                            <div className="form-group">

                                <label>
                                    Category Name
                                </label>

                                <input
                                    type="text"
                                    value={categoryName}
                                    onChange={(e) =>
                                        setCategoryName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter category name"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    value={
                                        categoryDescription
                                    }
                                    onChange={(e) =>
                                        setCategoryDescription(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter category description"
                                    rows="4"
                                />

                            </div>


                            <div className="form-actions">

                                <button type="submit">

                                    {editingCategoryId
                                        ? "Update Category"
                                        : "Add Category"}

                                </button>


                                {editingCategoryId && (

                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={
                                            cancelCategoryEdit
                                        }
                                    >
                                        Cancel
                                    </button>

                                )}

                            </div>

                        </form>

                    </section>


                    {/* CATEGORY TABLE */}

                    <section className="table-card">

                        <div className="table-header">

                            <div>

                                <h2>
                                    Categories
                                </h2>

                                <p>
                                    Manage your product categories
                                </p>

                            </div>


                            <span className="count">

                                {categories.length}
                                {" "}
                                Categories

                            </span>

                        </div>


                        <div className="table-container">

                            <table>

                                <thead>

                                    <tr>

                                        <th>ID</th>

                                        <th>
                                            Category Name
                                        </th>

                                        <th>
                                            Description
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {loadingCategories ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="empty"
                                            >
                                                Loading categories...
                                            </td>

                                        </tr>

                                    ) : categories.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="empty"
                                            >
                                                No categories found
                                            </td>

                                        </tr>

                                    ) : (

                                        categories.map(
                                            (category) => (

                                                <tr
                                                    key={
                                                        category.categoryId
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            category.categoryId
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            category.categoryName
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            category.description
                                                        }
                                                    </td>


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
                                                                handleCategoryEdit(
                                                                    category
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                        {category.status && (

                                                            <button
                                                                className="delete-btn"
                                                                onClick={() =>
                                                                    handleCategoryDeactivate(
                                                                        category.categoryId
                                                                    )
                                                                }
                                                            >
                                                                Deactivate
                                                            </button>

                                                        )}

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </section>

                </main>

            )}


            {/* ====================================================
                PRODUCT PAGE
            ==================================================== */}

            {activePage === "products" && (

                <main className="container">

                    {/* PRODUCT FORM */}

                    <section className="form-card">

                        <h2>

                            {editingProductId
                                ? "Update Product"
                                : "Create Product"}

                        </h2>


                        <form
                            onSubmit={
                                handleProductSubmit
                            }
                        >

                            <div className="form-group">

                                <label>
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    value={productName}
                                    onChange={(e) =>
                                        setProductName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter product name"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    value={
                                        productDescription
                                    }
                                    onChange={(e) =>
                                        setProductDescription(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter product description"
                                    rows="4"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Price
                                </label>

                                <input
                                    type="number"
                                    value={productPrice}
                                    onChange={(e) =>
                                        setProductPrice(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter price"
                                    min="0"
                                    step="0.01"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    SKU
                                </label>

                                <input
                                    type="text"
                                    value={productSku}
                                    onChange={(e) =>
                                        setProductSku(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter SKU"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Category
                                </label>

                                <select
                                    value={
                                        productCategoryId
                                    }
                                    onChange={(e) =>
                                        setProductCategoryId(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Category
                                    </option>


                                    {categories
                                        .filter(
                                            (category) =>
                                                category.status === true
                                        )
                                        .map(
                                            (category) => (

                                                <option
                                                    key={
                                                        category.categoryId
                                                    }
                                                    value={
                                                        category.categoryId
                                                    }
                                                >

                                                    {
                                                        category.categoryName
                                                    }

                                                </option>

                                            )
                                        )}

                                </select>

                            </div>


                            <div className="form-group">

                                <label>
                                    Inventory Count
                                </label>

                                <input
                                    type="number"
                                    value={
                                        productInventory
                                    }
                                    onChange={(e) =>
                                        setProductInventory(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter inventory count"
                                    min="0"
                                />

                            </div>


                            <div className="form-actions">

                                <button type="submit">

                                    {editingProductId
                                        ? "Update Product"
                                        : "Add Product"}

                                </button>


                                {editingProductId && (

                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={
                                            cancelProductEdit
                                        }
                                    >
                                        Cancel
                                    </button>

                                )}

                            </div>

                        </form>

                    </section>


                    {/* PRODUCT TABLE */}

                    <section className="table-card">

                        <div className="table-header">

                            <div>

                                <h2>
                                    Products
                                </h2>

                                <p>
                                    Manage your products and inventory
                                </p>

                            </div>


                            <span className="count">

                                {products.length}
                                {" "}
                                Products

                            </span>

                        </div>


                        <div className="table-container">

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Product Name
                                        </th>

                                        <th>
                                            SKU
                                        </th>

                                        <th>
                                            Category
                                        </th>

                                        <th>
                                            Price
                                        </th>

                                        <th>
                                            Inventory
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {loadingProducts ? (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                className="empty"
                                            >
                                                Loading products...
                                            </td>

                                        </tr>

                                    ) : products.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                className="empty"
                                            >
                                                No products found
                                            </td>

                                        </tr>

                                    ) : (

                                        products.map(
                                            (product) => (

                                                <tr
                                                    key={
                                                        product.productId
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            product.productId
                                                        }
                                                    </td>


                                                    <td>

                                                        <strong>
                                                            {
                                                                product.productName
                                                            }
                                                        </strong>

                                                        <br />

                                                        <small>
                                                            {
                                                                product.description
                                                            }
                                                        </small>

                                                    </td>


                                                    <td>
                                                        {
                                                            product.sku
                                                        }
                                                    </td>


                                                    <td>

                                                        {
                                                            product.category
                                                                ?.categoryName ||
                                                            `Category #${product.category?.categoryId}`
                                                        }

                                                    </td>


                                                    <td>

                                                        ₹
                                                        {Number(
                                                            product.price
                                                        ).toFixed(2)}

                                                    </td>


                                                    <td>
                                                        {
                                                            product.inventoryCount
                                                        }
                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                product.status
                                                                    ? "status active"
                                                                    : "status inactive"
                                                            }
                                                        >

                                                            {product.status
                                                                ? "Active"
                                                                : "Inactive"}

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <button
                                                            className="edit-btn"
                                                            onClick={() =>
                                                                handleProductEdit(
                                                                    product
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                        {product.status && (

                                                            <button
                                                                className="delete-btn"
                                                                onClick={() =>
                                                                    handleProductDeactivate(
                                                                        product
                                                                    )
                                                                }
                                                            >
                                                                Deactivate
                                                            </button>

                                                        )}

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </section>

                </main>

            )}

        </div>

    );

}

export default App;