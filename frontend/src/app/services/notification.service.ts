import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { ApiResponse } from '../models/api-response';
import { Notification } from '../models/notification';
import { NotificationStatus } from '../models/notification-status';

export interface CreateNotificationRequest {
  title: string;
  content: string;
  userId: number;
}

export interface UpdateNotificationRequest {
  title?: string;
  content?: string;
  status?: NotificationStatus;
  userId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly baseUrl = 'http://13.60.30.143:8080/api/notifications';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Notification[]> {
    return this.http
      .get<ApiResponse<Notification[]>>(this.baseUrl)
      .pipe(map((response) => response.data));
  }

  getById(id: number): Observable<Notification> {
    return this.http
      .get<ApiResponse<Notification>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  create(request: CreateNotificationRequest): Observable<Notification> {
    return this.http
      .post<ApiResponse<Notification>>(this.baseUrl, request)
      .pipe(map((response) => response.data));
  }

  update(id: number, request: UpdateNotificationRequest): Observable<Notification> {
    return this.http
      .put<ApiResponse<Notification>>(`${this.baseUrl}/${id}`, request)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(map(() => undefined));
  }
}
