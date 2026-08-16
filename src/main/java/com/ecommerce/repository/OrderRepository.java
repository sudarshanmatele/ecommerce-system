package com.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByStatusTrue();

    List<Order> findByOrderStatusIgnoreCase(String orderStatus);

    List<Order> findByCustomerId(Integer customerId);

}
