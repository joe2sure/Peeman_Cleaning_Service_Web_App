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

// ─── Media / Gallery ───────────────────────────────────────────────────────
export type MediaType = "image" | "video";
export type MediaCategory =
  | "domestic"
  | "commercial"
  | "deep-clean"
  | "end-of-tenancy"
  | "carpet"
  | "after-build"
  | "general";

export interface MediaItem {
  _id: string;
  title: string;
  description?: string;
  type: MediaType;
  category: MediaCategory;
  url: string;           // Cloudinary secure_url
  thumbnailUrl?: string; // For videos: poster frame
  publicId: string;      // Cloudinary public_id
  duration?: number;     // seconds, for video
  featured: boolean;     // show on homepage
  published: boolean;    // visible to public
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryFilter {
  category?: MediaCategory | "all";
  type?: MediaType | "all";
}

// ─── Admin Auth ────────────────────────────────────────────────────────────
export interface AdminUser {
  id: string;
  email: string;
  role: "admin";
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
}

// ─── Dashboard Stats ───────────────────────────────────────────────────────
export interface DashboardStats {
  enquiries: { total: number; new: number };
  bookings:  { total: number; pending: number; confirmed: number };
  reviews:   { total: number; pending: number };
  gallery:   { total: number; published: number; featured: number };
}

// ─── Hero Slide (CMS-managed) ──────────────────────────────────────────────
export interface HeroSlide {
  _id: string;
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  headingAccent: string;
  subtext: string;
  accentColor: string;
  badgeIcon: string;
  badgeLabel: string;
  badgeValue: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  overlayOpacity: number;
  order: number;
  active: boolean;
}

// ─── Ad / Promotion ────────────────────────────────────────────────────────
export type AdType = "banner" | "card" | "fullwidth";
export type AdPlacement = "homepage" | "gallery" | "contact" | "global";

export interface Ad {
  _id: string;
  title: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  videoUrl?: string;
  type: AdType;
  placement: AdPlacement;
  backgroundColor: string;
  textColor: string;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
  clickCount: number;
  order: number;
  createdAt: string;
}


// ─── Review (full) ─────────────────────────────────────────────────────────
export interface Review {
  _id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
  status: "pending" | "approved" | "rejected";
  approved: boolean;
  email?: string;
  serviceImageUrl?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── User ──────────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  isActive: boolean;
  loginCount: number;
  lastLoginAt?: string;
  createdAt: string;
}





// // ─── Enquiry ───────────────────────────────────────────────────────────────
// export interface EnquiryFormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone?: string;
//   service: string;
//   message: string;
// }

// export interface Enquiry extends EnquiryFormData {
//   _id: string;
//   status: "new" | "contacted" | "booked" | "closed";
//   createdAt: string;
//   updatedAt: string;
// }

// // ─── Booking ───────────────────────────────────────────────────────────────
// export interface BookingFormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   service: string;
//   address: string;
//   preferredDate: string;
//   preferredTime: string;
//   notes?: string;
// }

// export interface Booking extends BookingFormData {
//   _id: string;
//   status: "pending" | "confirmed" | "completed" | "cancelled";
//   createdAt: string;
//   updatedAt: string;
// }

// // ─── Review ────────────────────────────────────────────────────────────────
// export interface Review {
//   _id: string;
//   name: string;
//   location: string;
//   rating: number;
//   text: string;
//   service: string;
//   approved: boolean;
//   createdAt: string;
// }

// // ─── API Response ──────────────────────────────────────────────────────────
// export interface ApiResponse<T = unknown> {
//   success: boolean;
//   data?: T;
//   message?: string;
//   error?: string;
// }

// // ─── Navigation ────────────────────────────────────────────────────────────
// export interface NavLink {
//   label: string;
//   href: string;
// }

// // ─── Service ───────────────────────────────────────────────────────────────
// export interface ServiceItem {
//   icon: string;
//   title: string;
//   description: string;
//   slug: string;
// }

// // ─── Media / Gallery ───────────────────────────────────────────────────────
// export type MediaType = "image" | "video";
// export type MediaCategory =
//   | "domestic"
//   | "commercial"
//   | "deep-clean"
//   | "end-of-tenancy"
//   | "carpet"
//   | "after-build"
//   | "general";

// export interface MediaItem {
//   _id: string;
//   title: string;
//   description?: string;
//   type: MediaType;
//   category: MediaCategory;
//   url: string;           // Cloudinary secure_url
//   thumbnailUrl?: string; // For videos: poster frame
//   publicId: string;      // Cloudinary public_id
//   duration?: number;     // seconds, for video
//   featured: boolean;     // show on homepage
//   published: boolean;    // visible to public
//   uploadedAt: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface GalleryFilter {
//   category?: MediaCategory | "all";
//   type?: MediaType | "all";
// }

// // ─── Admin Auth ────────────────────────────────────────────────────────────
// export interface AdminUser {
//   id: string;
//   email: string;
//   role: "admin";
// }

// export interface AuthState {
//   user: AdminUser | null;
//   token: string | null;
//   loading: boolean;
// }

// // ─── Dashboard Stats ───────────────────────────────────────────────────────
// export interface DashboardStats {
//   enquiries: { total: number; new: number };
//   bookings:  { total: number; pending: number; confirmed: number };
//   reviews:   { total: number; pending: number };
//   gallery:   { total: number; published: number; featured: number };
// }