import React, { useMemo } from "react";
import { useTenant } from "../context/TenantContext";

/* ---------- helpers: live open/closed status ---------- */

const DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function dayIndexFromLabel(label) {
  const s = label.trim().toLowerCase();
  return DAY_NAMES.findIndex((d) => d.startsWith(s.slice(0, 3)));
}

function parseDayRange(dayStr) {
  if (!dayStr) return [];
  const normalized = dayStr.trim().toLowerCase();
  if (normalized.includes("daily") || normalized.includes("every day")) {
    return [0, 1, 2, 3, 4, 5, 6];
  }
  const parts = normalized
    .split(/[-–—]|(?:\bto\b)/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length === 1) {
    const idx = dayIndexFromLabel(parts[0]);
    return idx === -1 ? [] : [idx];
  }
  if (parts.length === 2) {
    const start = dayIndexFromLabel(parts[0]);
    const end = dayIndexFromLabel(parts[1]);
    if (start === -1 || end === -1) return [];
    const range = [];
    let i = start;
    while (true) {
      range.push(i);
      if (i === end) break;
      i = (i + 1) % 7;
    }
    return range;
  }
  return [];
}

function parseTimeRange(timeStr) {
  if (!timeStr) return null;
  const normalized = timeStr.trim().toLowerCase();
  if (normalized.includes("closed")) return { closed: true };

  const match = normalized.match(
    /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*[-–—]\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/,
  );
  if (!match) return null;

  let [, h1, m1, ap1, h2, m2, ap2] = match;
  ap1 = ap1 || ap2;
  ap2 = ap2 || ap1;
  if (!ap1 || !ap2) return null;

  const to24 = (h, ap) => {
    h = parseInt(h, 10);
    if (ap === "pm" && h !== 12) h += 12;
    if (ap === "am" && h === 12) h = 0;
    return h;
  };

  const start = to24(h1, ap1) * 60 + parseInt(m1 || "0", 10);
  const end = to24(h2, ap2) * 60 + parseInt(m2 || "0", 10);
  return { start, end, closed: false };
}

function getOpenStatus(hours) {
  try {
    if (!hours || hours.length === 0) return null;
    const now = new Date();
    const dayIdx = now.getDay();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    for (const item of hours) {
      const days = parseDayRange(item.day);
      if (!days.includes(dayIdx)) continue;
      const range = parseTimeRange(item.time);
      if (!range) return null;
      if (range.closed) return { isOpen: false, label: "Closed Today" };
      if (nowMinutes >= range.start && nowMinutes < range.end) {
        return { isOpen: true, label: "Open Now" };
      }
      return { isOpen: false, label: "Closed Now" };
    }
    return null;
  } catch {
    return null;
  }
}

/* ---------- small visual pieces ---------- */

const Perforation = ({ flip }) => (
  <div
    aria-hidden="true"
    className="w-full h-3"
    style={{
      backgroundImage:
        "radial-gradient(circle at 7px 7px, var(--color-surface-alt) 6px, transparent 6.5px)",
      backgroundSize: "16px 14px",
      backgroundPosition: "left top",
      transform: flip ? "scaleY(-1)" : undefined,
    }}
  />
);

const IconAddress = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconPhone = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const IconMail = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

const IconClock = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconPin = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/* ---------- main component ---------- */

const LocationHours = () => {
  const tenant = useTenant();
  const location = tenant.location || {};

  const status = useMemo(() => getOpenStatus(location.hours), [location.hours]);
  const todayIdx = new Date().getDay();

  if (!location || !location.enabled) {
    return null;
  }

  const {
    headline = "Location & Hours",
    address = "",
    phone = "",
    email = "",
    hours = [],
    mapEmbed = "",
    reservationUrl = "",
  } = location;

  const directionsUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : "";

  return (
    <section className="w-full bg-(--color-surface-alt) py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Header row: headline + live status stamp */}
        <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
           
            <h2 className="bungee-regular text-3xl md:text-4xl lg:text-5xl text-text-main leading-tight tracking-tight">
              {headline}
            </h2>
          </div>

          {/* {status && (
            <div
              className={`self-start -rotate-2 border-2 rounded-sm px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] font-bold ${
                status.isOpen
                  ? "border-accent text-accent"
                  : "border-[var(--color-text-light)] text-[var(--color-text-light)]"
              }`}
            >
              {status.isOpen && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-2 align-middle animate-pulse" />
              )}
              {status.label}
            </div>
          )} */}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* Left: ticket-stub info card */}
          <div className="lg:col-span-5">
            <div className="bg-(--color-surface) rounded-sm overflow-hidden">
              <Perforation />

              <div className="px-6 md:px-8 py-2">
                {/* Address */}
                {address && (
                  <div className="py-5">
                    <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-accent font-semibold mb-2">
                      <IconAddress className="w-3 h-3" />
                      Address
                    </span>
                    <p className="text-base leading-relaxed text-text-main font-medium">
                      {address}
                    </p>
                  </div>
                )}

                {/* Contact — pill buttons */}
                {(phone || email) && (
                  <div className="py-5 border-t border-dashed border-(--color-text-light)/30">
                    <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-accent font-semibold mb-3">
                      <IconPhone className="w-3 h-3" />
                      Contact
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {phone && (
                        <a
                          href={`tel:${phone}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-3 py-2 rounded-sm border border-(--color-text-light)/30 text-text-main hover:border-accent hover:text-accent transition-colors"
                        >
                          <IconPhone className="w-3 h-3" />
                          {phone}
                        </a>
                      )}
                      {email && (
                        <a
                          href={`mailto:${email}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide px-3 py-2 rounded-sm border border-(--color-text-light)/30 text-text-main hover:border-accent hover:text-accent transition-colors"
                        >
                          <IconMail className="w-3 h-3" />
                          Email
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Hours — receipt-style list */}
                {hours && hours.length > 0 && (
                  <div className="py-5 border-t border-dashed border-(--color-text-light)/30">
                    <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-accent font-semibold mb-3">
                      <IconClock className="w-3 h-3" />
                      Hours
                    </span>
                    <div className="flex flex-col gap-2.5">
                      {hours.map((item, index) => {
                        const isToday = parseDayRange(item.day).includes(
                          todayIdx,
                        );
                        return (
                          <div
                            key={index}
                            className="flex items-baseline gap-2"
                          >
                            <span
                              className={`font-mono text-xs uppercase tracking-wide shrink-0 ${
                                isToday
                                  ? "text-accent font-bold"
                                  : "text-(--color-text-light)"
                              }`}
                            >
                              {item.day}
                            </span>
                            <span className="flex-1 border-b border-dotted border-(--color-text-light)/40 translate-y-[-3px]" />
                            <span
                              className={`font-mono text-sm tabular-nums shrink-0 ${
                                isToday
                                  ? "text-accent font-bold"
                                  : "text-text-main font-medium"
                              }`}
                            >
                              {item.time}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Reserve CTA, only if provided by tenant config */}
                {reservationUrl && (
                  <div className="pt-5 pb-3 border-t border-dashed border-(--color-text-light)/30">
                    <a
                      href={reservationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-sm font-semibold uppercase tracking-[0.15em] px-5 py-3 rounded-sm bg-accent text-white hover:opacity-90 transition-opacity"
                    >
                      Reserve a Table
                    </a>
                  </div>
                )}
              </div>

              <Perforation flip />
            </div>
          </div>

          {/* Right: map with floating directions CTA */}
          {mapEmbed && (
            <div className="lg:col-span-7">
              <div className="relative">
                <div className="absolute -inset-2 border border-accent/30 rounded-sm -z-10 translate-x-2 translate-y-2" />
                <div className="relative overflow-hidden rounded-sm bg-(--color-surface) min-h-[320px] md:min-h-[440px] h-full">
                  <div
                    className="w-full h-full grayscale-[0.2] contrast-[1.02]"
                    dangerouslySetInnerHTML={{ __html: mapEmbed }}
                  />
                  {directionsUrl && (
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-(--color-surface) text-text-main text-xs font-semibold uppercase tracking-wide px-4 py-2.5 rounded-sm shadow-md hover:bg-accent hover:text-white transition-colors"
                    >
                      <IconPin className="w-3.5 h-3.5" />
                      Get Directions
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationHours;
