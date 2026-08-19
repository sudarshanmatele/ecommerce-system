package com.ecommerce.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User createUser(User user) {

        user.setUserId(null);
        user.setStatus(true);

        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    @Override
    public User getUserById(Integer userId) {

        return userRepository.findById(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Customer not found with ID: " + userId
                        )
                );
    }

    @Override
    public User updateUser(Integer userId, User user) {

        User existingUser = getUserById(userId);

        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhone(user.getPhone());

        return userRepository.save(existingUser);
    }

    @Override
    public User deactivateUser(Integer userId) {

        User existingUser = getUserById(userId);

        existingUser.setStatus(false);

        return userRepository.save(existingUser);
    }
}