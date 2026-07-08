// import React from "react";
// import { useTenant } from "../context/TenantContext";

// const LocationHours = () => {
//   const tenant = useTenant();
//   const location = tenant.location || {};

//   if (!location || !location.enabled) {
//     return null;
//   }

//   const {
//     headline = "Location & Hours",
//     address = "",
//     phone = "",
//     email = "",
//     hours = [],
//     mapEmbed = "",
//   } = location;

//   return (
//     <section className="w-full bg-[var(--color-surface-alt)] py-24 md:py-32 overflow-hidden">
//       <div className="max-w-[1400px] mx-auto px-6 md:px-12">
//         {/* Eyebrow + headline */}
//         <div className="mb-16 md:mb-20 max-w-3xl">
//           {/* <div className="flex items-center gap-3 mb-6">
//             <span className="h-px w-10 bg-accent" />
//             <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
//               Visit
//             </span>
//           </div> */}
//           <h2 className="bungee-regular text-3xl md:text-4xl lg:text-5xl text-text-main leading-[0.95] tracking-tight">
//             {headline}
//           </h2>
//         </div>

//         {/* Content */}
//         <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-y-14 lg:gap-x-12">
//           {/* Spine — ties the two columns together on large screens */}
//           {mapEmbed && (
//             <div className="hidden lg:block absolute left-[calc(41.666%+1.5rem)] top-2 bottom-2 w-px bg-[var(--color-text-light)]/20">
//               <span className="absolute -left-[3px] top-0 w-[7px] h-[7px] rounded-full bg-accent" />
//             </div>
//           )}

//           {/* Left: Contact info & hours — plain flowing content, no card */}
//           <div className={mapEmbed ? "lg:col-span-5" : "lg:col-span-8"}>
//             <div className="flex flex-col">
//               {/* Address */}
//               {address && (
//                 <div>
//                   <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
//                     <svg
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="w-3.5 h-3.5"
//                     >
//                       <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
//                       <circle cx="12" cy="10" r="3" />
//                     </svg>
//                     Address
//                   </span>
//                   <p className="text-lg leading-relaxed text-text-main font-medium">
//                     {address}
//                   </p>
//                 </div>
//               )}

//               {/* Contact */}
//               {(phone || email) && (
//                 <div
//                   className={
//                     address ? "mt-10 pt-10 border-t border-[var(--color-text-light)]/20" : ""
//                   }
//                 >
//                   <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-3">
//                     <svg
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="w-3.5 h-3.5"
//                     >
//                       <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
//                     </svg>
//                     Contact
//                   </span>
//                   <div className="flex flex-col gap-1.5">
//                     {phone && (
//                       <a
//                         href={`tel:${phone}`}
//                         className="text-base text-text-muted hover:text-accent transition-colors w-fit"
//                       >
//                         {phone}
//                       </a>
//                     )}
//                     {email && (
//                       <a
//                         href={`mailto:${email}`}
//                         className="text-base text-text-muted hover:text-accent transition-colors w-fit"
//                       >
//                         {email}
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Hours */}
//               {hours && hours.length > 0 && (
//                 <div
//                   className={
//                     address || phone || email
//                       ? "mt-10 pt-10 border-t border-[var(--color-text-light)]/20"
//                       : ""
//                   }
//                 >
//                   <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent font-semibold mb-4">
//                     <svg
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       className="w-3.5 h-3.5"
//                     >
//                       <circle cx="12" cy="12" r="10" />
//                       <polyline points="12 6 12 12 16 14" />
//                     </svg>
//                     Hours
//                   </span>
//                   <div className="flex flex-col">
//                     {hours.map((item, index) => (
//                       <div
//                         key={index}
//                         className="flex justify-between items-baseline text-base py-2 border-b border-[var(--color-text-light)]/10 last:border-b-0"
//                       >
//                         <span className="text-[var(--color-text-light)]">
//                           {item.day}
//                         </span>
//                         <span className="text-text-main font-medium tabular-nums">
//                           {item.time}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right: Map — offset frame instead of a shadow box */}
//           {mapEmbed && (
//             <div className="lg:col-span-6 lg:col-start-7">
//               <div className="relative">
//                 <div className="absolute -inset-3 border border-accent/30 rounded-sm -z-10 translate-x-3 translate-y-3" />
//                 <div className="relative overflow-hidden rounded-sm bg-[var(--color-surface)] min-h-[400px] h-full">
//                   <div
//                     className="w-full h-full grayscale-[0.2] contrast-[1.02]"
//                     dangerouslySetInnerHTML={{ __html: mapEmbed }}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LocationHours;

import React from "react";
import { useTenant } from "../context/TenantContext";

const LocationHours = () => {
  const tenant = useTenant();
  const location = tenant.location || {};

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
  } = location;

  return (
    <section className="w-full bg-[var(--color-surface-alt)] py-14 md:py-20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        {/* Eyebrow + headline */}
        <div className="mb-8 md:mb-10 max-w-3xl">
          
          <h2 className="bungee-regular text-3xl md:text-4xl lg:text-5xl text-text-main leading-tight tracking-tight text-text-main">
            {headline}
          </h2>
        </div>

        {/* Content */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-10">
          {/* Spine — ties the two columns together on large screens */}
          {mapEmbed && (
            <div className="hidden lg:block absolute left-[calc(41.666%+1.25rem)] top-1 bottom-1 w-px bg-[var(--color-text-light)]/20">
              <span className="absolute -left-[3px] top-0 w-[7px] h-[7px] rounded-full bg-accent" />
            </div>
          )}

          {/* Left: Contact info & hours — plain flowing content, no card */}
          <div className={mapEmbed ? "lg:col-span-5" : "lg:col-span-8"}>
            <div className="flex flex-col">
              {/* Address */}
              {address && (
                <div>
                  <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-accent font-semibold mb-2">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Address
                  </span>
                  <p className="text-base leading-relaxed text-text-main font-medium">
                    {address}
                  </p>
                </div>
              )}

              {/* Contact */}
              {(phone || email) && (
                <div
                  className={
                    address ? "mt-6 pt-6 border-t border-[var(--color-text-light)]/20" : ""
                  }
                >
                  <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-accent font-semibold mb-2">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Contact
                  </span>
                  <div className="flex flex-col gap-1">
                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="text-sm text-text-muted hover:text-accent transition-colors w-fit"
                      >
                        {phone}
                      </a>
                    )}
                    {email && (
                      <a
                        href={`mailto:${email}`}
                        className="text-sm text-text-muted hover:text-accent transition-colors w-fit"
                      >
                        {email}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Hours */}
              {hours && hours.length > 0 && (
                <div
                  className={
                    address || phone || email
                      ? "mt-6 pt-6 border-t border-[var(--color-text-light)]/20"
                      : ""
                  }
                >
                  <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-accent font-semibold mb-2">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Hours
                  </span>
                  <div className="flex flex-col">
                    {hours.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-baseline text-sm py-1.5 border-b border-[var(--color-text-light)]/10 last:border-b-0"
                      >
                        <span className="text-[var(--color-text-light)]">
                          {item.day}
                        </span>
                        <span className="text-text-main font-medium tabular-nums">
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Map — offset frame instead of a shadow box */}
          {mapEmbed && (
            <div className="lg:col-span-6 lg:col-start-7">
              <div className="relative">
                <div className="absolute -inset-2 border border-accent/30 rounded-sm -z-10 translate-x-2 translate-y-2" />
                <div className="relative overflow-hidden rounded-sm bg-[var(--color-surface)] min-h-[260px] md:min-h-[300px] h-full max-h-[360px]">
                  <div
                    className="w-full h-full grayscale-[0.2] contrast-[1.02]"
                    dangerouslySetInnerHTML={{ __html: mapEmbed }}
                  />
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