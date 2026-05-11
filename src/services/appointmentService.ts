import type {
  AppointmentRecord,
  AppointmentRequest,
  AuthStatusResponse,
  ContactMessage,
  LoginResponse,
  PagedResult,
  AppointmentStatus,
} from "@/types";
import { apiRequest } from "./api/client";

export const appointmentService = {
  list: (page = 1, perPage = 50, status?: AppointmentStatus) => {
    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });

    if (status) {
      params.set("status", status);
    }

    return apiRequest<PagedResult<AppointmentRecord>>(`/appointments?${params.toString()}`);
  },
  request: (payload: AppointmentRequest) =>
    apiRequest<AppointmentRecord>("/appointments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  approve: (id: string) =>
    apiRequest<AppointmentRecord>(`/appointments/${id}/approve`, {
      method: "POST",
    }),
  decline: (id: string, reason?: string) =>
    apiRequest<AppointmentRecord>(`/appointments/${id}/decline`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    }),
};

export const authService = {
  login: (email: string, password: string) =>
    apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  status: () => apiRequest<AuthStatusResponse>("/auth/status"),
  logout: () =>
    apiRequest<{ message: string }>("/auth/logout", {
      method: "POST",
    }),
};

export const contactService = {
  send: (payload: ContactMessage) =>
    Promise.resolve({ ok: true, id: `msg_${Date.now()}`, payload }),
};
