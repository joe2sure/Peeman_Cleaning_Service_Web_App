import type { ServiceItem, NavLink } from "@/types";

export const SITE = {
  name: "Peeman Cleaning Services",
  tagline: "Spotless Spaces. Exceptional Care.",
  email: "peacee4real@gmail.com",
  phone: "+44 1902 000 000",
  whatsapp: "441902000000",
  address: "23 Victoria Street",
  city: "Wolverhampton",
  postcode: "WV1 3NP",
  country: "United Kingdom",
  hours: {
    weekday: "Mon – Sat: 7am – 8pm",
    weekend: "Sun: 8am – 5pm",
  },
};

export const NAV_LINKS: NavLink[] = [
  { label: "Services", href: "/#services" },
  { label: "Why Us", href: "/#why" },
  { label: "Process", href: "/#process" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Contact", href: "/#contact" },
];

export const SERVICES: ServiceItem[] = [
  {
    icon: "🏠",
    title: "Domestic Cleaning",
    description:
      "Regular home cleans that keep your living space fresh and hygienic. Weekly, fortnightly or bespoke schedules available.",
    slug: "domestic",
  },
  {
    icon: "🏢",
    title: "Commercial Cleaning",
    description:
      "Offices, retail spaces and public buildings kept immaculate. Flexible hours including early morning and evening slots.",
    slug: "commercial",
  },
  {
    icon: "✨",
    title: "Deep Cleaning",
    description:
      "A thorough top-to-bottom clean covering every surface, appliance and corner — perfect for a seasonal refresh.",
    slug: "deep-clean",
  },
  {
    icon: "🔑",
    title: "End of Tenancy",
    description:
      "Deposit-back quality cleans for landlords and tenants. We meet letting agency standards — guaranteed.",
    slug: "end-of-tenancy",
  },
  {
    icon: "🪑",
    title: "Carpet & Upholstery",
    description:
      "Hot water extraction and specialist treatments that revive carpets, sofas and curtains to like-new condition.",
    slug: "carpet-upholstery",
  },
  {
    icon: "🏗️",
    title: "After-Build Cleaning",
    description:
      "Post-construction dust, debris and residue removed efficiently so your space is ready to inhabit immediately.",
    slug: "after-build",
  },
];

export const SERVICE_OPTIONS = SERVICES.map((s) => s.title).concat(["Other"]);

export const STATS = [
  { value: "500+", label: "Happy Clients" },
  { value: "8+", label: "Years Experience" },
  { value: "4.9★", label: "Avg Rating" },
];

export const WHY_US = [
  {
    num: "01",
    title: "Fully Insured & DBS Checked",
    body: "Every member of our team is DBS-cleared and our work is fully insured, giving you complete peace of mind.",
  },
  {
    num: "02",
    title: "Eco-Friendly Products",
    body: "We use biodegradable, non-toxic cleaning solutions that are safe for children, pets and the environment.",
  },
  {
    num: "03",
    title: "Flexible Scheduling",
    body: "Weekends, evenings, same-day — we work around your life, not the other way around.",
  },
  {
    num: "04",
    title: "Transparent Pricing",
    body: "No hidden fees. You receive a clear quote before any work begins. What you see is exactly what you pay.",
  },
  {
    num: "05",
    title: "Consistent Teams",
    body: "We assign the same cleaners to your property so they learn your preferences and maintain your standards.",
  },
  {
    num: "06",
    title: "Satisfaction Guarantee",
    body: "Not happy? We'll return within 24 hours and re-clean at no extra charge. Your satisfaction is our priority.",
  },
];

export const PROCESS_STEPS = [
  {
    num: "1",
    title: "Get in Touch",
    body: "Call us, send a WhatsApp, or fill in the contact form — we respond within the hour.",
  },
  {
    num: "2",
    title: "Free Quote",
    body: "We assess your requirements and provide a clear, no-obligation quote with no hidden costs.",
  },
  {
    num: "3",
    title: "Book a Date",
    body: "Choose a date and time that suits you. We confirm everything via your preferred channel.",
  },
  {
    num: "4",
    title: "We Clean & You Relax",
    body: "Our team arrives, does the job thoroughly, and leaves your space immaculate.",
  },
];

export const STATIC_REVIEWS = [
  {
    _id: "1",
    name: "Sarah K.",
    location: "Wolverhampton City Centre",
    rating: 5,
    service: "End of Tenancy",
    text: "Absolutely brilliant service. My flat was transformed after the end of tenancy clean — I got my full deposit back. Cannot recommend Peeman enough!",
    approved: true,
    createdAt: "2024-06-01",
  },
  {
    _id: "2",
    name: "James O.",
    location: "Penn, Wolverhampton",
    rating: 5,
    service: "Commercial Cleaning",
    text: "We use Peeman for our office on a weekly basis. Always punctual, always thorough. The team is friendly and trustworthy. A pleasure to work with.",
    approved: true,
    createdAt: "2024-06-15",
  },
  {
    _id: "3",
    name: "Amina M.",
    location: "Tettenhall, Wolverhampton",
    rating: 5,
    service: "Deep Cleaning",
    text: "Had a deep clean done before moving into our new home. Every surface was immaculate. The team was professional, quick and the price was very fair.",
    approved: true,
    createdAt: "2024-07-01",
  },
];
