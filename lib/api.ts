import axios from "axios";
import type { ApiResponse, EnquiryFormData, BookingFormData } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ─── Interceptors ──────────────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err?.response?.data?.message || err?.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

// ─── Enquiries ─────────────────────────────────────────────────────────────
export const submitEnquiry = async (
  data: EnquiryFormData
): Promise<ApiResponse> => {
  const res = await api.post("/api/v1/enquiries", data);
  return res.data;
};

// ─── Bookings ──────────────────────────────────────────────────────────────
export const submitBooking = async (
  data: BookingFormData
): Promise<ApiResponse> => {
  const res = await api.post("/api/v1/bookings", data);
  return res.data;
};

// ─── Reviews ───────────────────────────────────────────────────────────────
export const fetchReviews = async (): Promise<ApiResponse> => {
  const res = await api.get("/api/v1/reviews");
  return res.data;
};

export const submitReview = async (data: {
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
}): Promise<ApiResponse> => {
  const res = await api.post("/api/v1/reviews", data);
  return res.data;
};

// ─── Media / Gallery ───────────────────────────────────────────────────────
export const fetchPublishedMedia = async (params?: {
  category?: string;
  type?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse> => {
  const res = await api.get("/api/v1/media/gallery", { params });
  return res.data;
};

export const fetchFeaturedMedia = async (): Promise<ApiResponse> => {
  const res = await api.get("/api/v1/media/gallery/featured");
  return res.data;
};

export default api;

// ─── Hero Slides (public) ──────────────────────────────────────────────────
export const fetchActiveSlides = async (): Promise<ApiResponse> => {
  const res = await api.get("/api/v1/hero");
  return res.data;
};

// ─── Ads (public) ─────────────────────────────────────────────────────────
export const fetchActiveAds = async (placement?: string): Promise<ApiResponse> => {
  const res = await api.get("/api/v1/ads", { params: placement ? { placement } : {} });
  return res.data;
};

export const trackAdClick = async (id: string): Promise<void> => {
  await api.post(`/api/v1/ads/${id}/click`).catch(() => {});
};



// ─── Reviews (public) ──────────────────────────────────────────────────────
export const fetchApprovedReviews = async (): Promise<ApiResponse> => {
  const res = await api.get("/api/v1/reviews");
  return res.data;
};





// import axios from "axios";
// import type { ApiResponse, EnquiryFormData, BookingFormData } from "@/types";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: { "Content-Type": "application/json" },
//   timeout: 10000,
// });

// // ─── Interceptors ──────────────────────────────────────────────────────────
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     const message =
//       err?.response?.data?.message || err?.message || "Request failed";
//     return Promise.reject(new Error(message));
//   }
// );

// // ─── Enquiries ─────────────────────────────────────────────────────────────
// export const submitEnquiry = async (
//   data: EnquiryFormData
// ): Promise<ApiResponse> => {
//   const res = await api.post("/api/v1/enquiries", data);
//   return res.data;
// };

// // ─── Bookings ──────────────────────────────────────────────────────────────
// export const submitBooking = async (
//   data: BookingFormData
// ): Promise<ApiResponse> => {
//   const res = await api.post("/api/v1/bookings", data);
//   return res.data;
// };

// // ─── Reviews ───────────────────────────────────────────────────────────────
// export const fetchReviews = async (): Promise<ApiResponse> => {
//   const res = await api.get("/api/v1/reviews");
//   return res.data;
// };

// export const submitReview = async (data: {
//   name: string;
//   location: string;
//   rating: number;
//   text: string;
//   service: string;
// }): Promise<ApiResponse> => {
//   const res = await api.post("/api/v1/reviews", data);
//   return res.data;
// };

// // ─── Media / Gallery ───────────────────────────────────────────────────────
// export const fetchPublishedMedia = async (params?: {
//   category?: string;
//   type?: string;
//   page?: number;
//   limit?: number;
// }): Promise<ApiResponse> => {
//   const res = await api.get("/api/v1/media/gallery", { params });
//   return res.data;
// };

// export const fetchFeaturedMedia = async (): Promise<ApiResponse> => {
//   const res = await api.get("/api/v1/media/gallery/featured");
//   return res.data;
// };

// export default api;