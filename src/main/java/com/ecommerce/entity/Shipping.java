package com.ecommerce.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "shipping")
public class Shipping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shipping_id")
    private Integer shippingId;

    @OneToOne
    @JoinColumn(
        name = "order_id",
        nullable = false
    )
    private Order order;

    @Column(name = "courier_service")
    private String courierService;

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "shipping_status")
    private String shippingStatus;

    @Column(
        name = "shipping_cost",
        precision = 10,
        scale = 2
    )
    private BigDecimal shippingCost;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    // ============================================================
    // CREATED / UPDATED TIMESTAMP
    // ============================================================

    @PrePersist
    protected void onCreate() {

        createdAt = LocalDateTime.now();

        updatedAt = LocalDateTime.now();
    }


    @PreUpdate
    protected void onUpdate() {

        updatedAt = LocalDateTime.now();
    }


    // ============================================================
    // GETTERS AND SETTERS
    // ============================================================

    public Integer getShippingId() {
        return shippingId;
    }

    public void setShippingId(
            Integer shippingId
    ) {
        this.shippingId = shippingId;
    }


    public Order getOrder() {
        return order;
    }

    public void setOrder(
            Order order
    ) {
        this.order = order;
    }


    public String getCourierService() {
        return courierService;
    }

    public void setCourierService(
            String courierService
    ) {
        this.courierService = courierService;
    }


    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(
            String trackingNumber
    ) {
        this.trackingNumber = trackingNumber;
    }


    public String getShippingStatus() {
        return shippingStatus;
    }

    public void setShippingStatus(
            String shippingStatus
    ) {
        this.shippingStatus = shippingStatus;
    }


    public BigDecimal getShippingCost() {
        return shippingCost;
    }

    public void setShippingCost(
            BigDecimal shippingCost
    ) {
        this.shippingCost = shippingCost;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt
    ) {
        this.updatedAt = updatedAt;
    }
}