package com.ecommerce.service;

import com.ecommerce.entity.Shipping;

import java.util.List;

public interface ShippingService {

    Shipping createShipping(
            Integer orderId,
            String courierService,
            String trackingNumber,
            String shippingStatus,
            Double shippingCost
    );

    List<Shipping> getAllShipping();

    Shipping getShippingById(
            Integer shippingId
    );

    Shipping getShippingByOrderId(
            Integer orderId
    );

    Shipping getShippingByTrackingNumber(
            String trackingNumber
    );

    List<Shipping> getShippingByStatus(
            String shippingStatus
    );

    Shipping updateShipping(
            Integer shippingId,
            String courierService,
            String trackingNumber,
            String shippingStatus,
            Double shippingCost
    );

    void deleteShipping(
            Integer shippingId
    );
}