package com.ecommerce.repository;

import com.ecommerce.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Integer> {

    Optional<Coupon> findByCouponCode(String couponCode);

    boolean existsByCouponCode(String couponCode);

    List<Coupon> findByStatus(Boolean status);
}