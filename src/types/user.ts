export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: UserStatus;
  roleId: number;
  blockReason?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}
