package com.ecommerce.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecommerce.entity.Order;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.service.OrderService;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public Order createOrder(Order order) {

        if (order.getCustomerId() == null) {
            throw new RuntimeException("Customer ID is required");
        }

        if (order.getTotalAmount() == null ||
                order.getTotalAmount().signum() < 0) {
            throw new RuntimeException("Total amount must be valid");
        }

        if (order.getShippingAddress() == null ||
                order.getShippingAddress().isBlank()) {
            throw new RuntimeException("Shipping address is required");
        }

        order.setOrderStatus("Pending");
        order.setStatus(true);

        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findByStatusTrue();
    }

    @Override
    public List<Order> getOrdersByStatus(String orderStatus) {

        if (orderStatus == null || orderStatus.isBlank()) {
            throw new RuntimeException("Order status is required");
        }

        return orderRepository.findByOrderStatusIgnoreCase(orderStatus);
    }

    @Override
    public List<Order> getOrdersByCustomer(Integer customerId) {

        if (customerId == null) {
            throw new RuntimeException("Customer ID is required");
        }

        return orderRepository.findByCustomerId(customerId);
    }

    @Override
    public Order getOrderById(Integer orderId) {

        return orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new RuntimeException("Order not found with ID: " + orderId));
    }

    @Override
    public Order updateOrderStatus(Integer orderId, String orderStatus) {

        Order order = getOrderById(orderId);

        if (!order.getStatus()) {
            throw new RuntimeException("Cannot update a cancelled order");
        }

        if (orderStatus == null || orderStatus.isBlank()) {
            throw new RuntimeException("Order status is required");
        }

        String newStatus = orderStatus.trim();

        if (!newStatus.equalsIgnoreCase("Pending")
                && !newStatus.equalsIgnoreCase("Shipped")
                && !newStatus.equalsIgnoreCase("Delivered")
                && !newStatus.equalsIgnoreCase("Cancelled")) {

            throw new RuntimeException(
                    "Invalid order status. Allowed values: Pending, Shipped, Delivered, Cancelled");
        }

        order.setOrderStatus(newStatus);

        if (newStatus.equalsIgnoreCase("Cancelled")) {
            order.setStatus(false);
        }

        return orderRepository.save(order);
    }

    @Override
    public Order cancelOrder(Integer orderId) {

        Order order = getOrderById(orderId);

        if (!order.getStatus()) {
            throw new RuntimeException("Order is already cancelled");
        }

        if (order.getOrderStatus().equalsIgnoreCase("Shipped")
                || order.getOrderStatus().equalsIgnoreCase("Delivered")) {

            throw new RuntimeException(
                    "Order cannot be cancelled after it has been shipped");
        }

        order.setOrderStatus("Cancelled");
        order.setStatus(false);

        return orderRepository.save(order);
    }
}