package com.ecommerce.service;

import com.ecommerce.entity.Coupon;

import java.math.BigDecimal;
import java.util.List;

public interface CouponService {

    Coupon createCoupon(Coupon coupon);

    List<Coupon> getAllCoupons();

    List<Coupon> getActiveCoupons();

    Coupon getCouponById(Integer couponId);

    Coupon getCouponByCode(String couponCode);

    Coupon updateCoupon(Integer couponId, Coupon coupon);

    Coupon deactivateCoupon(Integer couponId);

    void deleteCoupon(Integer couponId);

    BigDecimal applyCoupon(String couponCode, BigDecimal orderTotal);
}