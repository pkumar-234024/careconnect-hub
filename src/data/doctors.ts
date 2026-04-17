import type { Doctor } from "@/types";

export const doctors: Doctor[] = [
  {
    id: "d-001",
    name: "Dr. Amelia Chen",
    specialization: "Cardiology",
    experienceYears: 14,
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80&auto=format&fit=crop",
    bio: "Specialist in preventive cardiology and advanced echocardiography.",
    availability: "Mon – Thu",
  },
  {
    id: "d-002",
    name: "Dr. Marcus Hale",
    specialization: "Neurology",
    experienceYears: 18,
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80&auto=format&fit=crop",
    bio: "Focus on stroke care, epilepsy, and cognitive disorders.",
    availability: "Tue – Sat",
  },
  {
    id: "d-003",
    name: "Dr. Priya Nair",
    specialization: "Pediatrics",
    experienceYears: 10,
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80&auto=format&fit=crop",
    bio: "Compassionate pediatric care from newborn to adolescence.",
    availability: "Mon – Fri",
  },
  {
    id: "d-004",
    name: "Dr. Jonas Müller",
    specialization: "Orthopedics",
    experienceYears: 21,
    image:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&q=80&auto=format&fit=crop",
    bio: "Joint replacement and sports injury rehabilitation expert.",
    availability: "Wed – Sun",
  },
  {
    id: "d-005",
    name: "Dr. Sara Okafor",
    specialization: "Dermatology",
    experienceYears: 9,
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80&auto=format&fit=crop",
    bio: "Medical and cosmetic dermatology with a gentle approach.",
    availability: "Mon, Wed, Fri",
  },
  {
    id: "d-006",
    name: "Dr. Liam O'Connor",
    specialization: "General Medicine",
    experienceYears: 12,
    image:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=80&auto=format&fit=crop",
    bio: "Primary care, chronic disease management, and wellness.",
    availability: "Mon – Sat",
  },
];
