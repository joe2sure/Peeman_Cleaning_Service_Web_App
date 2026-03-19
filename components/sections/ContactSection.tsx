import { SITE } from "@/lib/constants";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { Mail, Phone, MapPin } from "lucide-react";

const channels = [
  {
    type: "whatsapp",
    href: `https://wa.me/${SITE.whatsapp}`,
    label: "WhatsApp",
    value: SITE.phone,
    external: true,
    iconBg: "bg-[rgba(37,211,102,0.15)]",
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.123.55 4.116 1.514 5.843L.036 23.5l5.805-1.523A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.359-.213-3.722.976.994-3.626-.234-.373A9.817 9.817 0 0 1 2.182 12C2.182 6.569 6.569 2.182 12 2.182c5.432 0 9.818 4.387 9.818 9.818 0 5.432-4.386 9.818-9.818 9.818z" />
      </svg>
    ),
  },
  {
    type: "email",
    href: `mailto:${SITE.email}`,
    label: "Email",
    value: SITE.email,
    external: false,
    iconBg: "bg-gold/[0.15]",
    icon: <Mail size={18} className="text-gold" />,
  },
  {
    type: "phone",
    href: `tel:${SITE.phone}`,
    label: "Phone / Call",
    value: SITE.phone,
    external: false,
    iconBg: "bg-sage/[0.15]",
    icon: <Phone size={18} className="text-sage" />,
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="bg-pine py-[88px] px-[5vw]">
      <span className="section-label-light">Contact Us</span>
      <h2 className="font-serif text-[clamp(2rem,3.5vw,2.8rem)] font-semibold text-cream leading-tight mb-3">
        Let&apos;s Get Your Space Sparkling
      </h2>
      <p className="text-white/60 font-light max-w-xl mb-12 text-base">
        Reach us however suits you best — we&apos;re always just a message or
        call away.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
        {/* Left — channels + address */}
        <div>
          <div className="flex flex-col gap-4 mb-10">
            {channels.map((ch) => (
              <a
                key={ch.type}
                href={ch.href}
                target={ch.external ? "_blank" : undefined}
                rel={ch.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 border border-sage/20 rounded-xl px-5 py-4 hover:bg-white/[0.06] hover:border-sage transition-colors group"
              >
                <div
                  className={`w-11 h-11 rounded-[10px] flex items-center justify-center flex-shrink-0 ${ch.iconBg}`}
                >
                  {ch.icon}
                </div>
                <div className="flex-1">
                  <p className="text-[0.72rem] uppercase tracking-widest text-white/40 mb-0.5">
                    {ch.label}
                  </p>
                  <p className="text-cream text-sm font-medium">{ch.value}</p>
                </div>
                <span className="text-white/25 group-hover:text-sage group-hover:translate-x-1 transition-all text-lg">
                  →
                </span>
              </a>
            ))}
          </div>

          {/* Address */}
          <div className="border-t border-sage/15 pt-7 flex flex-col sm:flex-row gap-8">
            <div className="flex items-start gap-3">
              <MapPin size={15} className="text-sage/50 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-[0.7rem] uppercase tracking-widest text-white/35 mb-1">
                  Address
                </p>
                <p className="text-white/75 text-sm">{SITE.address}</p>
                <p className="text-white/75 text-sm">
                  {SITE.city}, {SITE.postcode}
                </p>
                <p className="text-white/75 text-sm">{SITE.country}</p>
              </div>
            </div>
            <div>
              <p className="text-[0.7rem] uppercase tracking-widest text-white/35 mb-1">
                Hours
              </p>
              <p className="text-white/75 text-sm">{SITE.hours.weekday}</p>
              <p className="text-white/75 text-sm">{SITE.hours.weekend}</p>
            </div>
          </div>
        </div>

        {/* Right — enquiry form */}
        <EnquiryForm />
      </div>
    </section>
  );
}
