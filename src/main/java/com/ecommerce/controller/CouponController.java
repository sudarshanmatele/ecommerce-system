package com.ecommerce.controller;

import com.ecommerce.entity.Coupon;
import com.ecommerce.service.CouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@CrossOrigin(origins = "http://localhost:5173")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon) {
        return ResponseEntity.ok(couponService.createCoupon(coupon));
    }

    @GetMapping
    public ResponseEntity<List<Coupon>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Coupon>> getActiveCoupons() {
        return ResponseEntity.ok(couponService.getActiveCoupons());
    }

    @GetMapping("/{couponId}")
    public ResponseEntity<Coupon> getCouponById(
            @PathVariable Integer couponId) {

        return ResponseEntity.ok(couponService.getCouponById(couponId));
    }

    @GetMapping("/code/{couponCode}")
    public ResponseEntity<Coupon> getCouponByCode(
            @PathVariable String couponCode) {

        return ResponseEntity.ok(couponService.getCouponByCode(couponCode));
    }

    @PutMapping("/{couponId}")
    public ResponseEntity<Coupon> updateCoupon(
            @PathVariable Integer couponId,
            @RequestBody Coupon coupon) {

        return ResponseEntity.ok(
                couponService.updateCoupon(couponId, coupon));
    }

    @PutMapping("/{couponId}/deactivate")
    public ResponseEntity<Coupon> deactivateCoupon(
            @PathVariable Integer couponId) {

        return ResponseEntity.ok(
                couponService.deactivateCoupon(couponId));
    }

    @DeleteMapping("/{couponId}")
    public ResponseEntity<String> deleteCoupon(
            @PathVariable Integer couponId) {

        couponService.deleteCoupon(couponId);

        return ResponseEntity.ok("Coupon deactivated successfully");
    }

    @PostMapping("/apply")
    public ResponseEntity<Map<String, Object>> applyCoupon(
            @RequestParam String couponCode,
            @RequestParam BigDecimal orderTotal) {

        BigDecimal finalAmount =
                couponService.applyCoupon(couponCode, orderTotal);

        BigDecimal discount =
                orderTotal.subtract(finalAmount);

        return ResponseEntity.ok(
                Map.of(
                        "couponCode", couponCode,
                        "orderTotal", orderTotal,
                        "discount", discount,
                        "finalAmount", finalAmount
                )
        );
    }
}