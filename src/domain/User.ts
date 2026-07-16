/**
 * User
 *
 * Shared domain model representing a human account holder within KDOS —
 * an owner, staff member, or client-side contact with system access.
 * Pure data shape only: no behaviour, no persistence, no validation logic.
 */

export enum UserRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  CLIENT_CONTACT = "CLIENT_CONTACT",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INVITED = "INVITED",
  SUSPENDED = "SUSPENDED",
  DEACTIVATED = "DEACTIVATED",
}

export interface User {
  readonly id: string;
  readonly companyId: string;
  readonly fullName: string;
  readonly email: string;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly title: string | null;
  readonly createdAt: Date;
  readonly lastActiveAt: Date | null;
}