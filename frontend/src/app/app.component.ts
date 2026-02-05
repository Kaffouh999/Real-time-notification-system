import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';

import { Notification } from './models/notification';
import { NotificationStatus } from './models/notification-status';
import { User } from './models/user';
import { NotificationService } from './services/notification.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  users: User[] = [];
  notifications: Notification[] = [];
  userNotifications: Notification[] = [];
  statusOptions: NotificationStatus[] = ['PENDING', 'SENT', 'FAILED'];

  userForm = {
    name: '',
    email: ''
  };

  editingUser: { id: number; name: string; email: string } | null = null;

  notificationForm = {
    title: '',
    content: '',
    userId: null as number | null
  };

  editingNotification: {
    id: number;
    title: string;
    content: string;
    status: NotificationStatus;
    userId: number;
  } | null = null;

  selectedUserId: number | null = null;

  isLoadingUsers = false;
  isLoadingNotifications = false;
  isLoadingUserNotifications = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadNotifications();
  }

  loadUsers(): void {
    this.isLoadingUsers = true;
    this.userService
      .getAll()
      .pipe(finalize(() => (this.isLoadingUsers = false)))
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (error) => this.handleError(error, 'Failed to load users.')
      });
  }

  loadNotifications(): void {
    this.isLoadingNotifications = true;
    this.notificationService
      .getAll()
      .pipe(finalize(() => (this.isLoadingNotifications = false)))
      .subscribe({
        next: (notifications) => {
          this.notifications = notifications;
        },
        error: (error) => this.handleError(error, 'Failed to load notifications.')
      });
  }

  loadUserNotifications(): void {
    if (!this.selectedUserId) {
      this.userNotifications = [];
      return;
    }
    this.isLoadingUserNotifications = true;
    this.userService
      .getNotifications(this.selectedUserId)
      .pipe(finalize(() => (this.isLoadingUserNotifications = false)))
      .subscribe({
        next: (notifications) => {
          this.userNotifications = notifications;
        },
        error: (error) => this.handleError(error, 'Failed to load user notifications.')
      });
  }

  createUser(): void {
    this.clearMessages();
    const name = this.userForm.name.trim();
    const email = this.userForm.email.trim();

    if (!name || !email) {
      this.errorMessage = 'Name and email are required.';
      return;
    }

    this.userService.create({ name, email }).subscribe({
      next: () => {
        this.successMessage = 'User created successfully.';
        this.userForm = { name: '', email: '' };
        this.loadUsers();
      },
      error: (error) => this.handleError(error, 'Failed to create user.')
    });
  }

  startEditUser(user: User): void {
    this.clearMessages();
    this.editingUser = { id: user.id, name: user.name, email: user.email };
  }

  cancelEditUser(): void {
    this.editingUser = null;
  }

  saveUser(): void {
    if (!this.editingUser) {
      return;
    }

    this.clearMessages();

    const { id, name, email } = this.editingUser;
    if (!name.trim() && !email.trim()) {
      this.errorMessage = 'Provide at least one field to update.';
      return;
    }

    this.userService
      .update(id, {
        name: name.trim() || undefined,
        email: email.trim() || undefined
      })
      .subscribe({
        next: () => {
          this.successMessage = 'User updated successfully.';
          this.editingUser = null;
          this.loadUsers();
        },
        error: (error) => this.handleError(error, 'Failed to update user.')
      });
  }

  deleteUser(id: number): void {
    this.clearMessages();
    this.userService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'User deleted successfully.';
        this.loadUsers();
      },
      error: (error) => this.handleError(error, 'Failed to delete user.')
    });
  }

  createNotification(): void {
    this.clearMessages();
    const title = this.notificationForm.title.trim();
    const content = this.notificationForm.content.trim();
    const userId = this.notificationForm.userId;

    if (!title || !content || !userId) {
      this.errorMessage = 'Title, content, and user are required.';
      return;
    }

    this.notificationService
      .create({
        title,
        content,
        userId: Number(userId)
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Notification created successfully.';
          this.notificationForm = { title: '', content: '', userId: null };
          this.loadNotifications();
          this.loadUserNotifications();
        },
        error: (error) => this.handleError(error, 'Failed to create notification.')
      });
  }

  startEditNotification(notification: Notification): void {
    this.clearMessages();
    const fallbackUserId = this.users[0]?.id ?? 0;
    this.editingNotification = {
      id: notification.id,
      title: notification.title,
      content: notification.content,
      status: notification.status,
      userId: notification.user?.id ?? fallbackUserId
    };
  }

  cancelEditNotification(): void {
    this.editingNotification = null;
  }

  saveNotification(): void {
    if (!this.editingNotification) {
      return;
    }

    this.clearMessages();

    const { id, title, content, status, userId } = this.editingNotification;
    if (!title.trim() && !content.trim() && !status && !userId) {
      this.errorMessage = 'Provide at least one field to update.';
      return;
    }

    this.notificationService
      .update(id, {
        title: title.trim() || undefined,
        content: content.trim() || undefined,
        status,
        userId: userId || undefined
      })
      .subscribe({
        next: () => {
          this.successMessage = 'Notification updated successfully.';
          this.editingNotification = null;
          this.loadNotifications();
          this.loadUserNotifications();
        },
        error: (error) => this.handleError(error, 'Failed to update notification.')
      });
  }

  deleteNotification(id: number): void {
    this.clearMessages();
    this.notificationService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Notification deleted successfully.';
        this.loadNotifications();
        this.loadUserNotifications();
      },
      error: (error) => this.handleError(error, 'Failed to delete notification.')
    });
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private handleError(error: unknown, fallbackMessage: string): void {
    let message = fallbackMessage;

    if (error instanceof HttpErrorResponse) {
      const apiMessage = error.error?.message;
      const apiData = error.error?.data;
      if (apiMessage) {
        message = apiMessage;
      }
      if (apiData && typeof apiData === 'object') {
        const validationMessages = Object.values(apiData).join(' ');
        if (validationMessages) {
          message = `${message} ${validationMessages}`.trim();
        }
      }
    }

    this.errorMessage = message;
  }
}
