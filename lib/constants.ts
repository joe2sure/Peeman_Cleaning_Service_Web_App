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
  { label: "Gallery", href: "/gallery" },
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

// ─── Gallery categories ────────────────────────────────────────────────────
export const GALLERY_CATEGORIES = [
  { value: "all",           label: "All Work" },
  { value: "domestic",      label: "Domestic Cleaning" },
  { value: "commercial",    label: "Commercial Cleaning" },
  { value: "deep-clean",    label: "Deep Cleaning" },
  { value: "end-of-tenancy",label: "End of Tenancy" },
  { value: "carpet",        label: "Carpet & Upholstery" },
  { value: "after-build",   label: "After-Build" },
  { value: "general",       label: "General" },
] as const;

export const MEDIA_TYPES = [
  { value: "all",   label: "All Media" },
  { value: "image", label: "Photos" },
  { value: "video", label: "Videos" },
] as const;

// ─── Placeholder / demo gallery items (used when API has no content yet) ──
import type { MediaItem } from "@/types";

export const DEMO_GALLERY: MediaItem[] = [
  {
    _id: "demo-1",
    title: "Kitchen Deep Clean — Before & After",
    description: "Complete kitchen restoration including oven, tiles and worktops.",
    type: "image",
    category: "deep-clean",
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    publicId: "demo-1",
    featured: true,
    published: true,
    uploadedAt: "2024-07-01",
    createdAt: "2024-07-01",
    updatedAt: "2024-07-01",
  },
  {
    _id: "demo-2",
    title: "Office Block Weekly Clean",
    description: "3-floor commercial office block in Wolverhampton city centre.",
    type: "image",
    category: "commercial",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    publicId: "demo-2",
    featured: true,
    published: true,
    uploadedAt: "2024-07-05",
    createdAt: "2024-07-05",
    updatedAt: "2024-07-05",
  },
  {
    _id: "demo-3",
    title: "End of Tenancy — 3-Bed House",
    description: "Full end of tenancy clean. Deposit returned in full.",
    type: "image",
    category: "end-of-tenancy",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    publicId: "demo-3",
    featured: false,
    published: true,
    uploadedAt: "2024-07-10",
    createdAt: "2024-07-10",
    updatedAt: "2024-07-10",
  },
  {
    _id: "demo-4",
    title: "Carpet Steam Cleaning",
    description: "Living room carpet restored to near-new condition.",
    type: "image",
    category: "carpet",
    url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
    publicId: "demo-4",
    featured: true,
    published: true,
    uploadedAt: "2024-07-12",
    createdAt: "2024-07-12",
    updatedAt: "2024-07-12",
  },
  {
    _id: "demo-5",
    title: "After-Build Site Clean",
    description: "Post-construction clean on new-build development in Penn.",
    type: "image",
    category: "after-build",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    publicId: "demo-5",
    featured: false,
    published: true,
    uploadedAt: "2024-07-15",
    createdAt: "2024-07-15",
    updatedAt: "2024-07-15",
  },
  {
    _id: "demo-6",
    title: "Domestic Weekly Clean",
    description: "Regular fortnightly clean for a family home in Tettenhall.",
    type: "image",
    category: "domestic",
    url: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80",
    publicId: "demo-6",
    featured: false,
    published: true,
    uploadedAt: "2024-07-18",
    createdAt: "2024-07-18",
    updatedAt: "2024-07-18",
  },
  {
    _id: "demo-7",
    title: "Bathroom Deep Clean",
    description: "Full bathroom restoration — grout, tiles and fixtures.",
    type: "image",
    category: "deep-clean",
    url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80",
    publicId: "demo-7",
    featured: true,
    published: true,
    uploadedAt: "2024-07-20",
    createdAt: "2024-07-20",
    updatedAt: "2024-07-20",
  },
  {
    _id: "demo-8",
    title: "Retail Shop Floor Clean",
    description: "Weekly retail cleaning contract — Wolverhampton high street.",
    type: "image",
    category: "commercial",
    url: "https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=800&q=80",
    publicId: "demo-8",
    featured: false,
    published: true,
    uploadedAt: "2024-07-22",
    createdAt: "2024-07-22",
    updatedAt: "2024-07-22",
  },
];




// import type { ServiceItem, NavLink } from "@/types";

// export const SITE = {
//   name: "Peeman Cleaning Services",
//   tagline: "Spotless Spaces. Exceptional Care.",
//   email: "peacee4real@gmail.com",
//   phone: "+44 07404559317",
//   whatsapp: "4407404559317",
//   address: "23 Victoria Street",
//   city: "Wolverhampton",
//   postcode: "WV1 3NP",
//   country: "United Kingdom",
//   hours: {
//     weekday: "Mon – Sat: 7am – 8pm",
//     weekend: "Sun: 8am – 5pm",
//   },
// };

// export const NAV_LINKS: NavLink[] = [
//   { label: "Services", href: "/#services" },
//   { label: "Why Us", href: "/#why" },
//   { label: "Process", href: "/#process" },
//   { label: "Reviews", href: "/#reviews" },
//   { label: "Contact", href: "/#contact" },
// ];

// export const SERVICES: ServiceItem[] = [
//   {
//     icon: "🏠",
//     title: "Domestic Cleaning",
//     description:
//       "Regular home cleans that keep your living space fresh and hygienic. Weekly, fortnightly or bespoke schedules available.",
//     slug: "domestic",
//   },
//   {
//     icon: "🏢",
//     title: "Commercial Cleaning",
//     description:
//       "Offices, retail spaces and public buildings kept immaculate. Flexible hours including early morning and evening slots.",
//     slug: "commercial",
//   },
//   {
//     icon: "✨",
//     title: "Deep Cleaning",
//     description:
//       "A thorough top-to-bottom clean covering every surface, appliance and corner — perfect for a seasonal refresh.",
//     slug: "deep-clean",
//   },
//   {
//     icon: "🔑",
//     title: "End of Tenancy",
//     description:
//       "Deposit-back quality cleans for landlords and tenants. We meet letting agency standards — guaranteed.",
//     slug: "end-of-tenancy",
//   },
//   {
//     icon: "🪑",
//     title: "Carpet & Upholstery",
//     description:
//       "Hot water extraction and specialist treatments that revive carpets, sofas and curtains to like-new condition.",
//     slug: "carpet-upholstery",
//   },
//   {
//     icon: "🏗️",
//     title: "After-Build Cleaning",
//     description:
//       "Post-construction dust, debris and residue removed efficiently so your space is ready to inhabit immediately.",
//     slug: "after-build",
//   },
// ];

// export const SERVICE_OPTIONS = SERVICES.map((s) => s.title).concat(["Other"]);

// export const STATS = [
//   { value: "500+", label: "Happy Clients" },
//   { value: "8+", label: "Years Experience" },
//   { value: "4.9★", label: "Avg Rating" },
// ];

// export const WHY_US = [
//   {
//     num: "01",
//     title: "Fully Insured & DBS Checked",
//     body: "Every member of our team is DBS-cleared and our work is fully insured, giving you complete peace of mind.",
//   },
//   {
//     num: "02",
//     title: "Eco-Friendly Products",
//     body: "We use biodegradable, non-toxic cleaning solutions that are safe for children, pets and the environment.",
//   },
//   {
//     num: "03",
//     title: "Flexible Scheduling",
//     body: "Weekends, evenings, same-day — we work around your life, not the other way around.",
//   },
//   {
//     num: "04",
//     title: "Transparent Pricing",
//     body: "No hidden fees. You receive a clear quote before any work begins. What you see is exactly what you pay.",
//   },
//   {
//     num: "05",
//     title: "Consistent Teams",
//     body: "We assign the same cleaners to your property so they learn your preferences and maintain your standards.",
//   },
//   {
//     num: "06",
//     title: "Satisfaction Guarantee",
//     body: "Not happy? We'll return within 24 hours and re-clean at no extra charge. Your satisfaction is our priority.",
//   },
// ];

// export const PROCESS_STEPS = [
//   {
//     num: "1",
//     title: "Get in Touch",
//     body: "Call us, send a WhatsApp, or fill in the contact form — we respond within the hour.",
//   },
//   {
//     num: "2",
//     title: "Free Quote",
//     body: "We assess your requirements and provide a clear, no-obligation quote with no hidden costs.",
//   },
//   {
//     num: "3",
//     title: "Book a Date",
//     body: "Choose a date and time that suits you. We confirm everything via your preferred channel.",
//   },
//   {
//     num: "4",
//     title: "We Clean & You Relax",
//     body: "Our team arrives, does the job thoroughly, and leaves your space immaculate.",
//   },
// ];

// export const STATIC_REVIEWS = [
//   {
//     _id: "1",
//     name: "Sarah K.",
//     location: "Wolverhampton City Centre",
//     rating: 5,
//     service: "End of Tenancy",
//     text: "Absolutely brilliant service. My flat was transformed after the end of tenancy clean — I got my full deposit back. Cannot recommend Peeman enough!",
//     approved: true,
//     createdAt: "2024-06-01",
//   },
//   {
//     _id: "2",
//     name: "James O.",
//     location: "Penn, Wolverhampton",
//     rating: 5,
//     service: "Commercial Cleaning",
//     text: "We use Peeman for our office on a weekly basis. Always punctual, always thorough. The team is friendly and trustworthy. A pleasure to work with.",
//     approved: true,
//     createdAt: "2024-06-15",
//   },
//   {
//     _id: "3",
//     name: "Amina M.",
//     location: "Tettenhall, Wolverhampton",
//     rating: 5,
//     service: "Deep Cleaning",
//     text: "Had a deep clean done before moving into our new home. Every surface was immaculate. The team was professional, quick and the price was very fair.",
//     approved: true,
//     createdAt: "2024-07-01",
//   },
// ];
