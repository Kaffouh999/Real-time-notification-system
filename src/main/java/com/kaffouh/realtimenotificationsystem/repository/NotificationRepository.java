package com.kaffouh.realtimenotificationsystem.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kaffouh.realtimenotificationsystem.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserId(Long userId);
}
