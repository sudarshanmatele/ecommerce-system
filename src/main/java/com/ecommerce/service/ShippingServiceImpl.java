package com.ecommerce.service;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.Shipping;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ShippingRepository;
import com.ecommerce.service.ShippingService;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ShippingServiceImpl implements ShippingService {

    private final ShippingRepository shippingRepository;
    private final OrderRepository orderRepository;


    public ShippingServiceImpl(
            ShippingRepository shippingRepository,
            OrderRepository orderRepository
    ) {

        this.shippingRepository = shippingRepository;
        this.orderRepository = orderRepository;

    }


    // ============================================================
    // CREATE SHIPPING
    // ============================================================

    @Override
    public Shipping createShipping(
            Integer orderId,
            String courierService,
            String trackingNumber,
            String shippingStatus,
            Double shippingCost
    ) {

        Order order = orderRepository
                .findById(orderId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Order not found with ID: " + orderId
                        )
                );


        if (
                shippingRepository
                        .findByOrder_OrderId(orderId)
                        .isPresent()
        ) {

            throw new RuntimeException(
                    "Shipping already exists for order ID: "
                            + orderId
            );

        }


        Shipping shipping = new Shipping();

        shipping.setOrder(order);

        shipping.setCourierService(
                courierService
        );

        shipping.setTrackingNumber(
                trackingNumber
        );

        shipping.setShippingStatus(
                shippingStatus
        );

        shipping.setShippingCost(
                shippingCost != null
                        ? BigDecimal.valueOf(shippingCost)
                        : BigDecimal.ZERO
        );


        return shippingRepository.save(
                shipping
        );
    }


    // ============================================================
    // GET ALL SHIPPING
    // ============================================================

    @Override
    public List<Shipping> getAllShipping() {

        return shippingRepository.findAll();

    }


    // ============================================================
    // GET SHIPPING BY ID
    // ============================================================

    @Override
    public Shipping getShippingById(
            Integer shippingId
    ) {

        return shippingRepository
                .findById(shippingId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Shipping not found with ID: "
                                        + shippingId
                        )
                );

    }


    // ============================================================
    // GET SHIPPING BY ORDER ID
    // ============================================================

    @Override
    public Shipping getShippingByOrderId(
            Integer orderId
    ) {

        return shippingRepository
                .findByOrder_OrderId(orderId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Shipping not found for order ID: "
                                        + orderId
                        )
                );

    }


    // ============================================================
    // GET SHIPPING BY TRACKING NUMBER
    // ============================================================

    @Override
    public Shipping getShippingByTrackingNumber(
            String trackingNumber
    ) {

        return shippingRepository
                .findByTrackingNumber(
                        trackingNumber
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Shipping not found with tracking number: "
                                        + trackingNumber
                        )
                );

    }


    // ============================================================
    // GET SHIPPING BY STATUS
    // ============================================================

    @Override
    public List<Shipping> getShippingByStatus(
            String shippingStatus
    ) {

        return shippingRepository
                .findByShippingStatus(
                        shippingStatus
                );

    }


    // ============================================================
    // UPDATE SHIPPING
    // ============================================================

    @Override
    public Shipping updateShipping(
            Integer shippingId,
            String courierService,
            String trackingNumber,
            String shippingStatus,
            Double shippingCost
    ) {

        Shipping shipping =
                shippingRepository
                        .findById(shippingId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Shipping not found with ID: "
                                                + shippingId
                                )
                        );


        shipping.setCourierService(
                courierService
        );

        shipping.setTrackingNumber(
                trackingNumber
        );

        shipping.setShippingStatus(
                shippingStatus
        );

        if (shippingCost != null) {

            shipping.setShippingCost(
                    BigDecimal.valueOf(
                            shippingCost
                    )
            );

        }


        return shippingRepository.save(
                shipping
        );
    }


    // ============================================================
    // DELETE SHIPPING
    // ============================================================

    @Override
    public void deleteShipping(
            Integer shippingId
    ) {

        Shipping shipping =
                shippingRepository
                        .findById(shippingId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Shipping not found with ID: "
                                                + shippingId
                                )
                        );


        shippingRepository.delete(
                shipping
        );

    }

}