import type { AppointmentRequest, ContactMessage } from "@/types";
import { mockFetch } from "./api/client";

export const appointmentService = {
  request: (payload: AppointmentRequest) =>
    mockFetch({ ok: true, id: `req_${Date.now()}`, payload }),
};

export const contactService = {
  send: (payload: ContactMessage) =>
    mockFetch({ ok: true, id: `msg_${Date.now()}`, payload }),
};
