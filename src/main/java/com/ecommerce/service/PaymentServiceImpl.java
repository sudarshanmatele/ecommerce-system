package com.ecommerce.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecommerce.entity.Payment;
import com.ecommerce.repository.PaymentRepository;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Payment createPayment(Payment payment) {

        if (payment.getPaymentStatus() == null ||
                payment.getPaymentStatus().isBlank()) {

            payment.setPaymentStatus("Paid");
        }

        return paymentRepository.save(payment);
    }

    @Override
    public List<Payment> getAllPayments() {

        return paymentRepository.findAll();
    }

    @Override
    public Payment getPaymentById(Integer paymentId) {

        return paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found with ID: " + paymentId
                        )
                );
    }

    @Override
    public List<Payment> getPaymentsByStatus(String paymentStatus) {

        return paymentRepository.findByPaymentStatus(
                paymentStatus
        );
    }

    @Override
    public List<Payment> getPaymentsByOrderId(Integer orderId) {

        return paymentRepository.findByOrderId(
                orderId
        );
    }

    @Override
    public Payment updatePaymentStatus(
            Integer paymentId,
            String paymentStatus) {

        Payment payment = getPaymentById(paymentId);

        payment.setPaymentStatus(paymentStatus);

        return paymentRepository.save(payment);
    }

    @Override
    public Payment refundPayment(Integer paymentId) {

        Payment payment = getPaymentById(paymentId);

        payment.setPaymentStatus("Refunded");

        return paymentRepository.save(payment);
    }
}