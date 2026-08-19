package com.ecommerce.service;

import java.util.List;

import com.ecommerce.entity.User;

public interface UserService {

    User createUser(User user);

    List<User> getAllUsers();

    User getUserById(Integer userId);

    User updateUser(Integer userId, User user);

    User deactivateUser(Integer userId);
}