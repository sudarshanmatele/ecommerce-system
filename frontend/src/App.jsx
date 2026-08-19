import { useEffect, useState } from "react";

import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deactivateCustomer
} from "./api/customerApi";

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

import {
    getOrders,
    getOrdersByStatus,
    createOrder,
    updateOrderStatus,
    cancelOrder
} from "./api/orderApi";


function App() {

    const [activePage, setActivePage] = useState("categories");

    // ============================================================
    // CATEGORY STATE
    // ============================================================

    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [loadingCategories, setLoadingCategories] = useState(false);


    // ============================================================
    // PRODUCT STATE
    // ============================================================

    const [products, setProducts] = useState([]);

    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productSku, setProductSku] = useState("");
    const [productCategoryId, setProductCategoryId] = useState("");
    const [productInventory, setProductInventory] = useState("");

    const [editingProductId, setEditingProductId] = useState(null);
    const [loadingProducts, setLoadingProducts] = useState(false);


    // ============================================================
    // ORDER STATE
    // ============================================================

    const [orders, setOrders] = useState([]);
    const [orderFilter, setOrderFilter] = useState("ALL");
    const [loadingOrders, setLoadingOrders] = useState(false);

    const [customerId, setCustomerId] = useState("");
    const [orderTotalAmount, setOrderTotalAmount] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [creatingOrder, setCreatingOrder] = useState(false);

    // ============================================================
    // CUSTOMER STATE
    // ============================================================

    const [customers, setCustomers] = useState([]);

    const [customerFirstName, setCustomerFirstName] = useState("");
    const [customerLastName, setCustomerLastName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    const [editingCustomerId, setEditingCustomerId] = useState(null);

    const [loadingCustomers, setLoadingCustomers] = useState(false);


    // ============================================================
    // LOAD CATEGORIES
    // ============================================================

    const loadCategories = async () => {

        try {

            setLoadingCategories(true);

            const response = await getCategories();

            setCategories(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error("Error loading categories:", error);

        } finally {

            setLoadingCategories(false);

        }

    };


    // ============================================================
    // LOAD PRODUCTS
    // ============================================================

    const loadProducts = async () => {

        try {

            setLoadingProducts(true);

            const response = await getProducts();

            setProducts(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error("Error loading products:", error);

            alert(
                error.response?.data?.message ||
                "Unable to load products"
            );

        } finally {

            setLoadingProducts(false);

        }

    };


    // ============================================================
    // LOAD ORDERS
    // ============================================================

    const loadOrders = async () => {

        try {

            setLoadingOrders(true);

            let response;

            if (orderFilter === "ALL") {

                response = await getOrders();

            } else {

                response = await getOrdersByStatus(orderFilter);

            }

            setOrders(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error("Error loading orders:", error);

            alert(
                error.response?.data?.message ||
                "Unable to load orders"
            );

        } finally {

            setLoadingOrders(false);

        }

    };


    // ============================================================
    // INITIAL CATEGORY LOAD
    // ============================================================

    useEffect(() => {

        let cancelled = false;

        const fetchCategories = async () => {

            try {

                const response = await getCategories();

                if (!cancelled) {

                    setCategories(
                        Array.isArray(response.data)
                            ? response.data
                            : []
                    );

                }

            } catch (error) {

                if (!cancelled) {

                    console.error(
                        "Error loading categories:",
                        error
                    );

                }

            }

        };

        fetchCategories();

        return () => {

            cancelled = true;

        };

    }, []);


    // ============================================================
    // LOAD PRODUCTS / ORDERS WHEN PAGE CHANGES
    // ============================================================

    useEffect(() => {

        let cancelled = false;

        const fetchPageData = async () => {

            if (activePage === "products") {

                try {

                    setLoadingProducts(true);

                    const response = await getProducts();

                    if (!cancelled) {

                        setProducts(
                            Array.isArray(response.data)
                                ? response.data
                                : []
                        );

                    }

                } catch (error) {

                    if (!cancelled) {

                        console.error(
                            "Error loading products:",
                            error
                        );

                    }

                } finally {

                    if (!cancelled) {

                        setLoadingProducts(false);

                    }

                }

            }


            if (activePage === "orders") {

                try {

                    setLoadingOrders(true);

                    let response;

                    if (orderFilter === "ALL") {

                        response = await getOrders();

                    } else {

                        response =
                            await getOrdersByStatus(
                                orderFilter
                            );

                    }

                    if (!cancelled) {

                        setOrders(
                            Array.isArray(response.data)
                                ? response.data
                                : []
                        );

                    }

                } catch (error) {

                    if (!cancelled) {

                        console.error(
                            "Error loading orders:",
                            error
                        );

                    }

                } finally {

                    if (!cancelled) {

                        setLoadingOrders(false);

                    }

                }

            }

            // ---------------- CUSTOMERS ----------------

        if (activePage === "customers") {

            try {

                setLoadingCustomers(true);

                const response = await getCustomers();

                if (!cancelled) {

                    setCustomers(
                        Array.isArray(response.data)
                            ? response.data
                            : []
                    );

                }

            } catch (error) {

                if (!cancelled) {

                    console.error(
                        "Error loading customers:",
                        error
                    );

                }

            } finally {

                if (!cancelled) {

                    setLoadingCustomers(false);

                }

            }

        }

        };

        fetchPageData();

        return () => {

            cancelled = true;

        };

    }, [activePage, orderFilter]);


    // ============================================================
    // CATEGORY SUBMIT
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
                        categoryName: categoryName.trim(),
                        description: categoryDescription.trim()
                    }
                );

            } else {

                await createCategory(
                    {
                        categoryName: categoryName.trim(),
                        description: categoryDescription.trim()
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

            alert(
                error.response?.data?.message ||
                "Unable to save category"
            );

        }

    };


    // ============================================================
    // CATEGORY EDIT
    // ============================================================

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


    // ============================================================
    // CATEGORY DEACTIVATE
    // ============================================================

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

            alert(
                error.response?.data?.message ||
                "Unable to deactivate category"
            );

        }

    };


    // ============================================================
    // CANCEL CATEGORY EDIT
    // ============================================================

    const cancelCategoryEdit = () => {

        setEditingCategoryId(null);
        setCategoryName("");
        setCategoryDescription("");

    };


    // ============================================================
    // RESET PRODUCT FORM
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


    // ============================================================
    // PRODUCT SUBMIT
    // ============================================================

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

        if (
            productPrice === "" ||
            Number(productPrice) <= 0
        ) {

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

            alert(
                error.response?.data?.message ||
                "Unable to save product"
            );

        }

    };


    // ============================================================
    // PRODUCT EDIT
    // ============================================================

    const handleProductEdit = (product) => {

        setEditingProductId(product.productId);

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


    // ============================================================
    // PRODUCT DEACTIVATE
    // ============================================================

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

            alert(
                error.response?.data?.message ||
                "Unable to deactivate product"
            );

        }

    };


    // ============================================================
    // RESET ORDER FORM
    // ============================================================

    const resetOrderForm = () => {

        setCustomerId("");
        setOrderTotalAmount("");
        setShippingAddress("");

    };


    // ============================================================
    // CREATE ORDER
    // ============================================================

    const handleOrderSubmit = async (e) => {

        e.preventDefault();

        if (!customerId || Number(customerId) <= 0) {

            alert("Customer ID must be greater than 0");
            return;

        }

        if (
            orderTotalAmount === "" ||
            Number(orderTotalAmount) <= 0
        ) {

            alert("Total amount must be greater than 0");
            return;

        }

        if (!shippingAddress.trim()) {

            alert("Shipping address is required");
            return;

        }

        const orderData = {

            customerId: Number(customerId),

            totalAmount: Number(orderTotalAmount),

            orderStatus: "Pending",

            shippingAddress: shippingAddress.trim()

        };


        try {

            setCreatingOrder(true);

            await createOrder(orderData);

            alert("Order created successfully");

            resetOrderForm();

            await loadOrders();

        } catch (error) {

            console.error(
                "Error creating order:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to create order"
            );

        } finally {

            setCreatingOrder(false);

        }

    };


    // ============================================================
    // ORDER STATUS UPDATE
    // ============================================================

    const handleOrderStatusUpdate = async (
        orderId,
        status
    ) => {

        try {

            await updateOrderStatus(
                orderId,
                status
            );

            await loadOrders();

        } catch (error) {

            console.error(
                "Error updating order status:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update order status"
            );

        }

    };


    // ============================================================
    // ORDER CANCEL
    // ============================================================

    const handleOrderCancel = async (order) => {

        const confirmed = window.confirm(
            `Are you sure you want to cancel order #${order.orderId}?`
        );

        if (!confirmed) {

            return;

        }

        try {

            await cancelOrder(
                order.orderId
            );

            await loadOrders();

        } catch (error) {

            console.error(
                "Error cancelling order:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to cancel order"
            );

        }

    };

    // ============================================================
    // CUSTOMER FUNCTIONS
    // ============================================================

    const loadCustomers = async () => {

        try {

            setLoadingCustomers(true);

            const response = await getCustomers();

            setCustomers(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Error loading customers:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to load customers"
            );

        } finally {

            setLoadingCustomers(false);

        }
    };


    const resetCustomerForm = () => {

        setCustomerFirstName("");
        setCustomerLastName("");
        setCustomerEmail("");
        setCustomerPhone("");

        setEditingCustomerId(null);

    };


    const handleCustomerSubmit = async (e) => {

        e.preventDefault();

        if (!customerFirstName.trim()) {

            alert("First name is required");
            return;

        }

        if (!customerLastName.trim()) {

            alert("Last name is required");
            return;

        }

        if (!customerEmail.trim()) {

            alert("Email is required");
            return;

        }

        if (!customerPhone.trim()) {

            alert("Phone number is required");
            return;

        }

        const customerData = {

            firstName: customerFirstName.trim(),

            lastName: customerLastName.trim(),

            email: customerEmail.trim(),

            phone: customerPhone.trim()

        };

        try {

            if (editingCustomerId) {

                await updateCustomer(
                    editingCustomerId,
                    customerData
                );

            } else {

                await createCustomer(
                    customerData
                );

            }

            resetCustomerForm();

            await loadCustomers();

        } catch (error) {

            console.error(
                "Error saving customer:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to save customer"
            );

        }

    };


    const handleCustomerEdit = (customer) => {

        setEditingCustomerId(
            customer.userId
        );

        setCustomerFirstName(
            customer.firstName || ""
        );

        setCustomerLastName(
            customer.lastName || ""
        );

        setCustomerEmail(
            customer.email || ""
        );

        setCustomerPhone(
            customer.phone || ""
        );

        setActivePage("customers");

    };


    const handleCustomerDeactivate = async (customer) => {

        const confirmed = window.confirm(
            `Are you sure you want to deactivate ${customer.firstName} ${customer.lastName}?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await deactivateCustomer(
                customer.userId
            );

            await loadCustomers();

        } catch (error) {

            console.error(
                "Error deactivating customer:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to deactivate customer"
            );

        }

    };


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <div className="app">

            {/* NAVBAR */}

            <header className="navbar">

                <h1>
                    E-Commerce Admin
                </h1>

                <div className="nav-buttons">

                    <button
                        onClick={() =>
                            setActivePage("categories")
                        }
                        className={
                            activePage === "categories"
                                ? "nav-btn active"
                                : "nav-btn"
                        }
                    >
                        Categories
                    </button>

                    <button
                        onClick={() =>
                            setActivePage("products")
                        }
                        className={
                            activePage === "products"
                                ? "nav-btn active"
                                : "nav-btn"
                        }
                    >
                        Products
                    </button>

                    <button
                        onClick={() =>
                            setActivePage("orders")
                        }
                        className={
                            activePage === "orders"
                                ? "nav-btn active"
                                : "nav-btn"
                        }
                    >
                        Orders
                    </button>

                    <button
                        onClick={() =>
                            setActivePage("customers")
                        }
                        className={
                            activePage === "customers"
                                ? "nav-btn active"
                                : "nav-btn"
                        }
                    >
                        Customers
                    </button>

                </div>

            </header>


            <main className="container">


                {/* ==================================================
                    CATEGORY PAGE
                ================================================== */}

                {activePage === "categories" && (

                    <>

                        <section className="form-card">

                            <h2>
                                {
                                    editingCategoryId
                                        ? "Update Category"
                                        : "Create Category"
                                }
                            </h2>

                            <form
                                onSubmit={handleCategorySubmit}
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

                                        {
                                            editingCategoryId
                                                ? "Update Category"
                                                : "Add Category"
                                        }

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
                                                                {
                                                                    category.status
                                                                        ? "Active"
                                                                        : "Inactive"
                                                                }
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

                    </>

                )}


                {/* ==================================================
                    PRODUCT PAGE
                ================================================== */}

                {activePage === "products" && (

                    <>

                        <section className="form-card">

                            <h2>
                                {
                                    editingProductId
                                        ? "Update Product"
                                        : "Create Product"
                                }
                            </h2>

                            <form
                                onSubmit={handleProductSubmit}
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


                                <div className="form-row">

                                    <div className="form-group">

                                        <label>
                                            Price
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={
                                                productPrice
                                            }
                                            onChange={(e) =>
                                                setProductPrice(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter price"
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

                                </div>


                                <div className="form-row">

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
                                                        category.status
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
                                            min="0"
                                            value={
                                                productInventory
                                            }
                                            onChange={(e) =>
                                                setProductInventory(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter inventory"
                                        />

                                    </div>

                                </div>


                                <div className="form-actions">

                                    <button type="submit">

                                        {
                                            editingProductId
                                                ? "Update Product"
                                                : "Add Product"
                                        }

                                    </button>


                                    {editingProductId && (

                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={
                                                resetProductForm
                                            }
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

                                    <h2>
                                        Products
                                    </h2>

                                    <p>
                                        Manage your products and inventory
                                    </p>

                                </div>

                                <span className="count">
                                    {products.length} Products
                                </span>

                            </div>


                            <div className="table-container">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>ID</th>
                                            <th>Product</th>
                                            <th>SKU</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Inventory</th>
                                            <th>Status</th>
                                            <th>Actions</th>

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
                                                                product.category?.categoryName ||
                                                                `Category #${
                                                                    product.category?.categoryId ||
                                                                    "-"
                                                                }`
                                                            }
                                                        </td>

                                                        <td>
                                                            ₹
                                                            {
                                                                Number(
                                                                    product.price || 0
                                                                ).toFixed(2)
                                                            }
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
                                                                {
                                                                    product.status
                                                                        ? "Active"
                                                                        : "Inactive"
                                                                }
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

                    </>

                )}


                {/* ==================================================
                    ORDER PAGE
                ================================================== */}

                {activePage === "orders" && (

                    <>

                        {/* CREATE ORDER */}

                        <section className="form-card">

                            <h2>
                                Create Order
                            </h2>

                            <form
                                onSubmit={handleOrderSubmit}
                            >

                                <div className="form-row">

                                    <div className="form-group">

                                        <label>
                                            Customer ID
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            value={customerId}
                                            onChange={(e) =>
                                                setCustomerId(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter customer ID"
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Total Amount
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={
                                                orderTotalAmount
                                            }
                                            onChange={(e) =>
                                                setOrderTotalAmount(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter total amount"
                                        />

                                    </div>

                                </div>


                                <div className="form-group">

                                    <label>
                                        Shipping Address
                                    </label>

                                    <textarea
                                        value={
                                            shippingAddress
                                        }
                                        onChange={(e) =>
                                            setShippingAddress(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter shipping address"
                                        rows="4"
                                    />

                                </div>


                                <div className="form-actions">

                                    <button
                                        type="submit"
                                        disabled={
                                            creatingOrder
                                        }
                                    >

                                        {
                                            creatingOrder
                                                ? "Creating..."
                                                : "Place Order"
                                        }

                                    </button>


                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={
                                            resetOrderForm
                                        }
                                    >
                                        Clear
                                    </button>

                                </div>

                            </form>

                        </section>


                        {/* ORDER DASHBOARD */}

                        <section className="table-card">

                            <div className="table-header">

                                <div>

                                    <h2>
                                        Orders
                                    </h2>

                                    <p>
                                        Manage customer orders
                                    </p>

                                </div>


                                <div>

                                    <select
                                        value={orderFilter}
                                        onChange={(e) =>
                                            setOrderFilter(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="ALL">
                                            All Orders
                                        </option>

                                        <option value="PENDING">
                                            Pending
                                        </option>

                                        <option value="SHIPPED">
                                            Shipped
                                        </option>

                                        <option value="DELIVERED">
                                            Delivered
                                        </option>

                                        <option value="CANCELLED">
                                            Cancelled
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <div className="table-container">

                                {loadingOrders ? (

                                    <p className="empty">
                                        Loading orders...
                                    </p>

                                ) : orders.length === 0 ? (

                                    <p className="empty">
                                        No orders found
                                    </p>

                                ) : (

                                    <table>

                                        <thead>

                                            <tr>

                                                <th>
                                                    Order ID
                                                </th>

                                                <th>
                                                    Customer
                                                </th>

                                                <th>
                                                    Total
                                                </th>

                                                <th>
                                                    Shipping Address
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Created
                                                </th>

                                                <th>
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {orders.map(
                                                (order) => (

                                                    <tr
                                                        key={
                                                            order.orderId
                                                        }
                                                    >

                                                        <td>
                                                            #
                                                            {
                                                                order.orderId
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                order.customerId ??
                                                                "-"
                                                            }
                                                        </td>


                                                        <td>
                                                            ₹
                                                            {
                                                                Number(
                                                                    order.totalAmount || 0
                                                                ).toFixed(2)
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                order.shippingAddress ||
                                                                "-"
                                                            }
                                                        </td>


                                                        <td>

                                                            <span
                                                                className={
                                                                    String(
                                                                        order.orderStatus
                                                                    ).toUpperCase() ===
                                                                    "CANCELLED"
                                                                        ? "status inactive"
                                                                        : "status active"
                                                                }
                                                            >
                                                                {
                                                                    order.orderStatus
                                                                }
                                                            </span>

                                                        </td>


                                                        <td>
                                                            {
                                                                order.createdAt
                                                                    ? new Date(
                                                                        order.createdAt
                                                                    ).toLocaleString()
                                                                    : "-"
                                                            }
                                                        </td>


                                                        <td>

                                                            {
                                                                String(
                                                                    order.orderStatus
                                                                ).toUpperCase() !==
                                                                    "CANCELLED" && (

                                                                    <select
                                                                        value={
                                                                            order.orderStatus
                                                                        }
                                                                        onChange={(e) =>
                                                                            handleOrderStatusUpdate(
                                                                                order.orderId,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    >

                                                                        <option value="Pending">
                                                                            Pending
                                                                        </option>

                                                                        <option value="Shipped">
                                                                            Shipped
                                                                        </option>

                                                                        <option value="Delivered">
                                                                            Delivered
                                                                        </option>

                                                                        <option value="Cancelled">
                                                                            Cancelled
                                                                        </option>

                                                                    </select>

                                                                )
                                                            }


                                                            {
                                                                String(
                                                                    order.orderStatus
                                                                ).toUpperCase() !==
                                                                    "CANCELLED" &&
                                                                String(
                                                                    order.orderStatus
                                                                ).toUpperCase() !==
                                                                    "SHIPPED" && (

                                                                    <button
                                                                        className="delete-btn"
                                                                        onClick={() =>
                                                                            handleOrderCancel(
                                                                                order
                                                                            )
                                                                        }
                                                                    >
                                                                        Cancel
                                                                    </button>

                                                                )
                                                            }

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                )}

                            </div>

                        </section>

                    </>

                )}


                {/* ================================================== */}
                {/* CUSTOMER PAGE */}
                {/* ================================================== */}

                {activePage === "customers" && (

                    <>

                        <section className="form-card">

                            <h2>
                                {
                                    editingCustomerId
                                        ? "Update Customer"
                                        : "Add Customer"
                                }
                            </h2>

                            <form
                                onSubmit={handleCustomerSubmit}
                            >

                                <div className="form-row">

                                    <div className="form-group">

                                        <label>
                                            First Name
                                        </label>

                                        <input
                                            type="text"
                                            value={customerFirstName}
                                            onChange={(e) =>
                                                setCustomerFirstName(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter first name"
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Last Name
                                        </label>

                                        <input
                                            type="text"
                                            value={customerLastName}
                                            onChange={(e) =>
                                                setCustomerLastName(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter last name"
                                        />

                                    </div>

                                </div>


                                <div className="form-row">

                                    <div className="form-group">

                                        <label>
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            value={customerEmail}
                                            onChange={(e) =>
                                                setCustomerEmail(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter email"
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Phone
                                        </label>

                                        <input
                                            type="text"
                                            value={customerPhone}
                                            onChange={(e) =>
                                                setCustomerPhone(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter phone number"
                                            maxLength="15"
                                        />

                                    </div>

                                </div>


                                <div className="form-actions">

                                    <button type="submit">

                                        {
                                            editingCustomerId
                                                ? "Update Customer"
                                                : "Add Customer"
                                        }

                                    </button>


                                    {editingCustomerId && (

                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={resetCustomerForm}
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

                                    <h2>
                                        Customers
                                    </h2>

                                    <p>
                                        Manage customer accounts and details
                                    </p>

                                </div>


                                <span className="count">

                                    {customers.length} Customers

                                </span>

                            </div>


                            <div className="table-container">

                                {loadingCustomers ? (

                                    <p className="empty">
                                        Loading customers...
                                    </p>

                                ) : customers.length === 0 ? (

                                    <p className="empty">
                                        No customers found
                                    </p>

                                ) : (

                                    <table>

                                        <thead>

                                            <tr>

                                                <th>
                                                    ID
                                                </th>

                                                <th>
                                                    Customer
                                                </th>

                                                <th>
                                                    Email
                                                </th>

                                                <th>
                                                    Phone
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Created
                                                </th>

                                                <th>
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {customers.map(
                                                (customer) => (

                                                    <tr
                                                        key={
                                                            customer.userId
                                                        }
                                                    >

                                                        <td>
                                                            {
                                                                customer.userId
                                                            }
                                                        </td>


                                                        <td>

                                                            <strong>

                                                                {
                                                                    customer.firstName
                                                                }{" "}

                                                                {
                                                                    customer.lastName
                                                                }

                                                            </strong>

                                                        </td>


                                                        <td>
                                                            {
                                                                customer.email
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                customer.phone ||
                                                                "-"
                                                            }
                                                        </td>


                                                        <td>

                                                            <span
                                                                className={
                                                                    customer.status
                                                                        ? "status active"
                                                                        : "status inactive"
                                                                }
                                                            >

                                                                {
                                                                    customer.status
                                                                        ? "Active"
                                                                        : "Inactive"
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            {
                                                                customer.createdAt
                                                                    ? new Date(
                                                                        customer.createdAt
                                                                    ).toLocaleString()
                                                                    : "-"
                                                            }

                                                        </td>


                                                        <td>

                                                            <button
                                                                className="edit-btn"
                                                                onClick={() =>
                                                                    handleCustomerEdit(
                                                                        customer
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>


                                                            {customer.status && (

                                                                <button
                                                                    className="delete-btn"
                                                                    onClick={() =>
                                                                        handleCustomerDeactivate(
                                                                            customer
                                                                        )
                                                                    }
                                                                >
                                                                    Deactivate
                                                                </button>

                                                            )}

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                )}

                            </div>

                        </section>

                    </>

                )}


            </main>

        </div>

    );

}


export default App;