// ─── Enquiry ───────────────────────────────────────────────────────────────
export interface EnquiryFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
}

export interface Enquiry extends EnquiryFormData {
  _id: string;
  status: "new" | "contacted" | "booked" | "closed";
  createdAt: string;
  updatedAt: string;
}

// ─── Booking ───────────────────────────────────────────────────────────────
export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

export interface Booking extends BookingFormData {
  _id: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

// ─── Review ────────────────────────────────────────────────────────────────
export interface Review {
  _id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
  approved: boolean;
  createdAt: string;
}

// ─── API Response ──────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ─── Navigation ────────────────────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
}

// ─── Service ───────────────────────────────────────────────────────────────
export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  slug: string;
}
