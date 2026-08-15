package com.ecommerce.service;

import java.util.List;

import com.ecommerce.entity.Product;

public interface ProductService {

    Product createProduct(Product product);

    List<Product> getAllProducts();

    Product getProductById(Integer productId);

    Product updateProduct(Integer productId, Product product);

    Product deactivateProduct(Integer productId);
}