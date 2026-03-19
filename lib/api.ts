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

export default api;
