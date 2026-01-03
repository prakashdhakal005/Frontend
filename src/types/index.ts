export enum BugSeverity {
  Low = 1,
  Medium = 2,
  High = 3
}

export enum BugStatus {
  Open = 1,
  InProgress = 2,
  Resolved = 3,
  Closed = 4
}

export interface User {
  email: string;
  fullName: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
  expiresAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: string;
}

export interface BugAttachment {
  id: number;
  fileName: string;
  filePath: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface Bug {
  id: number;
  title: string;
  description: string;
  reproductionSteps: string;
  severity: BugSeverity;
  status: BugStatus;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  reportedBy: string;
  reportedByEmail: string;
  assignedTo?: string;
  assignedToEmail?: string;
  attachments: BugAttachment[];
}

export interface CreateBugData {
  title: string;
  description: string;
  reproductionSteps: string;
  severity: BugSeverity;
}

export interface UpdateBugStatusData {
  status: BugStatus;
}
