import axios from "axios";
import type { MediaCategory, MediaType } from "@/types";

const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

// Inject stored token on every request
adminApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("peeman_admin_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-redirect to login on 401
adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("peeman_admin_token");
      localStorage.removeItem("peeman_admin_user");
      window.location.href = "/admin/login";
    }
    const message = err?.response?.data?.message || err?.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────────
export const adminLogin = async (email: string, password: string) => {
  const res = await adminApi.post("/api/v1/auth/login", { email, password });
  return res.data;
};

// ─── Dashboard Stats ───────────────────────────────────────────────────────
export const fetchDashboardStats = async () => {
  const [eq, bk, rv, gl] = await Promise.allSettled([
    adminApi.get("/api/v1/enquiries?limit=1"),
    adminApi.get("/api/v1/bookings?limit=1"),
    adminApi.get("/api/v1/reviews/all?limit=1"),
    adminApi.get("/api/v1/media/gallery/stats"),
  ]);

  return {
    enquiries: eq.status === "fulfilled" ? eq.value.data : null,
    bookings:  bk.status === "fulfilled" ? bk.value.data : null,
    reviews:   rv.status === "fulfilled" ? rv.value.data : null,
    gallery:   gl.status === "fulfilled" ? gl.value.data.data : null,
  };
};

// ─── Enquiries ─────────────────────────────────────────────────────────────
export const getAdminEnquiries = (page = 1, limit = 20, status?: string) =>
  adminApi.get("/api/v1/enquiries", { params: { page, limit, status } });

export const patchEnquiryStatus = (id: string, status: string, notes?: string) =>
  adminApi.patch(`/api/v1/enquiries/${id}`, { status, notes });

export const deleteEnquiry = (id: string) =>
  adminApi.delete(`/api/v1/enquiries/${id}`);

// ─── Bookings ──────────────────────────────────────────────────────────────
export const getAdminBookings = (page = 1, limit = 20, status?: string) =>
  adminApi.get("/api/v1/bookings", { params: { page, limit, status } });

export const patchBookingStatus = (id: string, status: string) =>
  adminApi.patch(`/api/v1/bookings/${id}`, { status });

export const deleteBooking = (id: string) =>
  adminApi.delete(`/api/v1/bookings/${id}`);

// ─── Reviews ───────────────────────────────────────────────────────────────
export const getAdminReviews = (page = 1, limit = 20) =>
  adminApi.get("/api/v1/reviews/all", { params: { page, limit } });

// export const approveReview = (id: string) =>
//   adminApi.patch(`/api/v1/reviews/${id}/approve`);

export const deleteReview = (id: string) =>
  adminApi.delete(`/api/v1/reviews/${id}`);

// ─── Gallery ───────────────────────────────────────────────────────────────
export const getAdminGallery = (params?: {
  page?: number;
  limit?: number;
  category?: MediaCategory;
  type?: MediaType;
  published?: boolean;
}) => adminApi.get("/api/v1/media/gallery/admin", { params });

export const uploadGalleryMedia = (formData: FormData) =>
  adminApi.post("/api/v1/media/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const patchGalleryItem = (
  id: string,
  data: { title?: string; description?: string; category?: string; featured?: boolean; published?: boolean }
) => adminApi.patch(`/api/v1/media/gallery/${id}`, data);

export const deleteGalleryItem = (id: string) =>
  adminApi.delete(`/api/v1/media/gallery/${id}`);

export const fetchGalleryStats = () =>
  adminApi.get("/api/v1/media/gallery/stats");

export default adminApi;

// ─── Hero Slides (admin) ───────────────────────────────────────────────────
export const getAdminHeroSlides = () =>
  adminApi.get("/api/v1/hero/admin");

export const createHeroSlide = (formData: FormData) =>
  adminApi.post("/api/v1/hero", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateHeroSlide = (id: string, formData: FormData) =>
  adminApi.patch(`/api/v1/hero/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteHeroSlide = (id: string) =>
  adminApi.delete(`/api/v1/hero/${id}`);

export const toggleHeroSlide = (id: string, active: boolean) =>
  adminApi.patch(`/api/v1/hero/${id}/toggle`, { active });

export const reorderHeroSlides = (orderedIds: string[]) =>
  adminApi.patch("/api/v1/hero/reorder", { orderedIds });

// ─── Ads (admin) ───────────────────────────────────────────────────────────
export const getAdminAds = () =>
  adminApi.get("/api/v1/ads/admin");

export const createAd = (formData: FormData) =>
  adminApi.post("/api/v1/ads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateAd = (id: string, formData: FormData) =>
  adminApi.patch(`/api/v1/ads/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteAd = (id: string) =>
  adminApi.delete(`/api/v1/ads/${id}`);


export const approveReview = (id: string, adminNote?: string) =>
  adminApi.patch(`/api/v1/reviews/${id}/approve`, { adminNote });

export const rejectReview = (id: string, adminNote?: string) =>
  adminApi.patch(`/api/v1/reviews/${id}/reject`, { adminNote });


// import axios from "axios";
// import type { MediaCategory, MediaType } from "@/types";

// const adminApi = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   timeout: 30000,
// });

// // Inject stored token on every request
// adminApi.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("peeman_admin_token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Auto-redirect to login on 401
// adminApi.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err?.response?.status === 401 && typeof window !== "undefined") {
//       localStorage.removeItem("peeman_admin_token");
//       localStorage.removeItem("peeman_admin_user");
//       window.location.href = "/admin/login";
//     }
//     const message = err?.response?.data?.message || err?.message || "Request failed";
//     return Promise.reject(new Error(message));
//   }
// );

// // ─── Auth ──────────────────────────────────────────────────────────────────
// export const adminLogin = async (email: string, password: string) => {
//   const res = await adminApi.post("/api/v1/auth/login", { email, password });
//   return res.data;
// };

// // ─── Dashboard Stats ───────────────────────────────────────────────────────
// export const fetchDashboardStats = async () => {
//   const [eq, bk, rv, gl] = await Promise.allSettled([
//     adminApi.get("/api/v1/enquiries?limit=1"),
//     adminApi.get("/api/v1/bookings?limit=1"),
//     adminApi.get("/api/v1/reviews/all?limit=1"),
//     adminApi.get("/api/v1/media/gallery/stats"),
//   ]);

//   return {
//     enquiries: eq.status === "fulfilled" ? eq.value.data : null,
//     bookings:  bk.status === "fulfilled" ? bk.value.data : null,
//     reviews:   rv.status === "fulfilled" ? rv.value.data : null,
//     gallery:   gl.status === "fulfilled" ? gl.value.data.data : null,
//   };
// };

// // ─── Enquiries ─────────────────────────────────────────────────────────────
// export const getAdminEnquiries = (page = 1, limit = 20, status?: string) =>
//   adminApi.get("/api/v1/enquiries", { params: { page, limit, status } });

// export const patchEnquiryStatus = (id: string, status: string, notes?: string) =>
//   adminApi.patch(`/api/v1/enquiries/${id}`, { status, notes });

// export const deleteEnquiry = (id: string) =>
//   adminApi.delete(`/api/v1/enquiries/${id}`);

// // ─── Bookings ──────────────────────────────────────────────────────────────
// export const getAdminBookings = (page = 1, limit = 20, status?: string) =>
//   adminApi.get("/api/v1/bookings", { params: { page, limit, status } });

// export const patchBookingStatus = (id: string, status: string) =>
//   adminApi.patch(`/api/v1/bookings/${id}`, { status });

// export const deleteBooking = (id: string) =>
//   adminApi.delete(`/api/v1/bookings/${id}`);

// // ─── Reviews ───────────────────────────────────────────────────────────────
// export const getAdminReviews = (page = 1, limit = 20) =>
//   adminApi.get("/api/v1/reviews/all", { params: { page, limit } });

// export const approveReview = (id: string) =>
//   adminApi.patch(`/api/v1/reviews/${id}/approve`);

// export const deleteReview = (id: string) =>
//   adminApi.delete(`/api/v1/reviews/${id}`);

// // ─── Gallery ───────────────────────────────────────────────────────────────
// export const getAdminGallery = (params?: {
//   page?: number;
//   limit?: number;
//   category?: MediaCategory;
//   type?: MediaType;
//   published?: boolean;
// }) => adminApi.get("/api/v1/media/gallery/admin", { params });

// export const uploadGalleryMedia = (formData: FormData) =>
//   adminApi.post("/api/v1/media/gallery", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

// export const patchGalleryItem = (
//   id: string,
//   data: { title?: string; description?: string; category?: string; featured?: boolean; published?: boolean }
// ) => adminApi.patch(`/api/v1/media/gallery/${id}`, data);

// export const deleteGalleryItem = (id: string) =>
//   adminApi.delete(`/api/v1/media/gallery/${id}`);

// export const fetchGalleryStats = () =>
//   adminApi.get("/api/v1/media/gallery/stats");

// export default adminApi;
