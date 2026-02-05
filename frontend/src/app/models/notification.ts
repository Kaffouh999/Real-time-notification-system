import { NotificationStatus } from './notification-status';
import { User } from './user';

export interface Notification {
  id: number;
  title: string;
  content: string;
  status: NotificationStatus;
  createdAt: string;
  user?: User;
}
