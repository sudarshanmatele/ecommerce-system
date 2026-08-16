package com.ecommerce.service;

import java.util.List;

import com.ecommerce.entity.Order;

public interface OrderService {

    Order createOrder(Order order);

    List<Order> getAllOrders();

    List<Order> getOrdersByStatus(String orderStatus);

    List<Order> getOrdersByCustomer(Integer customerId);

    Order getOrderById(Integer orderId);

    Order updateOrderStatus(Integer orderId, String orderStatus);

    Order cancelOrder(Integer orderId);
}