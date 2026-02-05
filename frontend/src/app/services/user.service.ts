import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { ApiResponse } from '../models/api-response';
import { Notification } from '../models/notification';
import { User } from '../models/user';

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://13.60.30.143:8080/api/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http
      .get<ApiResponse<User[]>>(this.baseUrl)
      .pipe(map((response) => response.data));
  }

  getById(id: number): Observable<User> {
    return this.http
      .get<ApiResponse<User>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => response.data));
  }

  create(request: CreateUserRequest): Observable<User> {
    return this.http
      .post<ApiResponse<User>>(this.baseUrl, request)
      .pipe(map((response) => response.data));
  }

  update(id: number, request: UpdateUserRequest): Observable<User> {
    return this.http
      .put<ApiResponse<User>>(`${this.baseUrl}/${id}`, request)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(map(() => undefined));
  }

  getNotifications(userId: number): Observable<Notification[]> {
    return this.http
      .get<ApiResponse<Notification[]>>(`${this.baseUrl}/${userId}/notifications`)
      .pipe(map((response) => response.data));
  }
}
