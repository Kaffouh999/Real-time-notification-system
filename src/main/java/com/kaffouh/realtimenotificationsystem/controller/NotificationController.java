package com.kaffouh.realtimenotificationsystem.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.kaffouh.realtimenotificationsystem.dto.CreateNotificationRequest;
import com.kaffouh.realtimenotificationsystem.dto.UpdateNotificationRequest;
import com.kaffouh.realtimenotificationsystem.model.Notification;
import com.kaffouh.realtimenotificationsystem.service.NotificationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<Notification> getAll() {
        return notificationService.findAll();
    }

    @GetMapping("/{id}")
    public Notification getById(@PathVariable Long id) {
        return notificationService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Notification create(@Valid @RequestBody CreateNotificationRequest request) {
        return notificationService.create(request);
    }

    @PutMapping("/{id}")
    public Notification update(@PathVariable Long id, @RequestBody UpdateNotificationRequest request) {
        return notificationService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        notificationService.delete(id);
    }
}
