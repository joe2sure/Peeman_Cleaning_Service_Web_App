"use client";
import { useState } from "react";
import { submitEnquiry } from "@/lib/api";
import type { EnquiryFormData } from "@/types";

export function useEnquiry() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (data: EnquiryFormData) => {
    setLoading(true);
    setError(null);
    try {
      await submitEnquiry(data);
      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try WhatsApp or call us."
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
