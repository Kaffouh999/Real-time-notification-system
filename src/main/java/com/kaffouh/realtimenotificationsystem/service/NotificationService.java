package com.kaffouh.realtimenotificationsystem.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kaffouh.realtimenotificationsystem.dto.CreateNotificationRequest;
import com.kaffouh.realtimenotificationsystem.dto.UpdateNotificationRequest;
import com.kaffouh.realtimenotificationsystem.exception.ResourceNotFoundException;
import com.kaffouh.realtimenotificationsystem.model.Notification;
import com.kaffouh.realtimenotificationsystem.model.User;
import com.kaffouh.realtimenotificationsystem.repository.NotificationRepository;
import com.kaffouh.realtimenotificationsystem.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<Notification> findAll() {
        return notificationRepository.findAll();
    }

    public Notification findById(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
    }

    public List<Notification> findByUserId(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    @Transactional
    public Notification create(CreateNotificationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = Notification.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .user(user)
                .build();

        return notificationRepository.save(notification);
    }

    @Transactional
    public Notification update(Long id, UpdateNotificationRequest request) {
        Notification notification = findById(id);

        if (request.getTitle() != null) {
            notification.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            notification.setContent(request.getContent());
        }
        if (request.getStatus() != null) {
            notification.setStatus(request.getStatus());
        }
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            notification.setUser(user);
        }

        return notificationRepository.save(notification);
    }

    @Transactional
    public void delete(Long id) {
        Notification notification = findById(id);
        notificationRepository.delete(notification);
    }
}
