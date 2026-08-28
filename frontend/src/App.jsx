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

import {
    getPayments,
    getPaymentsByStatus,
    createPayment,
    updatePaymentStatus,
    refundPayment
} from "./api/paymentApi";

import {
    getAllCartItems,
    getCartByCustomerId,
    addToCart,
    updateCartQuantity,
    removeCartItem
} from "./api/cartApi";

import {
    getAllWishlistItems,
    getWishlistByCustomerId,
    addToWishlist,
    removeWishlistItem,
    moveWishlistToCart
} from "./api/wishlistApi";


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
    // PAYMENT STATE
    // ============================================================

    const [payments, setPayments] = useState([]);

    const [paymentFilter, setPaymentFilter] = useState("ALL");

    const [paymentOrderId, setPaymentOrderId] = useState("");

    const [paymentAmount, setPaymentAmount] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("");

    const [creatingPayment, setCreatingPayment] = useState(false);

    const [loadingPayments, setLoadingPayments] = useState(false);

    // ============================================================
    // CART STATE
    // ============================================================

    const [cartItems, setCartItems] = useState([]);

    const [cartCustomerId, setCartCustomerId] = useState("");

    const [cartProductId, setCartProductId] = useState("");

    const [cartQuantity, setCartQuantity] = useState(1);

    const [cartCustomerFilter, setCartCustomerFilter] = useState("ALL");

    const [loadingCart, setLoadingCart] = useState(false);

    const [addingToCart, setAddingToCart] = useState(false);

    // ============================================================
    // WISHLIST STATE
    // ============================================================

    const [wishlistItems, setWishlistItems] = useState([]);

    const [wishlistCustomerId, setWishlistCustomerId] = useState("");

    const [wishlistProductId, setWishlistProductId] = useState("");

    const [wishlistCustomerFilter, setWishlistCustomerFilter] =
        useState("ALL");

    const [loadingWishlist, setLoadingWishlist] =
        useState(false);

    const [addingToWishlist, setAddingToWishlist] =
        useState(false);

    const [moveQuantity] = useState(1);


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

            if (activePage === "products" || activePage === "wishlist") {

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

        if (activePage === "customers" || activePage === "wishlist") {

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

        if (activePage === "payments") {

        try {

            setLoadingPayments(true);

            let response;

            if (paymentFilter === "ALL") {

                response = await getPayments();

            } else {

                response = await getPaymentsByStatus(
                    paymentFilter
                );

            }

            if (!cancelled) {

                setPayments(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            }

        } catch (error) {

            if (!cancelled) {

                console.error(
                    "Error loading payments:",
                    error
                );

            }

        } finally {

            if (!cancelled) {

                setLoadingPayments(false);

            }

        }

    }



        };

        fetchPageData();

        return () => {

            cancelled = true;

        };

    }, [activePage, orderFilter, paymentFilter]);


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
    // PAYMENT FUNCTIONS
    // ============================================================

    const loadPayments = async () => {

        try {

            setLoadingPayments(true);

            let response;

            if (paymentFilter === "ALL") {

                response = await getPayments();

            } else {

                response = await getPaymentsByStatus(
                    paymentFilter
                );

            }

            setPayments(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Error loading payments:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to load payments"
            );

        } finally {

            setLoadingPayments(false);

        }

    };


    const resetPaymentForm = () => {

        setPaymentOrderId("");

        setPaymentAmount("");

        setPaymentMethod("");

    };


    const handlePaymentSubmit = async (e) => {

        e.preventDefault();

        if (
            !paymentOrderId ||
            Number(paymentOrderId) <= 0
        ) {

            alert("Order ID must be greater than 0");

            return;

        }

        if (
            paymentAmount === "" ||
            Number(paymentAmount) <= 0
        ) {

            alert("Amount must be greater than 0");

            return;

        }

        if (!paymentMethod) {

            alert("Please select a payment method");

            return;

        }

        const paymentData = {

            orderId: Number(paymentOrderId),

            amount: Number(paymentAmount),

            paymentMethod: paymentMethod,

            paymentStatus: "Paid"

        };

        try {

            setCreatingPayment(true);

            await createPayment(paymentData);

            alert("Payment created successfully");

            resetPaymentForm();

            await loadPayments();

        } catch (error) {

            console.error(
                "Error creating payment:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to create payment"
            );

        } finally {

            setCreatingPayment(false);

        }

    };


    const handlePaymentStatusUpdate = async (
        paymentId,
        paymentStatus
    ) => {

        try {

            await updatePaymentStatus(
                paymentId,
                paymentStatus
            );

            await loadPayments();

        } catch (error) {

            console.error(
                "Error updating payment status:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update payment status"
            );

        }

    };


    const handleRefundPayment = async (payment) => {

        const confirmed = window.confirm(
            `Are you sure you want to refund payment #${payment.paymentId}?`
        );

        if (!confirmed) {

            return;

        }

        try {

            await refundPayment(
                payment.paymentId
            );

            await loadPayments();

        } catch (error) {

            console.error(
                "Error refunding payment:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to refund payment"
            );

        }

    };

    // ============================================================
    // CART FUNCTIONS
    // ============================================================

    const loadCartItems = async () => {

        try {

            setLoadingCart(true);

            let response;

            if (
                cartCustomerFilter === "ALL" ||
                cartCustomerFilter === ""
            ) {

                response = await getAllCartItems();

            } else {

                response = await getCartByCustomerId(
                    Number(cartCustomerFilter)
                );

            }

            setCartItems(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Error loading cart items:",
                error
            );

            setCartItems([]);

        } finally {

            setLoadingCart(false);

        }

    };


    const resetCartForm = () => {

        setCartCustomerId("");

        setCartProductId("");

        setCartQuantity(1);

    };


    const handleAddToCart = async (e) => {

        e.preventDefault();

        if (
            !cartCustomerId ||
            Number(cartCustomerId) <= 0
        ) {

            alert("Please select a customer");

            return;

        }

        if (
            !cartProductId ||
            Number(cartProductId) <= 0
        ) {

            alert("Please select a product");

            return;

        }

        if (
            !cartQuantity ||
            Number(cartQuantity) <= 0
        ) {

            alert(
                "Quantity must be greater than 0"
            );

            return;

        }

        try {

            setAddingToCart(true);

            await addToCart(
                Number(cartCustomerId),
                Number(cartProductId),
                Number(cartQuantity)
            );

            alert(
                "Product added to cart successfully"
            );

            resetCartForm();

            await loadCartItems();

        } catch (error) {

            console.error(
                "Error adding product to cart:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to add product to cart"
            );

        } finally {

            setAddingToCart(false);

        }

    };


    const handleUpdateCartQuantity = async (
        cartId,
        quantity
    ) => {

        if (
            !quantity ||
            Number(quantity) <= 0
        ) {

            alert(
                "Quantity must be greater than 0"
            );

            return;

        }

        try {

            await updateCartQuantity(
                cartId,
                Number(quantity)
            );

            await loadCartItems();

        } catch (error) {

            console.error(
                "Error updating cart quantity:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to update cart quantity"
            );

        }

    };


    const handleRemoveCartItem = async (
        cartId
    ) => {

        const confirmed = window.confirm(
            "Are you sure you want to remove this item from the cart?"
        );

        if (!confirmed) {

            return;

        }

        try {

            await removeCartItem(cartId);

            alert(
                "Cart item removed successfully"
            );

            await loadCartItems();

        } catch (error) {

            console.error(
                "Error removing cart item:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to remove cart item"
            );

        }

    };

    useEffect(() => {

    const loadCartData = async () => {

        try {

            await Promise.all([
                loadCustomers(),
                loadProducts()
            ]);

        } catch (error) {

            console.error(
                "Error loading cart data:",
                error
            );

        }

    };


    if (activePage === "cart") {

        loadCartData();

    }

    }, [activePage]);

    // ============================================================
    // WISHLIST FUNCTIONS
    // ============================================================

    const loadWishlistItems = async () => {

        try {

            setLoadingWishlist(true);

            let response;

            if (
                wishlistCustomerFilter === "ALL" ||
                wishlistCustomerFilter === ""
            ) {

                response =
                    await getAllWishlistItems();

            } else {

                response =
                    await getWishlistByCustomerId(
                        Number(wishlistCustomerFilter)
                    );

            }

            setWishlistItems(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Error loading wishlist:",
                error
            );

            setWishlistItems([]);

        } finally {

            setLoadingWishlist(false);

        }

    };


    const resetWishlistForm = () => {

        setWishlistCustomerId("");

        setWishlistProductId("");

    };


    const handleAddToWishlist = async (e) => {

        e.preventDefault();

        if (!wishlistCustomerId) {

            alert("Please select a customer");

            return;

        }

        if (!wishlistProductId) {

            alert("Please select a product");

            return;

        }

        try {

            setAddingToWishlist(true);

            await addToWishlist(
                Number(wishlistCustomerId),
                Number(wishlistProductId)
            );

            alert(
                "Product added to wishlist successfully"
            );

            resetWishlistForm();

            await loadWishlistItems();

        } catch (error) {

            console.error(
                "Error adding to wishlist:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to add product to wishlist"
            );

        } finally {

            setAddingToWishlist(false);

        }

    };


    const handleRemoveWishlistItem = async (
        wishlistId
    ) => {

        const confirmed = window.confirm(
            "Are you sure you want to remove this item from the wishlist?"
        );

        if (!confirmed) {

            return;

        }

        try {

            await removeWishlistItem(wishlistId);

            alert(
                "Wishlist item removed successfully"
            );

            await loadWishlistItems();

        } catch (error) {

            console.error(
                "Error removing wishlist item:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to remove wishlist item"
            );

        }

    };


    const handleMoveToCart = async (
        wishlistId
    ) => {

        const quantity = window.prompt(
            "Enter quantity to move to cart:",
            moveQuantity
        );

        if (
            quantity === null
        ) {

            return;

        }

        if (
            !quantity ||
            Number(quantity) <= 0
        ) {

            alert(
                "Quantity must be greater than 0"
            );

            return;

        }

        try {

            await moveWishlistToCart(
                wishlistId,
                Number(quantity)
            );

            alert(
                "Product moved to cart successfully"
            );

            await loadWishlistItems();

        } catch (error) {

            console.error(
                "Error moving product to cart:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to move product to cart"
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

                    <button
                    onClick={() =>
                        setActivePage("payments")
                    }
                    className={
                        activePage === "payments"
                            ? "nav-btn active"
                            : "nav-btn"
                    }
                >
                    Payments
                </button>

                <button
                onClick={() =>
                    setActivePage("wishlist")
                }
                className={
                    activePage === "wishlist"
                        ? "nav-btn active"
                        : "nav-btn"
                }
            >
                Wishlist
            </button>

                <button
                onClick={async () => {

                    setActivePage("cart");

                    try {

                        await Promise.all([
                            loadCustomers(),
                            loadProducts()
                        ]);

                    } catch (error) {

                        console.error(
                            "Error loading Cart data:",
                            error
                        );

                    }

                }}
                className={
                    activePage === "cart"
                        ? "nav-btn active"
                        : "nav-btn"
                }
            >
                Cart
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

                {activePage === "payments" && (

                <>

                    {/* CREATE PAYMENT */}

                    <section className="form-card">

                        <h2>
                            Create Payment
                        </h2>

                        <form onSubmit={handlePaymentSubmit}>

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Order ID
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        value={paymentOrderId}
                                        onChange={(e) =>
                                            setPaymentOrderId(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter order ID"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Amount
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={paymentAmount}
                                        onChange={(e) =>
                                            setPaymentAmount(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter payment amount"
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label>
                                    Payment Method
                                </label>

                                <select
                                    value={paymentMethod}
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Payment Method
                                    </option>

                                    <option value="Credit Card">
                                        Credit Card
                                    </option>

                                    <option value="Debit Card">
                                        Debit Card
                                    </option>

                                    <option value="UPI">
                                        UPI
                                    </option>

                                    <option value="PayPal">
                                        PayPal
                                    </option>

                                    <option value="Bank Transfer">
                                        Bank Transfer
                                    </option>

                                </select>

                            </div>


                            <div className="form-actions">

                                <button
                                    type="submit"
                                    disabled={creatingPayment}
                                >

                                    {
                                        creatingPayment
                                            ? "Processing..."
                                            : "Process Payment"
                                    }

                                </button>


                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={resetPaymentForm}
                                >
                                    Clear
                                </button>

                            </div>

                        </form>

                    </section>


                    {/* PAYMENT DASHBOARD */}

                    <section className="table-card">

                        <div className="table-header">

                            <div>

                                <h2>
                                    Payments
                                </h2>

                                <p>
                                    Manage payment transactions
                                </p>

                            </div>


                            <div>

                                <select
                                    value={paymentFilter}
                                    onChange={(e) =>
                                        setPaymentFilter(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="ALL">
                                        All Payments
                                    </option>

                                    <option value="Paid">
                                        Paid
                                    </option>

                                    <option value="Failed">
                                        Failed
                                    </option>

                                    <option value="Refunded">
                                        Refunded
                                    </option>

                                </select>

                            </div>

                        </div>


                        <div className="table-container">

                            {loadingPayments ? (

                                <p className="empty">
                                    Loading payments...
                                </p>

                            ) : payments.length === 0 ? (

                                <p className="empty">
                                    No payments found
                                </p>

                            ) : (

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Payment ID
                                            </th>

                                            <th>
                                                Order ID
                                            </th>

                                            <th>
                                                Amount
                                            </th>

                                            <th>
                                                Payment Method
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

                                        {payments.map(
                                            (payment) => (

                                                <tr
                                                    key={
                                                        payment.paymentId
                                                    }
                                                >

                                                    <td>
                                                        #
                                                        {
                                                            payment.paymentId
                                                        }
                                                    </td>


                                                    <td>
                                                        #
                                                        {
                                                            payment.orderId
                                                        }
                                                    </td>


                                                    <td>
                                                        ₹
                                                        {
                                                            Number(
                                                                payment.amount || 0
                                                            ).toFixed(2)
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            payment.paymentMethod
                                                        }
                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                String(
                                                                    payment.paymentStatus
                                                                ).toUpperCase() ===
                                                                "REFUNDED"
                                                                    ? "status inactive"
                                                                    : "status active"
                                                            }
                                                        >
                                                            {
                                                                payment.paymentStatus
                                                            }
                                                        </span>

                                                    </td>


                                                    <td>

                                                        {
                                                            payment.createdAt
                                                                ? new Date(
                                                                    payment.createdAt
                                                                ).toLocaleString()
                                                                : "-"
                                                        }

                                                    </td>


                                                    <td>

                                                        {
                                                            String(
                                                                payment.paymentStatus
                                                            ).toUpperCase() !==
                                                            "REFUNDED" && (

                                                                <select
                                                                    value={
                                                                        payment.paymentStatus
                                                                    }
                                                                    onChange={(e) =>
                                                                        handlePaymentStatusUpdate(
                                                                            payment.paymentId,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                >

                                                                    <option value="Paid">
                                                                        Paid
                                                                    </option>

                                                                    <option value="Failed">
                                                                        Failed
                                                                    </option>

                                                                    <option value="Refunded">
                                                                        Refunded
                                                                    </option>

                                                                </select>

                                                            )
                                                        }


                                                        {
                                                            String(
                                                                payment.paymentStatus
                                                            ).toUpperCase() ===
                                                            "PAID" && (

                                                                <button
                                                                    className="delete-btn"
                                                                    onClick={() =>
                                                                        handleRefundPayment(
                                                                            payment
                                                                        )
                                                                    }
                                                                >
                                                                    Refund
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

            {activePage === "cart" && (

    <>

        {/* ADD TO CART */}

        <section className="form-card">

            <h2>Add Product to Cart</h2>

            <form onSubmit={handleAddToCart}>

                <div className="form-row">

                    {/* CUSTOMER */}

                    <div className="form-group">

                        <label>Customer</label>

                        <select
                            value={cartCustomerId}
                            onChange={(e) =>
                                setCartCustomerId(e.target.value)
                            }
                        >

                            <option value="">
                                Select Customer
                            </option>

                            {customers.map((customer) => (

                                <option
                                    key={customer.userId}
                                    value={customer.userId}
                                >
                                    {customer.firstName}{" "}
                                    {customer.lastName}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* PRODUCT */}

                    <div className="form-group">

                        <label>Product</label>

                        <select
                            value={cartProductId}
                            onChange={(e) =>
                                setCartProductId(e.target.value)
                            }
                        >

                            <option value="">
                                Select Product
                            </option>

                            {products
                                .filter(
                                    (product) =>
                                        product.status === true &&
                                        product.inventoryCount > 0
                                )
                                .map((product) => (

                                    <option
                                        key={product.productId}
                                        value={product.productId}
                                    >

                                        {product.productName}
                                        {" - ₹"}
                                        {product.price}
                                        {" (Stock: "}
                                        {product.inventoryCount}
                                        {")"}

                                    </option>

                                ))}

                        </select>

                    </div>


                    {/* QUANTITY */}

                    <div className="form-group">

                        <label>Quantity</label>

                        <input
                            type="number"
                            min="1"
                            value={cartQuantity}
                            onChange={(e) =>
                                setCartQuantity(e.target.value)
                            }
                        />

                    </div>

                </div>


                <div className="form-actions">

                    <button
                        type="submit"
                        disabled={addingToCart}
                    >

                        {addingToCart
                            ? "Adding..."
                            : "Add to Cart"}

                    </button>


                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={resetCartForm}
                    >
                        Clear
                    </button>

                </div>

            </form>

        </section>


        {/* CART DASHBOARD */}

        <section className="table-card">

            <div className="table-header">

                <div>

                    <h2>Cart Management</h2>

                    <p>
                        View and manage customer cart items
                    </p>

                </div>


                {/* Refresh Button */}

                <button
                    onClick={loadCartItems}
                >
                    Refresh
                </button>


                {/* CUSTOMER FILTER */}

                <select
                    value={cartCustomerFilter}
                    onChange={(e) =>
                        setCartCustomerFilter(e.target.value)
                    }
                >

                    <option value="ALL">
                        All Customers
                    </option>

                    {customers.map((customer) => (

                        <option
                            key={customer.userId}
                            value={customer.userId}
                        >

                            {customer.firstName}{" "}
                            {customer.lastName}

                        </option>

                    ))}

                </select>

            </div>


            <div className="table-container">

                {loadingCart ? (

                    <p className="empty">
                        Loading cart items...
                    </p>

                ) : cartItems.length === 0 ? (

                    <p className="empty">
                        No cart items found
                    </p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>Cart ID</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                                <th>Created At</th>
                                <th>Actions</th>

                            </tr>

                        </thead>


                        <tbody>

                            {cartItems.map((cart) => {

                                const customer =
                                    customers.find(
                                        (item) =>
                                            item.userId ===
                                            cart.customerId
                                    );

                                const product =
                                    products.find(
                                        (item) =>
                                            item.productId ===
                                            cart.productId
                                    );

                                return (

                                    <tr key={cart.cartId}>

                                        <td>
                                            #{cart.cartId}
                                        </td>


                                        <td>

                                            {customer
                                                ? `${customer.firstName} ${customer.lastName}`
                                                : `Customer #${cart.customerId}`}

                                        </td>


                                        <td>

                                            {product
                                                ? product.productName
                                                : `Product #${cart.productId}`}

                                        </td>


                                        <td>

                                            <input
                                                type="number"
                                                min="1"
                                                max={
                                                    product
                                                        ? product.inventoryCount
                                                        : undefined
                                                }
                                                value={cart.quantity}
                                                onChange={(e) =>
                                                    handleUpdateCartQuantity(
                                                        cart.cartId,
                                                        e.target.value
                                                    )
                                                }
                                                style={{
                                                    width: "70px"
                                                }}
                                            />

                                        </td>


                                        <td>

                                            ₹
                                            {Number(
                                                cart.totalPrice || 0
                                            ).toFixed(2)}

                                        </td>


                                        <td>

                                            {cart.createdAt
                                                ? new Date(
                                                    cart.createdAt
                                                ).toLocaleString()
                                                : "-"}

                                        </td>


                                        <td>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleRemoveCartItem(
                                                        cart.cartId
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                )}

            </div>


            {/* TOTAL CART VALUE */}

            {cartItems.length > 0 && (

                <div
                    style={{
                        marginTop: "20px",
                        fontSize: "18px",
                        fontWeight: "600"
                    }}
                >

                    Total Cart Value: ₹

                    {cartItems
                        .reduce(
                            (total, item) =>
                                total +
                                Number(item.totalPrice || 0),
                            0
                        )
                        .toFixed(2)}

                </div>

            )}

        </section>

    </>

)}

        {activePage === "wishlist" && (

        <>

            {/* ADD TO WISHLIST */}

            <section className="form-card">

                <h2>Add Product to Wishlist</h2>

                <form
                    onSubmit={handleAddToWishlist}
                >

                    <div className="form-row">

                        <div className="form-group">

                            <label>Customer</label>

                            <select
                                value={wishlistCustomerId}
                                onChange={(e) =>
                                    setWishlistCustomerId(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select Customer
                                </option>

                                {customers.map(
                                    (customer) => (

                                        <option
                                            key={
                                                customer.userId
                                            }
                                            value={
                                                customer.userId
                                            }
                                        >

                                            {customer.firstName}{" "}
                                            {customer.lastName}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="form-group">

                            <label>Product</label>

                            <select
                                value={wishlistProductId}
                                onChange={(e) =>
                                    setWishlistProductId(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select Product
                                </option>

                                {products
                                    .filter(
                                        (product) =>
                                            product.status === true
                                    )
                                    .map(
                                        (product) => (

                                            <option
                                                key={
                                                    product.productId
                                                }
                                                value={
                                                    product.productId
                                                }
                                            >

                                                {product.productName}
                                                {" - ₹"}
                                                {product.price}

                                            </option>

                                        )
                                    )}

                            </select>

                        </div>

                    </div>


                    <div className="form-actions">

                        <button
                            type="submit"
                            disabled={
                                addingToWishlist
                            }
                        >

                            {
                                addingToWishlist
                                    ? "Adding..."
                                    : "Add to Wishlist"
                            }

                        </button>


                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={resetWishlistForm}
                        >
                            Clear
                        </button>

                    </div>

                </form>

            </section>


            {/* WISHLIST DASHBOARD */}

            <section className="table-card">

                <div className="table-header">

                    <div>

                        <h2>
                            Wishlist Management
                        </h2>

                        <p>
                            View and manage customer wishlist items
                        </p>

                    </div>


                    <button
                        onClick={loadWishlistItems}
                    >
                        Refresh
                    </button>


                    <select
                        value={
                            wishlistCustomerFilter
                        }
                        onChange={(e) =>
                            setWishlistCustomerFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="ALL">
                            All Customers
                        </option>

                        {customers.map(
                            (customer) => (

                                <option
                                    key={
                                        customer.userId
                                    }
                                    value={
                                        customer.userId
                                    }
                                >

                                    {customer.firstName}{" "}
                                    {customer.lastName}

                                </option>

                            )
                        )}

                    </select>

                </div>


                <div className="table-container">

                    {loadingWishlist ? (

                        <p className="empty">
                            Loading wishlist items...
                        </p>

                    ) : wishlistItems.length === 0 ? (

                        <p className="empty">
                            No wishlist items found
                        </p>

                    ) : (

                        <table>

                            <thead>

                                <tr>

                                    <th>Wishlist ID</th>
                                    <th>Customer</th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Availability</th>
                                    <th>Created At</th>
                                    <th>Actions</th>

                                </tr>

                            </thead>


                            <tbody>

                                {wishlistItems.map(
                                    (wishlist) => {

                                        const customer =
                                            wishlist.customer;

                                        const product =
                                            wishlist.product;

                                        return (

                                            <tr
                                                key={
                                                    wishlist.wishlistId
                                                }
                                            >

                                                <td>
                                                    #
                                                    {
                                                        wishlist.wishlistId
                                                    }
                                                </td>


                                                <td>

                                                    {customer
                                                        ? `${customer.firstName} ${customer.lastName}`
                                                        : "-"}

                                                </td>


                                                <td>

                                                    {product
                                                        ? product.productName
                                                        : "-"}

                                                </td>


                                                <td>

                                                    ₹
                                                    {Number(
                                                        product?.price || 0
                                                    ).toFixed(2)}

                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            product?.status
                                                                ? "status active"
                                                                : "status inactive"
                                                        }
                                                    >

                                                        {product?.status
                                                            ? "Available"
                                                            : "Unavailable"}

                                                    </span>

                                                </td>


                                                <td>

                                                    {
                                                        wishlist.createdAt
                                                            ? new Date(
                                                                wishlist.createdAt
                                                            ).toLocaleString()
                                                            : "-"
                                                    }

                                                </td>


                                                <td>

                                                    <button
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            handleMoveToCart(
                                                                wishlist.wishlistId
                                                            )
                                                        }
                                                    >
                                                        Move to Cart
                                                    </button>


                                                    <button
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            handleRemoveWishlistItem(
                                                                wishlist.wishlistId
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </button>

                                                </td>

                                            </tr>

                                        );

                                    }
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