"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEnquiry } from "@/hooks/useEnquiry";
import { SERVICE_OPTIONS } from "@/lib/constants";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const schema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Please enter at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function EnquiryForm() {
  const { submit, loading, success, error, reset } = useEnquiry();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    await submit(data);
    resetForm();
  };

  if (success) {
    return (
      <div className="border border-sage/30 bg-sage/10 rounded-xl p-7 flex flex-col items-start gap-4">
        <CheckCircle size={32} className="text-sage" />
        <div>
          <h3 className="font-serif text-xl font-semibold text-cream mb-1">
            Enquiry Received!
          </h3>
          <p className="text-white/65 text-sm">
            We&apos;ll get back to you within the hour. Check your email for a
            confirmation.
          </p>
        </div>
        <button
          onClick={reset}
          className="text-sm text-sage hover:underline mt-1"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full bg-white/[0.07] border border-sage/20 rounded px-3.5 py-2.5 text-cream text-sm placeholder:text-white/30 outline-none focus:border-sage transition-colors font-sans";
  const labelClass =
    "block text-[0.75rem] uppercase tracking-widest text-white/45 mb-1.5";
  const errorClass = "text-red-400 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>First Name</label>
          <input
            {...register("firstName")}
            placeholder="John"
            className={inputClass}
          />
          {errors.firstName && (
            <p className={errorClass}>{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Last Name</label>
          <input
            {...register("lastName")}
            placeholder="Smith"
            className={inputClass}
          />
          {errors.lastName && (
            <p className={errorClass}>{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className={labelClass}>Email Address</label>
        <input
          {...register("email")}
          type="email"
          placeholder="john@example.com"
          className={inputClass}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className={labelClass}>Phone Number (optional)</label>
        <input
          {...register("phone")}
          type="tel"
          placeholder="+44 7700 000000"
          className={inputClass}
        />
      </div>

      {/* Service */}
      <div>
        <label className={labelClass}>Service Required</label>
        <select {...register("service")} className={inputClass}>
          <option value="">Select a service…</option>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s} className="bg-pine text-cream">
              {s}
            </option>
          ))}
        </select>
        {errors.service && (
          <p className={errorClass}>{errors.service.message}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className={labelClass}>Your Message</label>
        <textarea
          {...register("message")}
          rows={4}
          placeholder="Tell us about your requirements, property size, preferred dates…"
          className={`${inputClass} resize-y min-h-[110px]`}
        />
        {errors.message && (
          <p className={errorClass}>{errors.message.message}</p>
        )}
      </div>

      {/* API error */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded px-3 py-2">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="self-start inline-flex items-center gap-2 bg-gold text-pine px-7 py-3.5 rounded text-sm font-medium hover:bg-gold-light transition-all hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {loading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Send size={15} />
        )}
        {loading ? "Sending…" : "Send Enquiry"}
      </button>
    </form>
  );
}
