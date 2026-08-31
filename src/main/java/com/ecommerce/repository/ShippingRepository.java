package com.ecommerce.repository;

import com.ecommerce.entity.Shipping;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.entity.Shipping;

import java.util.List;
import java.util.Optional;

public interface ShippingRepository
        extends JpaRepository<Shipping, Integer> {

    Optional<Shipping> findByOrder_OrderId(
            Integer orderId
    );

    List<Shipping> findByShippingStatus(
            String shippingStatus
    );

    Optional<Shipping> findByTrackingNumber(
            String trackingNumber
    );

}