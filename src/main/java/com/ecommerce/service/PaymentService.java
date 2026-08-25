package com.ecommerce.service;

import java.util.List;

import com.ecommerce.entity.Payment;

public interface PaymentService {

    Payment createPayment(Payment payment);

    List<Payment> getAllPayments();

    Payment getPaymentById(Integer paymentId);

    List<Payment> getPaymentsByStatus(String paymentStatus);

    List<Payment> getPaymentsByOrderId(Integer orderId);

    Payment updatePaymentStatus(
            Integer paymentId,
            String paymentStatus
    );

    Payment refundPayment(Integer paymentId);

}