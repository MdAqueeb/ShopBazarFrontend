export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'DELETED';
export type RoleName = 'CUSTOMER' | 'SELLER' | 'ADMIN';

export interface Role {
  roleId: number;
  roleName: RoleName;
  description: string;
}

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: Role;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}
