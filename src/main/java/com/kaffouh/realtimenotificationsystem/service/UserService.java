package com.kaffouh.realtimenotificationsystem.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kaffouh.realtimenotificationsystem.dto.CreateUserRequest;
import com.kaffouh.realtimenotificationsystem.dto.UpdateUserRequest;
import com.kaffouh.realtimenotificationsystem.exception.ResourceNotFoundException;
import com.kaffouh.realtimenotificationsystem.model.User;
import com.kaffouh.realtimenotificationsystem.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public User create(CreateUserRequest request) {
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .build();
        return userRepository.save(user);
    }

    @Transactional
    public User update(Long id, UpdateUserRequest request) {
        User user = findById(id);
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        return userRepository.save(user);
    }

    @Transactional
    public void delete(Long id) {
        User user = findById(id);
        userRepository.delete(user);
    }
}
