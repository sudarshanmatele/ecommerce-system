package com.ecommerce.service;

import java.util.List;

import com.ecommerce.entity.Category;

public interface CategoryService {

    Category createCategory(Category category);

    List<Category> getAllCategories();

    Category getCategoryById(Integer id);

    Category updateCategory(Integer id, Category category);

    void deactivateCategory(Integer id);
}