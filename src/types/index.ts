export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  image: string;
  bio?: string;
  availability?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  highlights?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
}

export interface AppointmentRequest {
  fullName: string;
  email: string;
  phone: string;
  doctorId?: string;
  serviceId?: string;
  preferredDate: string;
  notes?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}
