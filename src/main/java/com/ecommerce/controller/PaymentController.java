package com.ecommerce.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.entity.Payment;
import com.ecommerce.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5174")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(
            PaymentService paymentService) {

        this.paymentService = paymentService;
    }

    // Create payment
    @PostMapping
    public ResponseEntity<Payment> createPayment(
            @RequestBody Payment payment) {

        Payment createdPayment =
                paymentService.createPayment(payment);

        return new ResponseEntity<>(
                createdPayment,
                HttpStatus.CREATED
        );
    }

    // Get all payments
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {

        return ResponseEntity.ok(
                paymentService.getAllPayments()
        );
    }

    // Get payment by ID
    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getPaymentById(
            @PathVariable Integer paymentId) {

        return ResponseEntity.ok(
                paymentService.getPaymentById(paymentId)
        );
    }

    // Get payments by status
    @GetMapping("/status/{paymentStatus}")
    public ResponseEntity<List<Payment>> getPaymentsByStatus(
            @PathVariable String paymentStatus) {

        return ResponseEntity.ok(
                paymentService.getPaymentsByStatus(
                        paymentStatus
                )
        );
    }

    // Get payments by order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<Payment>> getPaymentsByOrderId(
            @PathVariable Integer orderId) {

        return ResponseEntity.ok(
                paymentService.getPaymentsByOrderId(
                        orderId
                )
        );
    }

    // Update payment status
    @PutMapping("/{paymentId}/status")
    public ResponseEntity<Payment> updatePaymentStatus(
            @PathVariable Integer paymentId,
            @RequestParam String paymentStatus) {

        return ResponseEntity.ok(
                paymentService.updatePaymentStatus(
                        paymentId,
                        paymentStatus
                )
        );
    }

    // Refund payment
    @PutMapping("/{paymentId}/refund")
    public ResponseEntity<Payment> refundPayment(
            @PathVariable Integer paymentId) {

        return ResponseEntity.ok(
                paymentService.refundPayment(paymentId)
        );
    }
}