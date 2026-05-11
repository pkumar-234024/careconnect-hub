export interface Doctor {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  highlights?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
}

export interface AppointmentRequest {
  patientName: string;
  patientEmail: string;
  patientPhoneNumber: string;
  doctorUserId: string;
  appointmentDateTime: string;
  reason: string;
}

export type AppointmentStatus = "Pending" | "Approved" | "Declined" | "Cancelled";

export interface AppointmentRecord extends AppointmentRequest {
  id: string;
  doctorName: string;
  status: AppointmentStatus;
  reviewedByUserId: string | null;
  reviewedAt: string | null;
  decisionNote: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  createdAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: UserDto;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: string;
  refreshTokenExpires: string;
  emailVerified: boolean;
  isAccountLocked: boolean;
}

export interface AuthStatusResponse {
  isAuthenticated: boolean;
  userId: string;
  email: string;
  roles: string[];
  emailVerified: boolean;
  isAccountLocked: boolean;
  accessFailedCount: number;
  tokenExpires: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}
