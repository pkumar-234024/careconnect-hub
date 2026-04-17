import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "s-cardio",
    title: "Cardiology",
    description:
      "Comprehensive heart care — from preventive screenings to advanced interventional procedures.",
    icon: "HeartPulse",
    highlights: ["ECG & Echo", "Cardiac Rehab", "24/7 Emergency"],
  },
  {
    id: "s-neuro",
    title: "Neurology",
    description:
      "Expert diagnosis and treatment for disorders of the brain, spine, and nervous system.",
    icon: "Brain",
    highlights: ["Stroke Unit", "EEG / EMG", "Memory Clinic"],
  },
  {
    id: "s-pediatrics",
    title: "Pediatrics",
    description:
      "Gentle, child-centered care for newborns, children, and adolescents through every milestone.",
    icon: "Baby",
    highlights: ["Vaccinations", "Growth Monitoring", "Adolescent Health"],
  },
  {
    id: "s-ortho",
    title: "Orthopedics",
    description:
      "Restoring movement and relieving pain through modern surgical and non-surgical care.",
    icon: "Bone",
    highlights: ["Joint Replacement", "Sports Injuries", "Physiotherapy"],
  },
  {
    id: "s-derma",
    title: "Dermatology",
    description:
      "Healthy skin, naturally — from routine concerns to advanced cosmetic treatments.",
    icon: "Sparkles",
    highlights: ["Acne Care", "Skin Cancer Screening", "Aesthetic Care"],
  },
  {
    id: "s-emergency",
    title: "24/7 Emergency",
    description:
      "Around-the-clock emergency response with rapid triage and a multi-specialty team.",
    icon: "Ambulance",
    highlights: ["Trauma Care", "ICU", "Ambulance Service"],
  },
];
