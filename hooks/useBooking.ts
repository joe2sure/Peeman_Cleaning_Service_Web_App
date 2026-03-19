"use client";
import { useState } from "react";
import { submitBooking } from "@/lib/api";
import type { BookingFormData } from "@/types";

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (data: BookingFormData) => {
    setLoading(true);
    setError(null);
    try {
      await submitBooking(data);
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Could not submit booking."
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSuccess(false);
    setError(null);
  };

  return { submit, loading, success, error, reset };
}
