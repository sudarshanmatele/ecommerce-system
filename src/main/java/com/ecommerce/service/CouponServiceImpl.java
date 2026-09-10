package com.ecommerce.service;

import com.ecommerce.entity.Coupon;
import com.ecommerce.repository.CouponRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;

    public CouponServiceImpl(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    @Override
    public Coupon createCoupon(Coupon coupon) {

        if (couponRepository.existsByCouponCode(coupon.getCouponCode())) {
            throw new RuntimeException("Coupon code already exists");
        }

        validateCoupon(coupon);

        coupon.setStatus(true);

        return couponRepository.save(coupon);
    }

    @Override
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @Override
    public List<Coupon> getActiveCoupons() {
        return couponRepository.findByStatus(true);
    }

    @Override
    public Coupon getCouponById(Integer couponId) {
        return couponRepository.findById(couponId)
                .orElseThrow(() -> new RuntimeException(
                        "Coupon not found with ID: " + couponId));
    }

    @Override
    public Coupon getCouponByCode(String couponCode) {
        return couponRepository.findByCouponCode(couponCode)
                .orElseThrow(() -> new RuntimeException(
                        "Coupon not found with code: " + couponCode));
    }

    @Override
    public Coupon updateCoupon(Integer couponId, Coupon coupon) {

        Coupon existingCoupon = getCouponById(couponId);

        existingCoupon.setCouponCode(coupon.getCouponCode());
        existingCoupon.setDiscountType(coupon.getDiscountType());
        existingCoupon.setDiscountValue(coupon.getDiscountValue());
        existingCoupon.setValidFrom(coupon.getValidFrom());
        existingCoupon.setValidTo(coupon.getValidTo());
        existingCoupon.setUsageLimit(coupon.getUsageLimit());

        validateCoupon(existingCoupon);

        return couponRepository.save(existingCoupon);
    }

    @Override
    public Coupon deactivateCoupon(Integer couponId) {

        Coupon coupon = getCouponById(couponId);

        coupon.setStatus(false);

        return couponRepository.save(coupon);
    }

    @Override
    public void deleteCoupon(Integer couponId) {

        Coupon coupon = getCouponById(couponId);

        coupon.setStatus(false);

        couponRepository.save(coupon);
    }

    @Override
    public BigDecimal applyCoupon(String couponCode, BigDecimal orderTotal) {

        Coupon coupon = getCouponByCode(couponCode);

        LocalDateTime now = LocalDateTime.now();

        if (!Boolean.TRUE.equals(coupon.getStatus())) {
            throw new RuntimeException("Coupon is inactive");
        }

        if (now.isBefore(coupon.getValidFrom())) {
            throw new RuntimeException("Coupon is not yet valid");
        }

        if (now.isAfter(coupon.getValidTo())) {
            throw new RuntimeException("Coupon has expired");
        }

        if (orderTotal == null || orderTotal.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Invalid order total");
        }

        BigDecimal discount;

        if ("Percentage".equalsIgnoreCase(coupon.getDiscountType())) {

            if (coupon.getDiscountValue().compareTo(BigDecimal.valueOf(100)) > 0) {
                throw new RuntimeException(
                        "Percentage discount cannot exceed 100");
            }

            discount = orderTotal
                    .multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100));

        } else if ("Fixed Amount".equalsIgnoreCase(coupon.getDiscountType())) {

            discount = coupon.getDiscountValue();

        } else {
            throw new RuntimeException("Invalid discount type");
        }

        if (discount.compareTo(orderTotal) > 0) {
            discount = orderTotal;
        }

        return orderTotal.subtract(discount);
    }

    private void validateCoupon(Coupon coupon) {

        if (coupon.getCouponCode() == null ||
                coupon.getCouponCode().trim().isEmpty()) {
            throw new RuntimeException("Coupon code is required");
        }

        if (coupon.getDiscountType() == null ||
                coupon.getDiscountType().trim().isEmpty()) {
            throw new RuntimeException("Discount type is required");
        }

        if (coupon.getDiscountValue() == null ||
                coupon.getDiscountValue().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Discount value must be greater than 0");
        }

        if (coupon.getValidFrom() == null ||
                coupon.getValidTo() == null) {
            throw new RuntimeException("Coupon validity dates are required");
        }

        if (coupon.getValidTo().isBefore(coupon.getValidFrom())) {
            throw new RuntimeException(
                    "Valid-to date cannot be before valid-from date");
        }

        if ("Percentage".equalsIgnoreCase(coupon.getDiscountType())
                && coupon.getDiscountValue()
                .compareTo(BigDecimal.valueOf(100)) > 0) {

            throw new RuntimeException(
                    "Percentage discount cannot exceed 100");
        }

        if ("Fixed Amount".equalsIgnoreCase(coupon.getDiscountType()) == false
                && "Percentage".equalsIgnoreCase(coupon.getDiscountType()) == false) {

            throw new RuntimeException("Discount type must be Percentage or Fixed Amount");
        }
    }
}