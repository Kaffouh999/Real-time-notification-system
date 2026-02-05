package com.kaffouh.realtimenotificationsystem.dto;

import com.kaffouh.realtimenotificationsystem.model.NotificationStatus;

import lombok.Data;

@Data
public class UpdateNotificationRequest {
    private String title;
    private String content;
    private NotificationStatus status;
    private Long userId;
}
