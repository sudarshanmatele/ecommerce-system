package com.ecommerce.controller;

import com.ecommerce.entity.Shipping;
import com.ecommerce.service.ShippingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipping")
@CrossOrigin(origins = "http://localhost:5173")
public class ShippingController {

    private final ShippingService shippingService;


    public ShippingController(
            ShippingService shippingService
    ) {

        this.shippingService = shippingService;

    }


    // ============================================================
    // CREATE SHIPPING
    // ============================================================

    @PostMapping
    public ResponseEntity<Shipping> createShipping(

            @RequestParam Integer orderId,

            @RequestParam String courierService,

            @RequestParam String trackingNumber,

            @RequestParam String shippingStatus,

            @RequestParam Double shippingCost

    ) {

        Shipping shipping =
                shippingService.createShipping(
                        orderId,
                        courierService,
                        trackingNumber,
                        shippingStatus,
                        shippingCost
                );

        return ResponseEntity.ok(shipping);

    }


    // ============================================================
    // GET ALL SHIPPING
    // ============================================================

    @GetMapping
    public ResponseEntity<List<Shipping>> getAllShipping() {

        return ResponseEntity.ok(
                shippingService.getAllShipping()
        );

    }


    // ============================================================
    // GET SHIPPING BY ID
    // ============================================================

    @GetMapping("/{shippingId}")
    public ResponseEntity<Shipping> getShippingById(

            @PathVariable Integer shippingId

    ) {

        return ResponseEntity.ok(
                shippingService.getShippingById(
                        shippingId
                )
        );

    }


    // ============================================================
    // GET SHIPPING BY ORDER ID
    // ============================================================

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Shipping> getShippingByOrderId(

            @PathVariable Integer orderId

    ) {

        return ResponseEntity.ok(
                shippingService.getShippingByOrderId(
                        orderId
                )
        );

    }


    // ============================================================
    // TRACK SHIPMENT
    // ============================================================

    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<Shipping> trackShipment(

            @PathVariable String trackingNumber

    ) {

        return ResponseEntity.ok(
                shippingService
                        .getShippingByTrackingNumber(
                                trackingNumber
                        )
        );

    }


    // ============================================================
    // GET SHIPPING BY STATUS
    // ============================================================

    @GetMapping("/status/{shippingStatus}")
    public ResponseEntity<List<Shipping>> getShippingByStatus(

            @PathVariable String shippingStatus

    ) {

        return ResponseEntity.ok(
                shippingService
                        .getShippingByStatus(
                                shippingStatus
                        )
        );

    }


    // ============================================================
    // UPDATE SHIPPING
    // ============================================================

    @PutMapping("/{shippingId}")
    public ResponseEntity<Shipping> updateShipping(

            @PathVariable Integer shippingId,

            @RequestParam String courierService,

            @RequestParam String trackingNumber,

            @RequestParam String shippingStatus,

            @RequestParam Double shippingCost

    ) {

        Shipping shipping =
                shippingService.updateShipping(
                        shippingId,
                        courierService,
                        trackingNumber,
                        shippingStatus,
                        shippingCost
                );

        return ResponseEntity.ok(shipping);

    }


    // ============================================================
    // DELETE SHIPPING
    // ============================================================

    @DeleteMapping("/{shippingId}")
    public ResponseEntity<String> deleteShipping(

            @PathVariable Integer shippingId

    ) {

        shippingService.deleteShipping(
                shippingId
        );

        return ResponseEntity.ok(
                "Shipping deleted successfully"
        );

    }

}