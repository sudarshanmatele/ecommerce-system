package com.ecommerce.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.entity.Order;
import com.ecommerce.service.OrderService;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5174")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // Create a new order
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        Order createdOrder = orderService.createOrder(order);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    // Get all active orders
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // Get order by ID
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable Integer orderId) {

        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    // Get orders by status
    @GetMapping("/status/{orderStatus}")
    public ResponseEntity<List<Order>> getOrdersByStatus(
            @PathVariable String orderStatus) {

        return ResponseEntity.ok(
                orderService.getOrdersByStatus(orderStatus));
    }

    // Get orders by customer
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getOrdersByCustomer(
            @PathVariable Integer customerId) {

        return ResponseEntity.ok(
                orderService.getOrdersByCustomer(customerId));
    }

    // Update order status
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Integer orderId,
            @RequestParam String orderStatus) {

        return ResponseEntity.ok(
                orderService.updateOrderStatus(orderId, orderStatus));
    }

    // Cancel order
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<Order> cancelOrder(
            @PathVariable Integer orderId) {

        return ResponseEntity.ok(
                orderService.cancelOrder(orderId));
    }
}