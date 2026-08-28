package com.ecommerce.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
name = "wishlists",
uniqueConstraints = {
@UniqueConstraint(
columnNames = {
"customer_id",
"product_id"
}
)
}
)
public class Wishlist {

@Id
@GeneratedValue(
    strategy = GenerationType.IDENTITY
)
@Column(name = "wishlist_id")
private Integer wishlistId;


@ManyToOne
@JoinColumn(
    name = "customer_id",
    nullable = false
)
private User customer;


@ManyToOne
@JoinColumn(
    name = "product_id",
    nullable = false
)
private Product product;


@Column(
    name = "created_at",
    updatable = false
)
private LocalDateTime createdAt;


@Column(
    name = "updated_at"
)
private LocalDateTime updatedAt;


@PrePersist
protected void onCreate() {

    createdAt = LocalDateTime.now();

    updatedAt = LocalDateTime.now();

}


@PreUpdate
protected void onUpdate() {

    updatedAt = LocalDateTime.now();

}


public Integer getWishlistId() {
    return wishlistId;
}

public void setWishlistId(
    Integer wishlistId
) {
    this.wishlistId = wishlistId;
}


public User getCustomer() {
    return customer;
}

public void setCustomer(
    User customer
) {
    this.customer = customer;
}


public Product getProduct() {
    return product;
}

public void setProduct(
    Product product
) {
    this.product = product;
}


public LocalDateTime getCreatedAt() {
    return createdAt;
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
